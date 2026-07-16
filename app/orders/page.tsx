"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PlaneTakeoff, Loader2, ChevronRight, PackageOpen } from "lucide-react";
import { ordersService } from "@/services/orders.service";
import type { OrderResponse } from "@/types/order";
import { formatCurrency, formatDate, formatTime, formatClassType } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-aurora/15 text-aurora border-aurora/30",
  pending_payment: "bg-lavender/15 text-lavender border-lavender/30",
  draft: "bg-chrome/10 text-chrome border-chrome/25",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
  refunded: "bg-chrome/10 text-chrome border-chrome/25",
  completed: "bg-aurora/15 text-aurora border-aurora/30",
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    ordersService
      .list({ page: 1, page_size: 50 })
      .then((res) => setOrders(res.items))
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <PackageOpen className="mx-auto size-10 text-chrome-dim" />
        <h1 className="font-display mt-4 text-2xl text-pearl">Log in to see your bookings</h1>
        <p className="mt-2 text-sm text-chrome">
          Your trips, e-tickets, and boarding passes live here once you're signed in.
        </p>
        <Link href="/login">
          <Button className="mt-6">Log in</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-0">
      <span className="text-xs uppercase tracking-[0.3em] text-aurora">Your trips</span>
      <h1 className="font-display mt-2 text-3xl text-pearl sm:text-4xl">My bookings</h1>
      <p className="mt-1 text-sm text-chrome">Every order placed with AirLynk, in one place.</p>

      <div className="mt-8 flex flex-col gap-4">
        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="size-6 animate-spin text-aurora" />
          </div>
        )}

        {!loading && error && (
          <div className="glass-panel rounded-2xl p-8 text-center text-chrome">{error}</div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="glass-panel rounded-2xl p-10 text-center">
            <PlaneTakeoff className="mx-auto size-8 text-chrome-dim" />
            <p className="mt-3 text-pearl">No bookings yet.</p>
            <p className="mt-1 text-sm text-chrome-dim">
              Your confirmed trips and e-tickets will show up here.
            </p>
            <Link href="/">
              <Button className="mt-5">Search flights</Button>
            </Link>
          </div>
        )}

        {!loading &&
          !error &&
          orders.map((order, i) => {
            const booking = order.bookings[0];
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
              >
                <Link
                  href={`/orders/${order.id}`}
                  className="glass-panel flex items-center justify-between gap-4 rounded-2xl p-5 transition-colors hover:border-aurora/40"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-lg text-pearl">
                        {booking?.origin_code ?? "—"} → {booking?.destination_code ?? "—"}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider ${
                          STATUS_STYLES[order.status] ?? STATUS_STYLES.draft
                        }`}
                      >
                        {order.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-chrome">
                      {order.order_reference} ·{" "}
                      {booking?.departure_time && formatDate(booking.departure_time)}
                      {booking?.departure_time && ` · ${formatTime(booking.departure_time)}`}
                      {booking?.class_type && ` · ${formatClassType(booking.class_type)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-lg text-aurora">
                      {formatCurrency(order.total_amount, order.currency)}
                    </span>
                    <ChevronRight className="size-4 text-chrome-dim" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
}
