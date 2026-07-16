"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PlaneTakeoff, Clock, Gauge } from "lucide-react";
import type { FlightListItem } from "@/types/flight";
import { formatCurrency, formatDuration, formatTime } from "@/lib/utils";

export function FlightCard({
  flight,
  index = 0,
  passengers,
  classType,
}: {
  flight: FlightListItem;
  index?: number;
  passengers?: number;
  classType?: string;
}) {
  const price = flight.lowest_price ?? flight.base_price;
  const query = new URLSearchParams();
  if (passengers) query.set("passengers", String(passengers));
  if (classType) query.set("class_type", classType);
  const href = `/flights/${flight.id}${query.toString() ? `?${query.toString()}` : ""}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
    >
      <Link
        href={href}
        className="glass-panel group flex flex-col gap-4 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-aurora/60 hover:shadow-[0_24px_60px_-20px_var(--shadow-tone),0_0_24px_-8px_var(--sky-blue)] sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy-700 text-aurora transition-all duration-300 group-hover:shadow-[0_0_16px_-2px_var(--sky-blue)]">
            <PlaneTakeoff className="size-5" />
          </span>
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-chrome-dim">
              <span>{flight.airline_code} {flight.flight_number}</span>
              <span>·</span>
              <span>{flight.aircraft_type}</span>
            </div>
            <div className="mt-1 flex items-center gap-3 font-display text-lg text-pearl">
              <span>{formatTime(flight.departure_time)}</span>
              <span className="text-chrome-dim">
                {flight.origin.iata_code} → {flight.destination.iata_code}
              </span>
              <span>{formatTime(flight.arrival_time)}</span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-chrome">
              <span className="flex items-center gap-1">
                <Clock className="size-3" /> {formatDuration(flight.duration_minutes)}
              </span>
              <span>{flight.stops === 0 ? "Nonstop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}</span>
              {flight.carbon_kg_per_passenger && (
                <span className="flex items-center gap-1">
                  <Gauge className="size-3" /> {Math.round(flight.carbon_kg_per_passenger)}kg CO₂
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
          <div className="text-right">
            <span className="block text-xs text-chrome-dim">from</span>
            <span className="font-display text-2xl text-aurora">
              {formatCurrency(price, flight.currency)}
            </span>
          </div>
          <span className="rounded-full border border-aurora/30 px-4 py-1.5 text-xs text-aurora transition-colors group-hover:bg-aurora group-hover:text-ink-fixed">
            View flight
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
