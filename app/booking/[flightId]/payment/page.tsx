"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CreditCard, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import { ordersService } from "@/services/orders.service";
import { paymentsService } from "@/services/payments.service";
import type { OrderResponse } from "@/types/order";
import { getApiErrorMessage } from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TakeoffScene } from "@/components/booking/payment-success-scene";
import { BoardingPass } from "@/components/booking/boarding-pass";
import { useBookingStore } from "@/store/booking-store";
import { toast } from "sonner";

type Phase = "loading" | "review" | "paying" | "takeoff" | "success" | "error";

export default function PaymentPage({
  params,
}: {
  params: Promise<{ flightId: string }>;
}) {
  const { flightId } = use(params);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const router = useRouter();
  const resetBooking = useBookingStore((s) => s.reset);

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      router.replace(`/flights/${flightId}`);
      return;
    }
    ordersService
      .getById(orderId)
      .then((o) => {
        setOrder(o);
        setPhase(o.status === "confirmed" ? "success" : "review");
      })
      .catch((err) => {
        setError(getApiErrorMessage(err));
        setPhase("error");
      });
  }, [orderId, flightId, router]);

  async function handlePay() {
    if (!order) return;
    setPhase("paying");
    try {
      const intent = await paymentsService.createIntent({ order_id: order.id });
      if (intent.demo_mode) {
        await paymentsService.demoConfirm({
          order_id: order.id,
          payment_id: intent.payment_id,
        });
      }
      const refreshed = await ordersService.getById(order.id);
      setOrder(refreshed);
      setPhase("takeoff");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
      setPhase("review");
    }
  }

  if (phase === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-aurora" />
      </div>
    );
  }

  if (phase === "error" || !order) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="text-chrome">{error ?? "Order not found."}</p>
        <Link href="/search">
          <Button className="mt-6">Back to search</Button>
        </Link>
      </div>
    );
  }

  if (phase === "takeoff") {
    return (
      <TakeoffScene
        onDone={() => {
          setPhase("success");
          resetBooking();
        }}
      />
    );
  }

  if (phase === "success") {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-aurora/15 text-aurora">
            <ShieldCheck className="size-7" />
          </span>
          <h1 className="font-display mt-4 text-2xl text-pearl">
            You&apos;re confirmed!
          </h1>
          <p className="mt-1 text-sm text-chrome">
            Order {order.order_reference} · {formatCurrency(order.total_amount, order.currency)} paid
          </p>
        </motion.div>

        <BoardingPass order={order} />

        <div className="mt-8 flex justify-center gap-3">
          <Link href="/search">
            <Button variant="outline">Book another flight</Button>
          </Link>
        </div>
      </div>
    );
  }

  // phase === "review"
  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <Link
        href={`/booking/${flightId}`}
        className="inline-flex items-center gap-1.5 text-sm text-chrome hover:text-aurora"
      >
        <ArrowLeft className="size-4" /> Back to booking
      </Link>

      <div className="glass-panel mt-6 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-aurora">
          <CreditCard className="size-3.5" /> Payment
        </div>
        <h1 className="font-display mt-2 text-2xl text-pearl">
          Complete your booking
        </h1>
        <p className="mt-1 text-sm text-chrome-dim">
          Order {order.order_reference}
        </p>

        <div className="mt-6 flex flex-col gap-2 border-t border-border pt-5 text-sm">
          <div className="flex justify-between text-chrome">
            <span>Subtotal</span>
            <span className="text-pearl">
              {formatCurrency(order.subtotal, order.currency)}
            </span>
          </div>
          <div className="flex justify-between text-chrome">
            <span>Taxes & fees</span>
            <span className="text-pearl">
              {formatCurrency(order.taxes, order.currency)}
            </span>
          </div>
          {parseFloat(order.discount) > 0 && (
            <div className="flex justify-between text-chrome">
              <span>Discount</span>
              <span className="text-aurora">
                −{formatCurrency(order.discount, order.currency)}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm text-chrome">Total due</span>
          <span className="font-display text-2xl text-aurora">
            {formatCurrency(order.total_amount, order.currency)}
          </span>
        </div>

        <Button
          size="lg"
          className="mt-6 w-full"
          onClick={handlePay}
          disabled={phase === "paying"}
        >
          {phase === "paying" && <Loader2 className="size-4 animate-spin" />}
          Pay {formatCurrency(order.total_amount, order.currency)}
        </Button>
        <p className="mt-3 text-center text-xs text-chrome-dim">
          Demo checkout — no real card is charged.
        </p>
      </div>
    </div>
  );
}
