// Mirrors LoyaltyTier + LOYALTY_THRESHOLDS in app/utils/constants.py exactly.

export interface LoyaltyTierMeta {
  value: string;
  label: string;
  threshold: number;
  color: string; // aurora | lavender | pearl | chrome — mapped to CSS vars
  gradient: string;
}

export const LOYALTY_TIERS: LoyaltyTierMeta[] = [
  {
    value: "bronze",
    label: "Bronze",
    threshold: 0,
    color: "#c98a5b",
    gradient: "linear-gradient(135deg,#c98a5b 0%,#8a5a37 100%)",
  },
  {
    value: "silver",
    label: "Silver",
    threshold: 5000,
    color: "#99a3b8",
    gradient: "linear-gradient(135deg,#d7dee8 0%,#7d8699 100%)",
  },
  {
    value: "gold",
    label: "Gold",
    threshold: 15000,
    color: "#e3c04b",
    gradient: "linear-gradient(135deg,#f6dd8a 0%,#b5872a 100%)",
  },
  {
    value: "platinum",
    label: "Platinum",
    threshold: 40000,
    color: "#4be3d1",
    gradient: "linear-gradient(135deg,#b6a6f7 0%,#4be3d1 100%)",
  },
];

export function getTierMeta(tier: string): LoyaltyTierMeta {
  return (
    LOYALTY_TIERS.find((t) => t.value === tier.toLowerCase()) ??
    LOYALTY_TIERS[0]
  );
}

export function tierProgress(points: number, tier: string): number {
  const meta = getTierMeta(tier);
  const idx = LOYALTY_TIERS.findIndex((t) => t.value === meta.value);
  const next = LOYALTY_TIERS[idx + 1];
  if (!next) return 1;
  const span = next.threshold - meta.threshold;
  return Math.min(1, Math.max(0, (points - meta.threshold) / span));
}
