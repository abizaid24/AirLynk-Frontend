"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  PlaneTakeoff,
  Clock,
  Star,
  MapPin,
  Luggage,
  Loader2,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { flightsService } from "@/services/flights.service";
import type { FlightDetail, SeatMapResponse } from "@/types/flight";
import {
  formatCurrency,
  formatClassType,
  formatDate,
  formatDuration,
  formatTime,
} from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/api-client";
import { SeatMapPreview } from "@/components/flights/seat-map-preview";
import { ReviewSection } from "@/components/flights/review-section";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/store/booking-store";

export default function FlightDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const passengers = Math.max(1, Number(searchParams.get("passengers") ?? 1));
  const preferredClass = searchParams.get("class_type") ?? undefined;
  const startBooking = useBookingStore((s) => s.startBooking);

  const [flight, setFlight] = useState<FlightDetail | null>(null);
  const [seatMap, setSeatMap] = useState<SeatMapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([flightsService.getById(id), flightsService.getSeatMap(id)])
      .then(([f, s]) => {
        setFlight(f);
        setSeatMap(s);
      })
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  function handleSelectClass(classId: string) {
    startBooking(id, classId, passengers);
    router.push(`/booking/${id}`);
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-aurora" />
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="text-chrome">{error ?? "Flight not found."}</p>
        <Link href="/search">
          <Button className="mt-6">Back to search</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-4xl px-6 py-16 lg:px-0">
      <Link
        href="/search"
        className="inline-flex items-center gap-1.5 text-sm text-chrome hover:text-aurora"
      >
        <ArrowLeft className="size-4" /> Back to results
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel mt-6 rounded-3xl p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-aurora">
              {flight.airline_code} {flight.flight_number} · {flight.aircraft_type}
            </span>
            <h1 className="font-display mt-2 text-3xl text-pearl sm:text-4xl">
              {flight.origin.city} → {flight.destination.city}
            </h1>
            <p className="mt-1 text-sm text-chrome">{formatDate(flight.departure_time)}</p>
          </div>
          {flight.average_rating != null && (
            <div className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-pearl">
              <Star className="size-4 fill-lavender text-lavender" />
              {flight.average_rating.toFixed(1)}
              <span className="text-chrome-dim">({flight.review_count})</span>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center gap-4">
          <div className="text-center">
            <p className="font-display text-2xl text-pearl">
              {formatTime(flight.departure_time)}
            </p>
            <p className="text-sm text-chrome-dim">{flight.origin.iata_code}</p>
          </div>
          <div className="flex flex-1 flex-col items-center gap-1">
            <span className="text-xs text-chrome-dim">
              {formatDuration(flight.duration_minutes)}
            </span>
            <div className="relative h-px w-full bg-border">
              <PlaneTakeoff className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 text-aurora" />
            </div>
            <span className="text-xs text-chrome-dim">
              {flight.stops === 0 ? "Nonstop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
            </span>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl text-pearl">
              {formatTime(flight.arrival_time)}
            </p>
            <p className="text-sm text-chrome-dim">{flight.destination.iata_code}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div className="rounded-xl border border-border p-3">
            <span className="flex items-center gap-1.5 text-chrome-dim">
              <MapPin className="size-3.5" /> Gate
            </span>
            <p className="mt-1 text-pearl">{flight.gate ?? "TBA"}</p>
          </div>
          <div className="rounded-xl border border-border p-3">
            <span className="flex items-center gap-1.5 text-chrome-dim">
              <MapPin className="size-3.5" /> Terminal
            </span>
            <p className="mt-1 text-pearl">{flight.terminal ?? "TBA"}</p>
          </div>
          <div className="rounded-xl border border-border p-3">
            <span className="flex items-center gap-1.5 text-chrome-dim">
              <Clock className="size-3.5" /> Duration
            </span>
            <p className="mt-1 text-pearl">{formatDuration(flight.duration_minutes)}</p>
          </div>
          <div className="rounded-xl border border-border p-3">
            <span className="flex items-center gap-1.5 text-chrome-dim">
              <Luggage className="size-3.5" /> Baggage
            </span>
            <p className="mt-1 text-pearl">
              {flight.classes[0]?.baggage_kg ?? "—"}kg
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        <div className="glass-panel rounded-3xl p-6">
          <h2 className="font-display text-lg text-pearl">Choose your travel experience</h2>
          <p className="mt-1 text-xs text-chrome-dim">
            {passengers} passenger{passengers > 1 ? "s" : ""} · select a class to continue
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {flight.classes.map((c) => {
              const soldOut = c.available_seats < passengers;
              const recommended = preferredClass === c.class_type;
              return (
                <button
                  key={c.id}
                  disabled={soldOut}
                  onClick={() => handleSelectClass(c.id)}
                  className={`group flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    recommended
                      ? "border-aurora bg-aurora/5"
                      : "border-border hover:border-aurora/50"
                  }`}
                >
                  <div>
                    <p className="flex items-center gap-2 text-sm text-pearl">
                      {formatClassType(c.class_type)}
                      {recommended && (
                        <span className="rounded-full bg-aurora/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-aurora">
                          Your pick
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-chrome-dim">
                      {soldOut
                        ? "Not enough seats available"
                        : `${c.available_seats}/${c.total_seats} seats left · ${c.baggage_kg}kg`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg text-aurora">
                      {formatCurrency(c.current_price, flight.currency)}
                    </span>
                    <ChevronRight className="size-4 text-chrome-dim transition-transform group-hover:translate-x-0.5 group-hover:text-aurora" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6">
          <h2 className="font-display text-lg text-pearl">Cabin preview</h2>
          <p className="mt-1 text-xs text-chrome-dim">
            Live seat map from AirLynk — W = window, A = aisle
          </p>
          <div className="mt-4">
            {seatMap && seatMap.seats.length > 0 ? (
              <SeatMapPreview seats={seatMap.seats} />
            ) : (
              <p className="text-sm text-chrome-dim">Seat map not available yet.</p>
            )}
          </div>
        </div>

        <ReviewSection flightId={id} />
      </motion.div>
    </div>
  );
}
