"use client";

import { useMemo, useState } from "react";
import { Armchair, DoorOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SeatMapSeat } from "@/types/flight";
import { seatsService } from "@/services/seats.service";
import { useBookingStore } from "@/store/booking-store";
import { getApiErrorMessage } from "@/lib/api-client";
import { toast } from "sonner";

export function SeatMapInteractive({
  seats,
  classType,
}: {
  seats: SeatMapSeat[];
  classType: string;
}) {
  const { selectedSeats, passengerCount, toggleSeat } = useBookingStore();
  const [pendingSeatId, setPendingSeatId] = useState<string | null>(null);
  const [localStatus, setLocalStatus] = useState<Record<string, string>>({});

  const classSeats = useMemo(
    () => seats.filter((s) => s.class_type === classType),
    [seats, classType]
  );

  const rows = useMemo(
    () =>
      Array.from(new Set(classSeats.map((s) => s.row))).sort(
        (a, b) => Number(a) - Number(b)
      ),
    [classSeats]
  );
  const columns = useMemo(
    () => Array.from(new Set(classSeats.map((s) => s.column))).sort(),
    [classSeats]
  );
  const byKey = useMemo(
    () => new Map(classSeats.map((s) => [`${s.row}${s.column}`, s])),
    [classSeats]
  );

  const isMine = (seatId: string) =>
    selectedSeats.some((s) => s.seatId === seatId);

  function effectiveStatus(seat: SeatMapSeat) {
    return localStatus[seat.id] ?? seat.status;
  }

  async function handleClick(seat: SeatMapSeat) {
    const status = effectiveStatus(seat);

    if (isMine(seat.id)) {
      setPendingSeatId(seat.id);
      try {
        await seatsService.unlock(seat.id);
        setLocalStatus((prev) => ({ ...prev, [seat.id]: "available" }));
        toggleSeat({ seatId: seat.id, seatNumber: seat.seat_number });
      } catch (err) {
        toast.error(getApiErrorMessage(err));
      } finally {
        setPendingSeatId(null);
      }
      return;
    }

    if (status !== "available") {
      toast.error(`Seat ${seat.seat_number} isn't available`);
      return;
    }

    if (selectedSeats.length >= passengerCount) {
      toast.error(
        `You can select up to ${passengerCount} seat${passengerCount > 1 ? "s" : ""} for this booking`
      );
      return;
    }

    setPendingSeatId(seat.id);
    try {
      await seatsService.lock(seat.id);
      setLocalStatus((prev) => ({ ...prev, [seat.id]: "locked" }));
      toggleSeat({ seatId: seat.id, seatNumber: seat.seat_number });
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setPendingSeatId(null);
    }
  }

  if (classSeats.length === 0) {
    return (
      <p className="text-sm text-chrome-dim">
        No seat map available for this class yet.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-center gap-2 text-chrome-dim">
        <div className="h-6 w-24 rounded-t-full border border-b-0 border-chrome/20" />
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="mx-auto inline-flex flex-col gap-2">
          {rows.map((row) => (
            <div key={row} className="flex items-center gap-1.5">
              <span className="w-6 text-right text-[10px] text-chrome-dim">
                {row}
              </span>
              {columns.map((col, ci) => {
                const seat = byKey.get(`${row}${col}`);
                const aisleGap =
                  ci > 0 && ci === Math.floor(columns.length / 2);
                if (!seat) {
                  return (
                    <span
                      key={col}
                      className={cn("size-8", aisleGap && "ml-3")}
                    />
                  );
                }
                const status = effectiveStatus(seat);
                const mine = isMine(seat.id);
                const disabled =
                  (status !== "available" && !mine) ||
                  pendingSeatId === seat.id;

                return (
                  <button
                    key={col}
                    type="button"
                    disabled={disabled}
                    onClick={() => handleClick(seat)}
                    title={`${seat.seat_number}${seat.is_exit_row ? " · exit row" : ""}`}
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg border text-[10px] font-medium transition-all duration-200 hover:-translate-y-0.5",
                      aisleGap && "ml-3",
                      mine &&
                        "glow-sky border-aurora bg-aurora text-ink-fixed",
                      !mine &&
                        status === "available" &&
                        "border-chrome/25 bg-navy-800 text-chrome hover:border-aurora/60 hover:text-aurora hover:shadow-[0_0_14px_-4px_var(--sky-blue)]",
                      !mine &&
                        status !== "available" &&
                        "cursor-not-allowed border-transparent bg-navy-900 text-chrome-dim/30 hover:translate-y-0",
                      seat.is_exit_row && !mine && "ring-1 ring-lavender/40"
                    )}
                  >
                    {pendingSeatId === seat.id ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      <Armchair className="size-3.5" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-chrome">
        <span className="flex items-center gap-1.5">
          <span className="flex size-4 items-center justify-center rounded border border-chrome/25 bg-navy-800">
            <Armchair className="size-2.5" />
          </span>
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="flex size-4 items-center justify-center rounded border border-aurora bg-aurora">
            <Armchair className="size-2.5 text-ink-fixed" />
          </span>
          Your seat
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-4 rounded bg-navy-900" />
          Taken
        </span>
        <span className="flex items-center gap-1.5">
          <DoorOpen className="size-3.5 text-lavender" />
          Exit row
        </span>
      </div>
    </div>
  );
}
