"use client";

import { cn } from "@/lib/utils";
import type { SeatMapSeat } from "@/types/flight";

const STATUS_STYLE: Record<string, string> = {
  available: "bg-navy-700 text-chrome border-chrome/20",
  locked: "bg-lavender/20 text-lavender border-lavender/40",
  booked: "bg-navy-900 text-chrome-dim/40 border-transparent",
  blocked: "bg-navy-900 text-chrome-dim/30 border-transparent",
};

export function SeatMapPreview({ seats }: { seats: SeatMapSeat[] }) {
  const rows = Array.from(new Set(seats.map((s) => s.row))).sort(
    (a, b) => Number(a) - Number(b)
  );
  const columns = Array.from(new Set(seats.map((s) => s.column))).sort();

  const byKey = new Map(seats.map((s) => [`${s.row}${s.column}`, s]));

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex flex-col gap-1.5 p-1">
        {rows.slice(0, 12).map((row) => (
          <div key={row} className="flex items-center gap-1.5">
            <span className="w-6 text-right text-[10px] text-chrome-dim">{row}</span>
            {columns.map((col) => {
              const seat = byKey.get(`${row}${col}`);
              if (!seat) return <span key={col} className="size-6" />;
              return (
                <span
                  key={col}
                  title={`${seat.seat_number} · ${seat.status}`}
                  className={cn(
                    "flex size-6 items-center justify-center rounded-md border text-[9px]",
                    STATUS_STYLE[seat.status] ?? STATUS_STYLE.available,
                    seat.is_exit_row && "ring-1 ring-aurora/50"
                  )}
                >
                  {seat.is_window ? "W" : seat.is_aisle ? "A" : ""}
                </span>
              );
            })}
          </div>
        ))}
        {rows.length > 12 && (
          <p className="pt-1 text-center text-[10px] text-chrome-dim">
            +{rows.length - 12} more rows — full seat selection in booking
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-chrome">
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded border border-chrome/20 bg-navy-700" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded border border-lavender/40 bg-lavender/20" /> Held
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded bg-navy-900" /> Booked
        </span>
      </div>
    </div>
  );
}
