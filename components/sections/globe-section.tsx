"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useSearchStore } from "@/store/search-store";

const GlobeCanvas = dynamic(
  () => import("@/components/three/globe-scene").then((m) => m.GlobeCanvas),
  { ssr: false }
);

export function GlobeSection() {
  const { origin, destination } = useSearchStore();

  return (
    <section id="globe" className="relative overflow-hidden border-t border-border py-24">
      <div className="aurora-glow pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:px-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-aurora">
            Live route map
          </span>
          <h2 className="font-display mt-4 text-4xl text-pearl sm:text-5xl">
            A world of routes,
            <br />
            drawn in real time
          </h2>
          <p className="mt-5 max-w-md text-chrome">
            Pick a departure and destination and watch the globe draw your
            flight path instantly. Every marker corresponds to a real AirLynk
            hub — Lahore, Karachi, Dubai, London, and beyond.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="glass-panel rounded-2xl px-4 py-3">
              <span className="block text-xs text-chrome-dim">From</span>
              <span className="font-display text-lg text-pearl">
                {origin ? `${origin.city} (${origin.iata})` : "Not selected"}
              </span>
            </div>
            <div className="glass-panel rounded-2xl px-4 py-3">
              <span className="block text-xs text-chrome-dim">To</span>
              <span className="font-display text-lg text-pearl">
                {destination
                  ? `${destination.city} (${destination.iata})`
                  : "Not selected"}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative aspect-square w-full"
        >
          {/* Soft glow bed behind the globe — grounds it in the scene
              instead of floating on a flat background */}
          <div
            aria-hidden
            className="absolute inset-[6%] rounded-full opacity-70 blur-2xl"
            style={{
              background:
                "radial-gradient(circle, rgba(138,90,18,0.16) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              maskImage:
                "radial-gradient(circle closest-side at 50% 50%, black 0%, black 70%, transparent 96%)",
              WebkitMaskImage:
                "radial-gradient(circle closest-side at 50% 50%, black 0%, black 70%, transparent 96%)",
            }}
          >
            <GlobeCanvas className="absolute inset-0" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
