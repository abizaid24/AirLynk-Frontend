"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { getTimeOfDay, TIME_OF_DAY_THEME, type TimeOfDay } from "@/lib/media";
import { FloatingParticles } from "@/components/effects/floating-particles";
import { FlightPaths } from "@/components/effects/flight-paths";

/**
 * Real cinematic photography hero backdrop — replaces the earlier procedural
 * 3D scene per the "real airline, not AI-generated" brief. The photo shown
 * is driven by the site's day/night theme toggle: light mode always shows a
 * real daytime sky (golden-sunrise / clear-blue-afternoon / sunset,
 * following the visitor's local hour for variety), dark mode always shows
 * the night skyline photo — so switching the toggle visibly changes the
 * hero, not just the chrome around it. A very slow Ken Burns drift and a
 * restrained, single-tone light-temperature overlay complete the effect —
 * no neon, no glow.
 */
export function CinematicHeroBackdrop() {
  const { resolvedTheme } = useTheme();
  const [tod, setTod] = useState<TimeOfDay>("afternoon");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const hourBucket = getTimeOfDay();
      // Night is reserved for dark mode; in daylight hours during dark mode
      // we still show night photography so the toggle is the source of truth.
      setTod(hourBucket === "night" ? "evening" : hourBucket);
    };
    update();
    const id = setInterval(update, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const activeKey: TimeOfDay = isDark ? "night" : tod;
  const theme = TIME_OF_DAY_THEME[activeKey];

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#120d08]">
      <motion.div
        key={activeKey}
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ opacity: { duration: 1.4 }, scale: { duration: 20, ease: "linear" } }}
        className="absolute inset-0"
      >
        <motion.div
          animate={{ scale: [1, 1.06] }}
          transition={{ duration: 26, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
          className="absolute inset-0"
        >
          <Image
            src={theme.photo}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>

      {/* Time-of-day light-temperature wash */}
      <div className="absolute inset-0" style={{ background: theme.overlay }} />

      {/* Ambient sky-blue / ocean-blue atmospheric glow, drifting slowly */}
      <motion.div
        aria-hidden
        className="aurora-glow absolute inset-0"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Live "route map" flight paths drifting across the sky */}
      <FlightPaths className="opacity-70 mix-blend-screen" />

      {/* Floating light particles — dust catching the light */}
      <FloatingParticles count={22} />

      {/* Bottom fade so page content stays readable — blends into the
          actual page background, which flips light/dark with the theme */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy-950" />

      {/* Drifting aircraft silhouette with a soft glowing trail */}
      <motion.svg
        aria-hidden
        viewBox="0 0 64 64"
        className="pointer-events-none absolute left-[-8%] top-[22%] h-10 w-10 text-aurora drop-shadow-[0_0_10px_rgba(138,90,18,0.8)] sm:h-14 sm:w-14"
        initial={{ x: 0, opacity: 0 }}
        animate={{ x: "120vw", opacity: [0, 0.7, 0.7, 0] }}
        transition={{ duration: 46, ease: "linear", repeat: Infinity, delay: 2 }}
      >
        <path
          d="M32 6 L38 24 L56 32 L38 34 L34 54 L30 50 L29 34 L10 32 L26 25 L24 10 Z"
          fill="currentColor"
        />
      </motion.svg>

      <span className="glow-sky-text absolute bottom-24 right-6 z-10 hidden text-[10px] uppercase tracking-[0.25em] text-paper-fixed/70 sm:right-10 sm:block">
        {theme.label}
      </span>
    </div>
  );
}
