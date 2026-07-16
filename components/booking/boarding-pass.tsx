"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { motion } from "framer-motion";
import { Download, Share2, Wallet, PlaneTakeoff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/lib/utils";
import type { OrderResponse } from "@/types/order";
import { ordersService } from "@/services/orders.service";
import { getApiErrorMessage } from "@/lib/api-client";
import { toast } from "sonner";

export function BoardingPass({ order }: { order: OrderResponse }) {
  const booking = order.bookings[0];
  const passenger = booking?.passengers[0];
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!booking) return;
    QRCode.toDataURL(
      JSON.stringify({
        pnr: booking.pnr_code,
        order: order.order_reference,
        flight: booking.flight_number,
      }),
      { margin: 1, width: 240, color: { dark: "#1a130d", light: "#8a5a12" } }
    ).then(setQrDataUrl);
  }, [booking, order.order_reference]);

  async function handleDownload() {
    setDownloading(true);
    try {
      await ordersService.downloadTicket(order.id, order.order_reference);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setDownloading(false);
    }
  }

  async function handleShare() {
    const text = `AirLynk boarding pass — ${booking?.origin_code} → ${booking?.destination_code}, PNR ${booking?.pnr_code}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "AirLynk boarding pass", text });
      } catch {
        // user cancelled — no-op
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Boarding pass details copied");
    }
  }

  if (!booking) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto w-full max-w-md"
    >
      <div className="overflow-hidden rounded-3xl border border-aurora/20 bg-[#1a140d] shadow-[0_32px_80px_-24px_rgba(0,0,0,0.6),0_0_40px_-12px_var(--sky-blue)]">
        <div className="aurora-glow flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-aurora" />
            <span className="font-display text-sm uppercase tracking-[0.3em] text-paper-fixed">
              AirLynk
            </span>
          </div>
          <span className="text-xs uppercase tracking-widest text-aurora">
            Boarding pass
          </span>
        </div>

        <div className="px-6 pb-2">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-paper-fixed-muted">{booking.origin_code}</p>
              <p className="font-display text-3xl text-paper-fixed">
                {booking.departure_time && formatTime(booking.departure_time)}
              </p>
            </div>
            <PlaneTakeoff className="mb-2 size-5 text-aurora" />
            <div className="text-right">
              <p className="text-xs text-paper-fixed-muted">{booking.destination_code}</p>
              <p className="font-display text-3xl text-paper-fixed">
                {booking.arrival_time && formatTime(booking.arrival_time)}
              </p>
            </div>
          </div>
          <p className="mt-1 text-center text-xs text-paper-fixed-muted">
            {booking.departure_time && formatDate(booking.departure_time)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 px-6 py-5 text-sm">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-paper-fixed-muted">
              Passenger
            </p>
            <p className="mt-0.5 truncate text-paper-fixed">
              {passenger?.full_name ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-paper-fixed-muted">
              Flight
            </p>
            <p className="mt-0.5 text-paper-fixed">{booking.flight_number}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-paper-fixed-muted">
              Seat
            </p>
            <p className="mt-0.5 text-paper-fixed">{passenger?.seat?.seat_number ?? "—"}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-paper-fixed-muted">
              Class
            </p>
            <p className="mt-0.5 capitalize text-paper-fixed">
              {booking.class_type?.replace("_", " ")}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-[10px] uppercase tracking-wider text-paper-fixed-muted">
              PNR
            </p>
            <p className="mt-0.5 tracking-[0.2em] text-aurora">{booking.pnr_code}</p>
          </div>
        </div>

        <div className="relative flex items-center justify-center border-t border-dashed border-paper-fixed/20 py-6">
          <span className="absolute -left-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-[#120d08]" />
          <span className="absolute -right-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-[#120d08]" />
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrDataUrl}
              alt="Boarding pass QR code"
              className="size-40 rounded-xl"
            />
          ) : (
            <div className="size-40 animate-pulse rounded-xl bg-[#1a1c20]" />
          )}
        </div>

        <div className="flex gap-2 px-6 pb-6">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleDownload}
            disabled={downloading}
          >
            <Download className="size-4" /> PDF
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={handleShare}>
            <Share2 className="size-4" /> Share
          </Button>
          <Button variant="glass" size="sm" className="flex-1" disabled>
            <Wallet className="size-4" /> Wallet
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
