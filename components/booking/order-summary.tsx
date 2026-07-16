"use client";

import { PlaneTakeoff } from "lucide-react";
import { formatCurrency, formatClassType, formatDate, formatTime } from "@/lib/utils";
import { ANCILLARY_TYPES } from "@/types/order";
import type { FlightDetail } from "@/types/flight";
import { useBookingStore } from "@/store/booking-store";

export function OrderSummary({ flight }: { flight: FlightDetail }) {
  const { classId, passengerCount, selectedSeats, ancillaries } = useBookingStore();
  const flightClass = flight.classes.find((c) => c.id === classId);
  const currency = flight.currency;

  const fareTotal = flightClass
    ? parseFloat(flightClass.current_price) * passengerCount
    : 0;
  const ancillaryTotal = ancillaries.reduce((sum, a) => {
    const def = ANCILLARY_TYPES.find((t) => t.value === a.type);
    return sum + (def ? def.price * passengerCount : 0);
  }, 0);
  const taxes = fareTotal * 0.08;
  const total = fareTotal + ancillaryTotal + taxes;

  return (
    <div className="glass-panel sticky top-24 rounded-3xl p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-aurora">
        <PlaneTakeoff className="size-3.5" /> Trip summary
      </div>
      <h3 className="font-display mt-2 text-lg text-pearl">
        {flight.origin.city} → {flight.destination.city}
      </h3>
      <p className="mt-1 text-xs text-chrome-dim">
        {formatDate(flight.departure_time)} · {formatTime(flight.departure_time)} –{" "}
        {formatTime(flight.arrival_time)}
      </p>

      <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between text-chrome">
          <span>
            {flightClass ? formatClassType(flightClass.class_type) : "Fare"} ×{" "}
            {passengerCount}
          </span>
          <span className="text-pearl">{formatCurrency(fareTotal, currency)}</span>
        </div>
        {selectedSeats.length > 0 && (
          <div className="flex justify-between text-chrome">
            <span>Seats</span>
            <span className="text-pearl">
              {selectedSeats.map((s) => s.seatNumber).join(", ")}
            </span>
          </div>
        )}
        {ancillaries.length > 0 && (
          <div className="flex justify-between text-chrome">
            <span>Extras ({ancillaries.length})</span>
            <span className="text-pearl">
              {formatCurrency(ancillaryTotal, currency)}
            </span>
          </div>
        )}
        <div className="flex justify-between text-chrome">
          <span>Taxes & fees (est.)</span>
          <span className="text-pearl">{formatCurrency(taxes, currency)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm text-chrome">Total</span>
        <span className="font-display text-2xl text-aurora">
          {formatCurrency(total, currency)}
        </span>
      </div>
    </div>
  );
}
