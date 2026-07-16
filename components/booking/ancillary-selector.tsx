"use client";

import {
  Luggage,
  Utensils,
  Sofa,
  Zap,
  MoveVertical,
  ShieldCheck,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { ANCILLARY_TYPES } from "@/types/order";
import { useBookingStore } from "@/store/booking-store";

const ICONS: Record<string, LucideIcon> = {
  luggage: Luggage,
  utensils: Utensils,
  sofa: Sofa,
  zap: Zap,
  "move-vertical": MoveVertical,
  "shield-check": ShieldCheck,
  wifi: Wifi,
};

export function AncillarySelector() {
  const { ancillaries, toggleAncillary, passengerCount } = useBookingStore();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {ANCILLARY_TYPES.map((item) => {
        const Icon = ICONS[item.icon] ?? Luggage;
        const selected = ancillaries.some((a) => a.type === item.value);
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => toggleAncillary(item.value)}
            className={cn(
              "flex items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-300",
              selected
                ? "glow-sky border-aurora bg-aurora/5"
                : "border-border hover:-translate-y-0.5 hover:border-aurora/40"
            )}
          >
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg",
                selected ? "bg-aurora text-ink-fixed" : "bg-navy-700 text-aurora"
              )}
            >
              <Icon className="size-4" />
            </span>
            <div className="flex-1">
              <p className="text-sm text-pearl">{item.label}</p>
              <p className="text-xs text-chrome-dim">
                {formatCurrency(item.price, "USD")} × {passengerCount} passenger
                {passengerCount > 1 ? "s" : ""}
              </p>
            </div>
            <div
              className={cn(
                "mt-0.5 size-4 shrink-0 rounded-full border",
                selected ? "border-aurora bg-aurora" : "border-chrome/30"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
