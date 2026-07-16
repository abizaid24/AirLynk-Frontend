"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { flightsService } from "@/services/flights.service";
import { ordersService } from "@/services/orders.service";
import type { FlightDetail, SeatMapResponse } from "@/types/flight";
import type { OrderCreatePayload } from "@/types/order";
import { ANCILLARY_TYPES } from "@/types/order";
import { getApiErrorMessage } from "@/lib/api-client";
import { formatClassType, formatCurrency } from "@/lib/utils";
import { useBookingStore } from "@/store/booking-store";
import { useAuthStore } from "@/store/auth-store";
import { BookingStepper } from "@/components/booking/booking-stepper";
import { SeatMapInteractive } from "@/components/booking/seat-map-interactive";
import { PassengerForm } from "@/components/booking/passenger-form";
import { AncillarySelector } from "@/components/booking/ancillary-selector";
import { OrderSummary } from "@/components/booking/order-summary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function BookingPage({
  params,
}: {
  params: Promise<{ flightId: string }>;
}) {
  const { flightId } = use(params);
  const router = useRouter();
  const booking = useBookingStore();
  const { isAuthenticated } = useAuthStore();

  const [flight, setFlight] = useState<FlightDetail | null>(null);
  const [seatMap, setSeatMap] = useState<SeatMapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [guest, setGuest] = useState({ name: "", email: "" });

  useEffect(() => {
    if (!booking.flightId || booking.flightId !== flightId || !booking.classId) {
      router.replace(`/flights/${flightId}`);
      return;
    }
    setLoading(true);
    Promise.all([
      flightsService.getById(flightId),
      flightsService.getSeatMap(flightId),
    ])
      .then(([f, s]) => {
        setFlight(f);
        setSeatMap(s);
      })
      .catch((err) => toast.error(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flightId]);

  if (loading || !flight || !seatMap) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-aurora" />
      </div>
    );
  }

  const flightClass = flight.classes.find((c) => c.id === booking.classId);
  if (!flightClass) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="text-chrome">That fare class is no longer available.</p>
        <Link href={`/flights/${flightId}`}>
          <Button className="mt-6">Back to flight</Button>
        </Link>
      </div>
    );
  }

  const seatsComplete = booking.selectedSeats.length === booking.passengerCount;
  const passengersComplete = booking.passengers.every(
    (p) => p.full_name.trim().length >= 2
  ) && booking.passengers.length === booking.passengerCount;
  const guestComplete = isAuthenticated || (guest.name.trim() && guest.email.trim());

  async function handleCreateOrder() {
    if (!flight) return;
    setSubmitting(true);
    try {
      const payload: OrderCreatePayload = {
        legs: [
          {
            flight_id: flightId,
            class_id: booking.classId!,
            passengers: booking.passengers.map((p) => ({
              ...p,
              dob: p.dob ? new Date(p.dob).toISOString() : null,
              email: p.email || undefined,
              phone: p.phone || undefined,
              passport_no: p.passport_no || undefined,
              nationality: p.nationality || undefined,
            })),
          },
        ],
        ancillaries: booking.ancillaries.map((a) => ({
          type: a.type,
          quantity: booking.passengerCount,
        })),
        currency: flight.currency,
        guest_name: isAuthenticated ? undefined : guest.name,
        guest_email: isAuthenticated ? undefined : guest.email,
      };
      const order = await ordersService.create(payload);
      booking.setOrderId(order.id);
      toast.success("Booking created — continue to payment");
      router.push(`/booking/${flightId}/payment?order=${order.id}`);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const steps = [
    {
      title: "Choose your seats",
      subtitle: `Select ${booking.passengerCount} seat${booking.passengerCount > 1 ? "s" : ""} in ${formatClassType(flightClass.class_type)}`,
      canContinue: seatsComplete,
      content: (
        <SeatMapInteractive seats={seatMap.seats} classType={flightClass.class_type} />
      ),
    },
    {
      title: "Passenger details",
      subtitle: "Enter details exactly as they appear on travel documents",
      canContinue: passengersComplete,
      content: <PassengerForm />,
    },
    {
      title: "Add extras",
      subtitle: "Optional — enhance the trip for every passenger",
      canContinue: true,
      content: <AncillarySelector />,
    },
    {
      title: "Review & confirm",
      subtitle: "Check everything before payment",
      canContinue: guestComplete,
      content: (
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-border p-5">
            <h4 className="text-sm text-pearl">Passengers</h4>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-chrome">
              {booking.passengers.map((p, i) => (
                <li key={i} className="flex justify-between">
                  <span>
                    {p.full_name || `Passenger ${i + 1}`} ·{" "}
                    <span className="text-chrome-dim">{p.passenger_type}</span>
                  </span>
                  <span className="text-chrome-dim">
                    Seat {booking.selectedSeats[i]?.seatNumber ?? "—"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {booking.ancillaries.length > 0 && (
            <div className="rounded-2xl border border-border p-5">
              <h4 className="text-sm text-pearl">Extras</h4>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-chrome">
                {booking.ancillaries.map((a) => {
                  const def = ANCILLARY_TYPES.find((t) => t.value === a.type);
                  return (
                    <li key={a.type} className="flex justify-between">
                      <span>{def?.label ?? a.type}</span>
                      <span className="text-chrome-dim">
                        {formatCurrency((def?.price ?? 0) * booking.passengerCount, flight.currency)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {!isAuthenticated && (
            <div className="rounded-2xl border border-border p-5">
              <h4 className="flex items-center gap-2 text-sm text-pearl">
                <ShieldCheck className="size-4 text-aurora" /> Guest checkout details
              </h4>
              <p className="mt-1 text-xs text-chrome-dim">
                Used to send your booking confirmation and e-ticket.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="guest-name">Full name</Label>
                  <Input
                    id="guest-name"
                    value={guest.name}
                    onChange={(e) => setGuest({ ...guest, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="guest-email">Email</Label>
                  <Input
                    id="guest-email"
                    type="email"
                    value={guest.email}
                    onChange={(e) => setGuest({ ...guest, email: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  const current = steps[step - 1];

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
      <Link
        href={`/flights/${flightId}`}
        className="inline-flex items-center gap-1.5 text-sm text-chrome hover:text-aurora"
      >
        <ArrowLeft className="size-4" /> Back to flight
      </Link>

      <div className="mt-6">
        <BookingStepper current={step} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3 }}
              className="glass-panel rounded-3xl p-6 sm:p-8"
            >
              <h2 className="font-display text-xl text-pearl">{current.title}</h2>
              <p className="mt-1 text-sm text-chrome-dim">{current.subtitle}</p>
              <div className="mt-6">{current.content}</div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
            >
              <ArrowLeft className="size-4" /> Back
            </Button>

            {step < 4 ? (
              <Button
                onClick={() => setStep((s) => Math.min(4, s + 1))}
                disabled={!current.canContinue}
              >
                Continue <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                onClick={handleCreateOrder}
                disabled={!current.canContinue || submitting}
              >
                {submitting && <Loader2 className="size-4 animate-spin" />}
                Confirm & continue to payment
              </Button>
            )}
          </div>
        </div>

        <div className="hidden lg:block">
          <OrderSummary flight={flight} />
        </div>
      </div>
    </div>
  );
}
