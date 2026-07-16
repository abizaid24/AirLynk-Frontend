"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { SITE_TAGLINE, SITE_SUBLINE } from "@/lib/config";
import { FlightSearchPanel } from "./flight-search-panel";
import { CinematicHeroBackdrop } from "./cinematic-hero-backdrop";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-6">
      <CinematicHeroBackdrop />

      <div className="relative z-10 flex flex-col items-center gap-7 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="glass-panel glow-sky flex items-center gap-2 rounded-full border-aurora/30 px-5 py-2 text-xs uppercase tracking-[0.3em] text-aurora"
        >
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-aurora opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-aurora" />
          </span>
          The AI-Powered Airline
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display max-w-4xl text-balance text-6xl font-semibold leading-[1.02] tracking-[-0.03em] text-pearl sm:text-7xl lg:text-8xl"
        >
          <span className="block">{SITE_TAGLINE}</span>
          <span className="text-gradient-aurora glow-sky-text block">
            {SITE_SUBLINE}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-xl text-balance text-base leading-relaxed text-pearl/80 sm:text-lg"
        >
          An AI travel concierge, a living route globe, and a booking journey
          engineered around one idea: flying should feel effortless,
          intelligent, and quietly extraordinary.
        </motion.p>
      </div>

      <div className="relative z-10 mt-10 flex w-full justify-center px-2">
        <Suspense fallback={null}>
          <FlightSearchPanel />
        </Suspense>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-6 z-10 flex flex-col items-center gap-2 text-chrome-dim"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">
          Begin your journey
        </span>
        <motion.span
          className="h-8 w-px bg-gradient-to-b from-aurora to-transparent"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
