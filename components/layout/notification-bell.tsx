"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, PlaneTakeoff, TrendingDown, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ordersService } from "@/services/orders.service";
import { priceAlertsService } from "@/services/price-alerts.service";
import { useAuthStore } from "@/store/auth-store";
import { formatDate, formatTime, formatCurrency } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface DerivedNotification {
  id: string;
  kind: "upcoming-trip" | "price-drop";
  title: string;
  detail: string;
  href: string;
}

const UPCOMING_WINDOW_HOURS = 72;

export function NotificationBell() {
  const { isAuthenticated } = useAuthStore();
  const [items, setItems] = useState<DerivedNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;
    setLoading(true);

    Promise.allSettled([
      ordersService.list({ page: 1, page_size: 20 }),
      priceAlertsService.list(),
    ]).then(([ordersRes, alertsRes]) => {
      if (cancelled) return;
      const derived: DerivedNotification[] = [];
      const now = Date.now();

      if (ordersRes.status === "fulfilled") {
        for (const order of ordersRes.value.items) {
          if (order.status !== "confirmed") continue;
          const booking = order.bookings[0];
          if (!booking?.departure_time) continue;
          const dep = new Date(booking.departure_time).getTime();
          const hoursAway = (dep - now) / (1000 * 60 * 60);
          if (hoursAway > 0 && hoursAway <= UPCOMING_WINDOW_HOURS) {
            derived.push({
              id: `trip-${order.id}`,
              kind: "upcoming-trip",
              title: `${booking.origin_code} → ${booking.destination_code} departs soon`,
              detail: `${formatDate(booking.departure_time)} · ${formatTime(booking.departure_time)}`,
              href: `/orders/${order.id}`,
            });
          }
        }
      }

      if (alertsRes.status === "fulfilled") {
        for (const alert of alertsRes.value.items) {
          if (!alert.is_active || !alert.last_lowest_price) continue;
          const target = parseFloat(alert.target_price);
          const lowest = parseFloat(alert.last_lowest_price);
          if (lowest <= target) {
            derived.push({
              id: `alert-${alert.id}`,
              kind: "price-drop",
              title: `${alert.origin_code} → ${alert.destination_code} hit your target`,
              detail: `Now ${formatCurrency(lowest, alert.currency)} · target ${formatCurrency(target, alert.currency)}`,
              href: "/price-alerts",
            });
          }
        }
      }

      setItems(derived);
      setLoading(false);
      setLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Notifications"
          className="relative flex size-10 items-center justify-center rounded-full text-chrome transition-colors hover:bg-white/5 hover:text-aurora"
        >
          <Bell className="size-4.5" />
          {items.length > 0 && (
            <span className="absolute right-1.5 top-1.5 flex size-2 items-center justify-center rounded-full bg-aurora ring-2 ring-navy-950" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="border-b border-border px-4 py-3">
          <p className="font-display text-sm text-pearl">Notifications</p>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {loading && !loaded && (
            <div className="flex justify-center py-8">
              <Loader2 className="size-4 animate-spin text-aurora" />
            </div>
          )}
          {loaded && items.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-chrome-dim">
              Nothing new — upcoming trips and price-alert drops show up here.
            </p>
          )}
          <AnimatePresence>
            {items.map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Link
                  href={n.href}
                  className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/5"
                >
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-aurora/10 text-aurora">
                    {n.kind === "upcoming-trip" ? (
                      <PlaneTakeoff className="size-4" />
                    ) : (
                      <TrendingDown className="size-4" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-pearl">{n.title}</span>
                    <span className="block text-xs text-chrome-dim">{n.detail}</span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </PopoverContent>
    </Popover>
  );
}
