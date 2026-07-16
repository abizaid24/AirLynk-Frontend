"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeftRight, CalendarDays, Users, PlaneTakeoff } from "lucide-react";
import { AirportSelect } from "@/components/flights/airport-select";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchStore } from "@/store/search-store";
import { FLIGHT_CLASSES } from "@/types/flight";
import { findAirport } from "@/lib/airports";
import { toast } from "sonner";

export function FlightSearchPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const panelRef = useRef<HTMLDivElement>(null);
  const {
    origin,
    destination,
    date,
    passengers,
    classType,
    setOrigin,
    setDestination,
    setDate,
    setPassengers,
    setClassType,
  } = useSearchStore();

  const [swapping, setSwapping] = useState(false);

  // Prefill from a ?destination=IATA link (e.g. the footer's Destinations
  // column) so those links do something real instead of just decorating.
  useEffect(() => {
    const destIata = searchParams.get("destination");
    if (!destIata) return;
    const airport = findAirport(destIata);
    if (airport) {
      setDestination(airport);
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function handleSwap() {
    setSwapping(true);
    const o = origin;
    setOrigin(destination);
    setDestination(o);
    setTimeout(() => setSwapping(false), 300);
  }

  function handleSearch() {
    if (!origin || !destination) {
      toast.error("Choose both a departure and destination airport");
      return;
    }
    if (origin.iata === destination.iata) {
      toast.error("Origin and destination must be different");
      return;
    }
    const params = new URLSearchParams({
      origin: origin.iata,
      destination: destination.iata,
      passengers: String(passengers),
      class_type: classType,
    });
    if (date) params.set("date", date);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="glass-panel-elevated gradient-border-glow relative w-full max-w-4xl rounded-3xl p-5 sm:p-7"
    >
      <div className="mb-5 flex items-center gap-2 text-left">
        <span className="flex size-8 items-center justify-center rounded-full bg-navy-700 text-aurora">
          <PlaneTakeoff className="size-4" />
        </span>
        <div>
          <h2 className="font-display text-base font-semibold text-pearl">
            Find Your Perfect Flight
          </h2>
          <p className="text-xs text-chrome">
            AI fare intelligence across every route, every cabin.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_auto_auto_auto]">
        <AirportSelect
          label="Departure Airport"
          value={origin}
          onChange={setOrigin}
          exclude={destination?.iata}
        />

        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap origin and destination"
            className={`flex size-9 items-center justify-center rounded-full border border-aurora/30 bg-navy-900/60 text-aurora transition-all duration-300 hover:border-aurora hover:shadow-[0_0_16px_-2px_var(--sky-blue)] ${
              swapping ? "rotate-180" : ""
            }`}
          >
            <ArrowLeftRight className="size-4" />
          </button>
        </div>

        <AirportSelect
          label="Arrival Airport"
          value={destination}
          onChange={setDestination}
          exclude={origin?.iata}
        />

        <label className="group flex flex-col items-start gap-0.5 rounded-xl border border-input bg-navy-900/60 px-4 py-2.5 transition-colors focus-within:border-aurora hover:border-aurora/40">
          <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-chrome-dim">
            <CalendarDays className="size-3.5 text-aurora" /> Departure Date
          </span>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-transparent text-sm text-pearl outline-none [color-scheme:dark]"
          />
        </label>

        <label className="group flex flex-col items-start gap-0.5 rounded-xl border border-input bg-navy-900/60 px-4 py-2.5 transition-colors focus-within:border-aurora hover:border-aurora/40">
          <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-chrome-dim">
            <Users className="size-3.5 text-aurora" /> Travellers
          </span>
          <select
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
            className="w-full bg-transparent text-sm text-pearl outline-none"
          >
            {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n} className="bg-navy-800">
                {n} {n === 1 ? "traveller" : "travellers"}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col gap-0.5">
          <Select value={classType} onValueChange={setClassType}>
            <SelectTrigger className="h-full">
              <SelectValue placeholder="Cabin Class" />
            </SelectTrigger>
            <SelectContent>
              {FLIGHT_CLASSES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button size="lg" className="mt-5 w-full sm:w-auto" onClick={handleSearch}>
        <PlaneTakeoff className="size-4" />
        Search Flights
      </Button>
    </motion.div>
  );
}
