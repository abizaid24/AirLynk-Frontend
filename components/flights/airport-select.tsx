"use client";

import { useState } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { AIRPORTS, searchAirports } from "@/lib/airports";
import type { AirportOption } from "@/store/search-store";

export function AirportSelect({
  label,
  value,
  onChange,
  exclude,
}: {
  label: string;
  value: AirportOption | null;
  onChange: (a: AirportOption) => void;
  exclude?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = searchAirports(query).filter((a) => a.iata !== exclude);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className="flex w-full flex-col items-start gap-0.5 rounded-xl border border-input bg-navy-900/60 px-4 py-2.5 text-left outline-none transition-colors hover:border-aurora/60 focus-visible:border-aurora"
        >
          <span className="text-[10px] font-medium uppercase tracking-wider text-chrome-dim">
            {label}
          </span>
          <span className="flex items-center gap-1.5 text-base font-medium text-pearl">
            <MapPin className="size-3.5 text-aurora" />
            {value ? `${value.city} · ${value.iata}` : "Select airport"}
          </span>
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={10}
          className={cn(
            "glass-panel-elevated z-50 w-[320px] rounded-2xl p-2",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        >
          <div className="flex items-center gap-2 rounded-xl border border-input bg-navy-900/60 px-3 py-2">
            <Search className="size-4 text-chrome-dim" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city or airport code"
              className="w-full bg-transparent text-sm text-pearl outline-none placeholder:text-chrome-dim"
            />
          </div>
          <div className="mt-2 max-h-64 overflow-y-auto">
            {results.length === 0 && (
              <p className="px-3 py-6 text-center text-sm text-chrome-dim">
                No airports found.
              </p>
            )}
            {results.map((a) => (
              <button
                key={a.iata}
                type="button"
                onClick={() => {
                  onChange(a);
                  setOpen(false);
                  setQuery("");
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-white/5"
              >
                <span>
                  <span className="block text-sm text-pearl">
                    {a.city}, {a.country}
                  </span>
                  <span className="block text-xs text-chrome-dim">{a.name}</span>
                </span>
                <span className="font-mono text-xs text-aurora">{a.iata}</span>
              </button>
            ))}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

export { AIRPORTS };
