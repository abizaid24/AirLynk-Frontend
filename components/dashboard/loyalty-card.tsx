"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { TiltCard } from "@/components/ui/tilt-card";
import { getTierMeta, tierProgress } from "@/lib/loyalty";
import type { LoyaltySummary } from "@/types/user";
import { LoyaltyBadgeScene } from "@/components/three/loyalty-badge-scene";

export function LoyaltyCard({ loyalty }: { loyalty: LoyaltySummary }) {
  const tier = getTierMeta(loyalty.tier);
  const progress = tierProgress(loyalty.points, loyalty.tier);

  return (
    <Link href="/dashboard/loyalty">
      <TiltCard className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-chrome-dim">
              Loyalty status
            </p>
            <p
              className="font-display mt-2 text-2xl capitalize"
              style={{ color: tier.color }}
            >
              {tier.label}
            </p>
            <p className="mt-1 text-sm text-chrome">
              {loyalty.points.toLocaleString()} points
            </p>
          </div>
          <div className="relative size-20 shrink-0">
            <LoyaltyBadgeScene color={tier.color} />
          </div>
        </div>

        {loyalty.next_tier && (
          <div className="mt-5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-navy-700">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progress * 100}%`, background: tier.gradient }}
              />
            </div>
            <p className="mt-2 text-xs text-chrome-dim">
              {loyalty.points_to_next_tier?.toLocaleString()} points to{" "}
              <span className="capitalize text-pearl">{loyalty.next_tier}</span>
            </p>
          </div>
        )}

        <div className="mt-4 flex items-center gap-1 text-xs text-aurora">
          View rewards history <ChevronRight className="size-3.5" />
        </div>
      </TiltCard>
    </Link>
  );
}
