"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  Luggage,
  ShieldAlert,
  Download,
  XCircle,
} from "lucide-react";
import { ordersService } from "@/services/orders.service";
import type { OrderResponse } from "@/types/order";
import { ANCILLARY_TYPES } from "@/types/order";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/api-client";
import { BoardingPass } from "@/components/booking/boarding-pass";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    ordersService
      .getById(id)
      .then(setOrder)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleCancel() {
    if (!order) return;
    if (!confirm("Cancel this booking? This can't be undone.")) return;
    setCancelling(true);
    try {
      const updated = await ordersService.cancel(order.id, {
        reason: "Cancelled by traveller",
      });
      setOrder(updated);
      toast.success("Booking cancelled");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setCancelling(false);
    }
  }

  async function handleDownload() {
    if (!order) return;
    setDownloading(true);
    try {
      await ordersService.downloadTicket(order.id, order.order_reference);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-aurora" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="text-chrome">{error ?? "Order not found."}</p>
        <Link href="/orders">
          <Button className="mt-6">Back to bookings</Button>
        </Link>
      </div>
    );
  }

  const booking = order.bookings[0];
  const canCancel = ["draft", "pending_payment", "confirmed"].includes(order.status);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 lg:px-0">
      <Link
        href="/orders"
        className="inline-flex items-center gap-1.5 text-sm text-chrome hover:text-aurora"
      >
        <ArrowLeft className="size-4" /> Back to bookings
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]"
      >
        <div className="glass-panel rounded-3xl p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-aurora">
                Order {order.order_reference}
              </span>
              <h1 className="font-display mt-2 text-2xl text-pearl sm:text-3xl">
                {booking?.origin_code} → {booking?.destination_code}
              </h1>
              <p className="mt-1 text-sm text-chrome">
                {booking?.departure_time && formatDate(booking.departure_time)}
                {booking?.departure_time && ` · ${formatTime(booking.departure_time)}`}
              </p>
            </div>
            <span className="rounded-full border border-aurora/30 bg-aurora/10 px-3 py-1 text-xs uppercase tracking-wider text-aurora">
              {order.status.replace("_", " ")}
            </span>
          </div>

          <div className="mt-6 border-t border-border pt-5">
            <h2 className="text-sm text-pearl">Passengers</h2>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-chrome">
              {booking?.passengers.map((p) => (
                <li key={p.id} className="flex justify-between">
                  <span>
                    {p.full_name} <span className="text-chrome-dim">· {p.passenger_type}</span>
                  </span>
                  <span className="text-chrome-dim">
                    Seat {p.seat?.seat_number ?? "—"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {order.ancillary_services.length > 0 && (
            <div className="mt-6 border-t border-border pt-5">
              <h2 className="flex items-center gap-2 text-sm text-pearl">
                <Luggage className="size-4 text-aurora" /> Extras
              </h2>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-chrome">
                {order.ancillary_services.map((a) => (
                  <li key={a.id} className="flex justify-between">
                    <span>
                      {ANCILLARY_TYPES.find((t) => t.value === a.type)?.label ?? a.type} ×{a.quantity}
                    </span>
                    <span className="text-chrome-dim">
                      {formatCurrency(a.price, a.currency)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
            <span className="text-sm text-chrome">Total paid</span>
            <span className="font-display text-2xl text-aurora">
              {formatCurrency(order.total_amount, order.currency)}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleDownload} disabled={downloading}>
              {downloading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
              Download e-ticket
            </Button>
            {canCancel && (
              <Button variant="destructive" onClick={handleCancel} disabled={cancelling}>
                {cancelling ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <XCircle className="size-4" />
                )}
                Cancel booking
              </Button>
            )}
          </div>

          {order.status === "cancelled" && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <ShieldAlert className="size-4" /> This booking has been cancelled.
            </div>
          )}
        </div>

        <div>
          {order.status === "confirmed" || order.status === "completed" ? (
            <BoardingPass order={order} />
          ) : (
            <div className="glass-panel rounded-2xl p-6 text-center text-sm text-chrome">
              The boarding pass appears here once payment is confirmed.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
