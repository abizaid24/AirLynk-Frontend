"use client";

import type { LucideIcon } from "lucide-react";
import { TiltCard } from "@/components/ui/tilt-card";

export function StatCard({
  icon: Icon,
  label,
  value,
  accent = "aurora",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  accent?: "aurora" | "lavender";
}) {
  return (
    <TiltCard className="p-5" strength={6}>
      <div className="flex items-center gap-3">
        <span
          className={
            accent === "aurora"
              ? "flex size-10 items-center justify-center rounded-xl bg-aurora/12 text-aurora"
              : "flex size-10 items-center justify-center rounded-xl bg-lavender/12 text-lavender"
          }
        >
          <Icon className="size-5" />
        </span>
        <div>
          <p className="text-xs uppercase tracking-wider text-chrome-dim">{label}</p>
          <p className="font-display text-xl text-pearl">{value}</p>
        </div>
      </div>
    </TiltCard>
  );
}
