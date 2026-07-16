"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { authService } from "@/services/auth.service";
import type { LoyaltySummary } from "@/types/user";
import { getApiErrorMessage } from "@/lib/api-client";
import { getTierMeta, tierProgress, LOYALTY_TIERS } from "@/lib/loyalty";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { TiltCard } from "@/components/ui/tilt-card";
import { LoyaltyBadgeScene } from "@/components/three/loyalty-badge-scene";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LoyaltyPage() {
  const { isAuthenticated } = useAuthStore();
  const [loyalty, setLoyalty] = useState<LoyaltySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    authService
      .myLoyalty()
      .then(setLoyalty)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="text-chrome">Log in to view your loyalty rewards.</p>
        <Link href="/login">
          <Button className="mt-6">Log in</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-aurora" />
      </div>
    );
  }

  if (error || !loyalty) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="text-chrome">{error ?? "Could not load loyalty data."}</p>
      </div>
    );
  }

  const tier = getTierMeta(loyalty.tier);
  const progress = tierProgress(loyalty.points, loyalty.tier);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 lg:px-0">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-chrome hover:text-aurora"
      >
        <ArrowLeft className="size-4" /> Back to dashboard
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-6"
      >
        <TiltCard className="p-8" strength={5}>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-chrome-dim">
                Loyalty tier
              </p>
              <p
                className="font-display mt-2 text-4xl capitalize"
                style={{ color: tier.color }}
              >
                {tier.label}
              </p>
              <p className="mt-2 text-sm text-chrome">
                {loyalty.points.toLocaleString()} points
              </p>
            </div>
            <div className="relative size-32 shrink-0">
              <LoyaltyBadgeScene color={tier.color} />
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3">
            {LOYALTY_TIERS.map((t) => (
              <div key={t.value} className="flex-1">
                <div className="h-1.5 overflow-hidden rounded-full bg-navy-700">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width:
                        loyalty.points >= t.threshold
                          ? t.value === tier.value
                            ? `${progress * 100}%`
                            : "100%"
                          : "0%",
                      background: t.gradient,
                    }}
                  />
                </div>
                <p
                  className={cn(
                    "mt-1.5 text-[10px] uppercase tracking-wider",
                    t.value === tier.value ? "text-pearl" : "text-chrome-dim"
                  )}
                >
                  {t.label}
                </p>
              </div>
            ))}
          </div>

          {loyalty.next_tier && (
            <p className="mt-4 text-center text-xs text-chrome-dim">
              {loyalty.points_to_next_tier?.toLocaleString()} points to{" "}
              <span className="capitalize text-aurora">{loyalty.next_tier}</span>
            </p>
          )}
        </TiltCard>
      </motion.div>

      <div className="mt-8">
        <h2 className="font-display text-xl text-pearl">Points history</h2>

        {loyalty.transactions.length === 0 ? (
          <div className="glass-panel mt-4 rounded-2xl p-8 text-center text-sm text-chrome">
            No point activity yet — book a flight to start earning.
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            {loyalty.transactions.map((tx) => (
              <div
                key={tx.id}
                className="glass-panel flex items-center justify-between rounded-xl px-5 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg",
                      tx.points >= 0
                        ? "bg-aurora/12 text-aurora"
                        : "bg-destructive/12 text-destructive"
                    )}
                  >
                    {tx.points >= 0 ? (
                      <TrendingUp className="size-4" />
                    ) : (
                      <TrendingDown className="size-4" />
                    )}
                  </span>
                  <div>
                    <p className="text-sm text-pearl">
                      {tx.description ?? tx.type.replace("_", " ")}
                    </p>
                    <p className="text-xs text-chrome-dim">{formatDate(tx.created_at)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      "text-sm",
                      tx.points >= 0 ? "text-aurora" : "text-destructive"
                    )}
                  >
                    {tx.points >= 0 ? "+" : ""}
                    {tx.points.toLocaleString()}
                  </p>
                  <p className="text-xs text-chrome-dim">
                    Balance {tx.balance_after.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
