"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Seats", "Passengers", "Extras", "Review"];

export function BookingStepper({ current }: { current: number }) {
  return (
    <div className="mx-auto flex max-w-md items-center justify-between">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border text-xs font-medium transition-all duration-300",
                  done && "border-aurora bg-aurora text-ink-fixed",
                  active && "glow-sky border-aurora text-aurora",
                  !done && !active && "border-chrome/25 text-chrome-dim"
                )}
              >
                {done ? <Check className="size-4" /> : step}
              </div>
              <span
                className={cn(
                  "text-[10px] uppercase tracking-wider",
                  active ? "text-aurora" : "text-chrome-dim"
                )}
              >
                {label}
              </span>
            </div>
            {step !== STEPS.length && (
              <div
                className={cn(
                  "mx-2 h-px flex-1",
                  done ? "bg-aurora" : "bg-chrome/15"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
