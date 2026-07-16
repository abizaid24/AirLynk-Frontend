"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { PlaneTakeoff, SlidersHorizontal } from "lucide-react";
import { flightsService } from "@/services/flights.service";
import type { PaginatedFlights } from "@/types/flight";
import { FLIGHT_CLASSES } from "@/types/flight";
import { FlightCard } from "@/components/flights/flight-card";
import { FlightCardSkeleton } from "@/components/flights/flight-card-skeleton";
import { getApiErrorMessage } from "@/lib/api-client";
import { findAirport } from "@/lib/airports";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const origin = searchParams.get("origin") ?? "";
  const destination = searchParams.get("destination") ?? "";
  const date = searchParams.get("date") ?? undefined;
  const passengers = Number(searchParams.get("passengers") ?? 1);
  const classType = searchParams.get("class_type") ?? undefined;
  const sortBy = (searchParams.get("sort_by") as "price" | "duration" | "departure") || "price";

  const [data, setData] = useState<PaginatedFlights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const originAirport = findAirport(origin);
  const destAirport = findAirport(destination);

  useEffect(() => {
    if (!origin || !destination) return;
    setLoading(true);
    setError(null);
    flightsService
      .search({ origin, destination, date, passengers, class_type: classType, sort_by: sortBy })
      .then(setData)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [origin, destination, date, passengers, classType, sortBy]);

  function updateSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort_by", value);
    router.push(`/search?${params.toString()}`);
  }

  if (!origin || !destination) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <PlaneTakeoff className="mx-auto size-10 text-chrome-dim" />
        <h1 className="font-display mt-4 text-2xl text-pearl">
          Start your search
        </h1>
        <p className="mt-2 text-chrome">
          Head back to the homepage to choose a departure and destination.
        </p>
        <Button className="mt-6" onClick={() => router.push("/")}>
          Back to search
        </Button>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-4xl px-6 py-16 lg:px-0">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-xs uppercase tracking-[0.3em] text-aurora">
          Flight results
        </span>
        <h1 className="font-display mt-2 text-3xl text-pearl sm:text-4xl">
          {originAirport?.city ?? origin} → {destAirport?.city ?? destination}
        </h1>
        <p className="mt-1 text-sm text-chrome">
          {date ? new Date(date).toDateString() : "Any date"} · {passengers}{" "}
          passenger{passengers > 1 ? "s" : ""} ·{" "}
          {FLIGHT_CLASSES.find((c) => c.value === classType)?.label ?? "Economy"}
        </p>
      </motion.div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <span className="text-sm text-chrome">
          {loading ? "Searching…" : `${data?.total ?? 0} flights found`}
        </span>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-chrome-dim" />
          <Select value={sortBy} onValueChange={updateSort}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Cheapest</SelectItem>
              <SelectItem value="duration">Shortest</SelectItem>
              <SelectItem value="departure">Earliest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => <FlightCardSkeleton key={i} />)}

        {!loading && error && (
          <div className="glass-panel rounded-2xl p-8 text-center text-chrome">
            {error}
          </div>
        )}

        {!loading && !error && data?.items.length === 0 && (
          <div className="glass-panel rounded-2xl p-10 text-center">
            <PlaneTakeoff className="mx-auto size-8 text-chrome-dim" />
            <p className="mt-3 text-pearl">No flights match this route yet.</p>
            <p className="mt-1 text-sm text-chrome">
              Try a different date or nearby airport.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          data?.items.map((flight, i) => (
            <FlightCard
              key={flight.id}
              flight={flight}
              index={i}
              passengers={passengers}
              classType={classType}
            />
          ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchResults />
    </Suspense>
  );
}
