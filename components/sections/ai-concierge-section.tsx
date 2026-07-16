"use client";

import { motion } from "framer-motion";
import { Headset } from "lucide-react";
import { useConciergeStore } from "@/store/concierge-store";

const PROMPTS = [
  "Best flights from Lahore to Istanbul next Friday?",
  "What's the baggage allowance for Business Class?",
  "Suggest a window seat with the best sunrise view.",
];

export function AIConciergeSection() {
  const setOpen = useConciergeStore((s) => s.setOpen);

  return (
    <section
      id="ai-concierge"
      className="relative overflow-hidden border-t border-border py-24"
    >
      <div className="aurora-glow pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <span className="flex size-12 items-center justify-center rounded-2xl border border-aurora/30 bg-aurora/10">
            <Headset className="size-5 text-aurora" />
          </span>
          <h2 className="font-display mt-6 text-4xl text-pearl sm:text-5xl">
            Your AI Travel Concierge
          </h2>
          <p className="mt-4 max-w-lg text-chrome">
            Ask AirLynk anything — best fares, visa requirements, weather at
            your destination, or the perfect seat. It answers with real
            flight data, not guesses.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="glass-panel mt-10 w-full max-w-lg rounded-3xl p-6 text-left"
        >
          <div className="flex flex-col gap-3">
            {PROMPTS.map((p, i) => (
              <motion.button
                key={p}
                type="button"
                onClick={() => setOpen(true)}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
                className="w-full rounded-xl border border-border bg-navy-900/50 px-4 py-3 text-left text-sm text-chrome transition-colors hover:border-aurora/50 hover:text-aurora"
              >
                {p}
              </motion.button>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-chrome-dim">
            Tap a prompt — or the concierge button in the corner — to start
            chatting for real.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
