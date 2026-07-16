"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  PlaneTakeoff,
  Wallet,
  BellRing,
  Sparkles,
  Loader2,
  ArrowRight,
  History,
  Settings,
} from "lucide-react";
import { authService } from "@/services/auth.service";
import { ordersService } from "@/services/orders.service";
import type { LoyaltySummary } from "@/types/user";
import type { OrderResponse } from "@/types/order";
import { getApiErrorMessage } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import { useConciergeStore } from "@/store/concierge-store";
import { TiltCard } from "@/components/ui/tilt-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { LoyaltyCard } from "@/components/dashboard/loyalty-card";
import { UpcomingTripCard } from "@/components/dashboard/upcoming-trip-card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const setConciergeOpen = useConciergeStore((s) => s.setOpen);

  const [loyalty, setLoyalty] = useState<LoyaltySummary | null>(null);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    Promise.all([authService.myLoyalty(), ordersService.list({ page_size: 50 })])
      .then(([loyaltyRes, orderRes]) => {
        setLoyalty(loyaltyRes);
        setOrders(orderRes.items);
      })
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-pearl">Log in to view your dashboard</h1>
        <p className="mt-2 text-sm text-chrome">
          Trips, loyalty rewards, and price alerts live here once you're signed in.
        </p>
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

  const now = Date.now();
  const upcoming = orders
    .filter(
      (o) =>
        (o.status === "confirmed" || o.status === "pending_payment") &&
        o.bookings[0]?.departure_time &&
        new Date(o.bookings[0].departure_time).getTime() > now
    )
    .sort(
      (a, b) =>
        new Date(a.bookings[0].departure_time!).getTime() -
        new Date(b.bookings[0].departure_time!).getTime()
    );

  const past = orders.filter(
    (o) =>
      !upcoming.includes(o) &&
      (o.status === "confirmed" || o.status === "completed")
  );

  const totalSpent = orders
    .filter((o) => o.status !== "cancelled" && o.status !== "draft")
    .reduce((sum, o) => sum + parseFloat(o.total_amount), 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="text-xs uppercase tracking-[0.3em] text-aurora">Dashboard</span>
        <h1 className="font-display mt-2 text-3xl text-pearl sm:text-4xl">
          Welcome back, {user?.full_name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-chrome">
          Here's everything about your AirLynk journeys, in one place.
        </p>
      </motion.div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={PlaneTakeoff} label="Upcoming trips" value={String(upcoming.length)} />
        <StatCard icon={History} label="Past trips" value={String(past.length)} accent="lavender" />
        <StatCard
          icon={Wallet}
          label="Total spent"
          value={totalSpent.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
        />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-pearl">Upcoming trips</h2>
            <Link href="/orders" className="flex items-center gap-1 text-sm text-aurora hover:underline">
              All bookings <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {error && <p className="mt-4 text-sm text-chrome">{error}</p>}

          {!error && upcoming.length === 0 && (
            <div className="glass-panel mt-4 rounded-2xl p-8 text-center">
              <p className="text-pearl">No upcoming trips yet.</p>
              <Link href="/">
                <Button className="mt-4">Search flights</Button>
              </Link>
            </div>
          )}

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {upcoming.slice(0, 4).map((order) => (
              <UpcomingTripCard key={order.id} order={order} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {loyalty && <LoyaltyCard loyalty={loyalty} />}

          <TiltCard className="p-5" strength={6}>
            <h3 className="flex items-center gap-2 text-sm text-pearl">
              <Sparkles className="size-4 text-aurora" /> AI Travel Concierge
            </h3>
            <p className="mt-1.5 text-xs text-chrome-dim">
              Ask about fares, baggage, or where to fly next.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full"
              onClick={() => setConciergeOpen(true)}
            >
              Open concierge
            </Button>
          </TiltCard>

          <TiltCard className="p-5" strength={6}>
            <h3 className="flex items-center gap-2 text-sm text-pearl">
              <BellRing className="size-4 text-lavender" /> Price alerts
            </h3>
            <p className="mt-1.5 text-xs text-chrome-dim">
              Get notified when a route drops to your target price.
            </p>
            <Link href="/price-alerts">
              <Button variant="outline" size="sm" className="mt-4 w-full">
                Manage alerts
              </Button>
            </Link>
          </TiltCard>

          <Link href="/dashboard/profile">
            <TiltCard className="flex items-center justify-between p-5" strength={6}>
              <span className="flex items-center gap-2 text-sm text-pearl">
                <Settings className="size-4 text-chrome" /> Profile settings
              </span>
              <ArrowRight className="size-4 text-chrome-dim" />
            </TiltCard>
          </Link>
        </div>
      </div>
    </div>
  );
}
