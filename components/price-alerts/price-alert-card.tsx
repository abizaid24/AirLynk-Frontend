"use client";

import { Trash2, TrendingDown, Loader2 } from "lucide-react";
import { TiltCard } from "@/components/ui/tilt-card";
import { formatCurrency, formatDate, formatClassType } from "@/lib/utils";
import type { PriceAlertResponse } from "@/types/price-alert";
import { Button } from "@/components/ui/button";

export function PriceAlertCard({
  alert,
  onDelete,
  deleting,
}: {
  alert: PriceAlertResponse;
  onDelete: () => void;
  deleting: boolean;
}) {
  const hasHit =
    alert.last_lowest_price !== null &&
    alert.last_lowest_price !== undefined &&
    parseFloat(alert.last_lowest_price) <= parseFloat(alert.target_price);

  return (
    <TiltCard className="p-5" strength={5}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-lg text-pearl">
            {alert.origin_code} → {alert.destination_code}
          </p>
          <p className="mt-1 text-xs text-chrome-dim">
            {alert.class_type ? formatClassType(alert.class_type) : "Any class"} · Target{" "}
            <span className="text-aurora">
              {formatCurrency(alert.target_price, alert.currency)}
            </span>
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-chrome-dim hover:text-destructive"
          onClick={onDelete}
          disabled={deleting}
        >
          {deleting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2 className="size-4" />
          )}
        </Button>
      </div>

      {alert.last_lowest_price && (
        <div
          className={
            hasHit
              ? "mt-4 flex items-center gap-2 rounded-lg border border-aurora/30 bg-aurora/10 px-3 py-2 text-xs text-aurora"
              : "mt-4 flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-chrome"
          }
        >
          <TrendingDown className="size-3.5" />
          Lowest seen: {formatCurrency(alert.last_lowest_price, alert.currency)}
          {hasHit && " — target reached!"}
        </div>
      )}

      <p className="mt-3 text-[11px] text-chrome-dim">
        Watching since {formatDate(alert.created_at)}
      </p>
    </TiltCard>
  );
}
