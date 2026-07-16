"use client";

import Link from "next/link";
import { PlaneTakeoff } from "lucide-react";
import { TiltCard } from "@/components/ui/tilt-card";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import type { OrderResponse } from "@/types/order";

export function UpcomingTripCard({ order }: { order: OrderResponse }) {
  const booking = order.bookings[0];
  if (!booking) return null;

  return (
    <Link href={`/orders/${order.id}`}>
      <TiltCard className="p-5" strength={6}>
        <div className="flex items-center justify-between">
          <span className="flex size-10 items-center justify-center rounded-xl bg-aurora/12 text-aurora">
            <PlaneTakeoff className="size-5" />
          </span>
          <span className="rounded-full border border-aurora/30 bg-aurora/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-aurora">
            {order.status.replace("_", " ")}
          </span>
        </div>
        <p className="font-display mt-4 text-lg text-pearl">
          {booking.origin_code} → {booking.destination_code}
        </p>
        <p className="mt-1 text-sm text-chrome">
          {booking.departure_time && formatDate(booking.departure_time)}
          {booking.departure_time && ` · ${formatTime(booking.departure_time)}`}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
          <span className="text-chrome-dim">{order.order_reference}</span>
          <span className="text-aurora">
            {formatCurrency(order.total_amount, order.currency)}
          </span>
        </div>
      </TiltCard>
    </Link>
  );
}
