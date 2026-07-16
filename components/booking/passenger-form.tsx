"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBookingStore } from "@/store/booking-store";
import type { PassengerCreatePayload } from "@/types/order";
import { useAuthStore } from "@/store/auth-store";

export function PassengerForm() {
  const { selectedSeats, passengers, setPassengers } = useBookingStore();
  const user = useAuthStore((s) => s.user);

  const [drafts, setDrafts] = useState<PassengerCreatePayload[]>(() =>
    selectedSeats.map((seat, i) => {
      const existing = passengers[i];
      return (
        existing ?? {
          full_name: i === 0 && user ? user.full_name : "",
          passenger_type: "adult",
          seat_id: seat.seatId,
          email: i === 0 && user ? user.email : "",
          phone: i === 0 && user?.phone ? user.phone : "",
          passport_no: "",
          nationality: "",
          dob: "",
        }
      );
    })
  );

  useEffect(() => {
    // keep seat_id in sync in case seat order changed
    setDrafts((prev) =>
      selectedSeats.map((seat, i) => ({
        ...(prev[i] ?? { full_name: "", passenger_type: "adult" }),
        seat_id: seat.seatId,
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSeats.map((s) => s.seatId).join(",")]);

  useEffect(() => {
    setPassengers(drafts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drafts]);

  function update(i: number, patch: Partial<PassengerCreatePayload>) {
    setDrafts((prev) =>
      prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p))
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {selectedSeats.map((seat, i) => (
        <div key={seat.seatId} className="rounded-2xl border border-border p-5">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-navy-700 text-aurora">
              <User className="size-4" />
            </span>
            <div>
              <p className="text-sm text-pearl">Passenger {i + 1}</p>
              <p className="text-xs text-chrome-dim">Seat {seat.seatNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor={`name-${i}`}>Full name</Label>
              <Input
                id={`name-${i}`}
                required
                placeholder="As shown on passport"
                value={drafts[i]?.full_name ?? ""}
                onChange={(e) => update(i, { full_name: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`type-${i}`}>Passenger type</Label>
              <Select
                value={drafts[i]?.passenger_type ?? "adult"}
                onValueChange={(v) =>
                  update(i, { passenger_type: v as PassengerCreatePayload["passenger_type"] })
                }
              >
                <SelectTrigger id={`type-${i}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adult">Adult</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="infant">Infant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`dob-${i}`}>Date of birth</Label>
              <Input
                id={`dob-${i}`}
                type="date"
                className="[color-scheme:dark]"
                value={drafts[i]?.dob?.slice(0, 10) ?? ""}
                onChange={(e) => update(i, { dob: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`passport-${i}`}>Passport number</Label>
              <Input
                id={`passport-${i}`}
                placeholder="Optional"
                value={drafts[i]?.passport_no ?? ""}
                onChange={(e) => update(i, { passport_no: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`nat-${i}`}>Nationality</Label>
              <Input
                id={`nat-${i}`}
                placeholder="Optional"
                value={drafts[i]?.nationality ?? ""}
                onChange={(e) => update(i, { nationality: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`email-${i}`}>Email</Label>
              <Input
                id={`email-${i}`}
                type="email"
                placeholder="Optional"
                value={drafts[i]?.email ?? ""}
                onChange={(e) => update(i, { email: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`phone-${i}`}>Phone</Label>
              <Input
                id={`phone-${i}`}
                placeholder="Optional"
                value={drafts[i]?.phone ?? ""}
                onChange={(e) => update(i, { phone: e.target.value })}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
