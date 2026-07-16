"use client";

import { useState } from "react";
import Link from "next/link";
import { Headset, ArrowRight, Check } from "lucide-react";
import { AIRPORTS } from "@/lib/airports";
import { useConciergeStore } from "@/store/concierge-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DESTINATIONS = AIRPORTS.slice(0, 8);

const OFFICES = [
  { city: "Lahore", role: "Global Headquarters" },
  { city: "Dubai", role: "Middle East Hub" },
  { city: "London", role: "European Hub" },
  { city: "Singapore", role: "Asia-Pacific Hub" },
];

const FLEET = ["Airbus A350", "Boeing 777", "Boeing 787 Dreamliner"];

/**
 * Newsletter capture is presentational only — the backend has no
 * subscriber/marketing endpoint, so this doesn't pretend to persist
 * anywhere. If a real endpoint is added later, wire the submit handler to
 * it here.
 */
function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-sm text-aurora">
        <Check className="size-4" /> You&apos;re on the list.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2">
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        aria-label="Email address for newsletter"
        className="bg-[#120d08]/60"
      />
      <Button type="submit" size="icon" aria-label="Subscribe">
        <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}

export function SiteFooter() {
  const setConciergeOpen = useConciergeStore((s) => s.setOpen);

  return (
    <footer className="border-t border-white/10 bg-[#120d08]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand + newsletter */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <img
                src="/images/airlynk-icon.png"
                alt="AirLynk"
                className="h-7 w-7 object-contain"
              />
              <span className="font-display text-base tracking-[0.25em] text-paper-fixed uppercase">
                AirLynk
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-paper-fixed-muted">
              Fly Beyond Distance — an AI-assisted airline experience built
              for travellers who expect more from every mile.
            </p>

            <div className="mt-6">
              <span className="text-xs uppercase tracking-wider text-paper-fixed-muted/60">
                Fare Intelligence &amp; Travel Insights
              </span>
              <div className="mt-3">
                <NewsletterForm />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4 text-xs uppercase tracking-wider text-paper-fixed-muted/60">
              {["Instagram", "X", "LinkedIn"].map((label) => (
                <span key={label} title="Coming soon" className="cursor-not-allowed opacity-50">
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Destinations */}
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider text-paper-fixed-muted/60">
              Destinations
            </span>
            {DESTINATIONS.map((d) => (
              <Link
                key={d.iata}
                href={`/search?destination=${d.iata}`}
                className="text-sm text-paper-fixed-muted transition-colors hover:text-aurora"
              >
                {d.city}
              </Link>
            ))}
          </div>

          {/* Travel & support */}
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider text-paper-fixed-muted/60">
              Travel &amp; Support
            </span>
            <Link href="/search" className="text-sm text-paper-fixed-muted hover:text-aurora">
              Search flights
            </Link>
            <Link href="/orders" className="text-sm text-paper-fixed-muted hover:text-aurora">
              Manage booking
            </Link>
            <Link href="/price-alerts" className="text-sm text-paper-fixed-muted hover:text-aurora">
              Fare watchlist
            </Link>
            <button
              type="button"
              onClick={() => setConciergeOpen(true)}
              className="mt-1 flex items-center gap-1.5 text-left text-sm text-paper-fixed-muted transition-colors hover:text-aurora"
            >
              <Headset className="size-3.5" /> Talk to the AI Concierge
            </button>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider text-paper-fixed-muted/60">
              Global Offices
            </span>
            {OFFICES.map((o) => (
              <span key={o.city} className="text-sm text-paper-fixed-muted">
                {o.city}{" "}
                <span className="text-paper-fixed-muted/60">— {o.role}</span>
              </span>
            ))}
            <span className="mt-3 text-xs uppercase tracking-wider text-paper-fixed-muted/60">
              Fleet
            </span>
            <span className="text-sm text-paper-fixed-muted">{FLEET.join(" · ")}</span>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-paper-fixed-muted/60 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} AirLynk. All rights reserved.</span>
          <span>An AI Travel Concierge, on call around the clock.</span>
        </div>
      </div>
    </footer>
  );
}
