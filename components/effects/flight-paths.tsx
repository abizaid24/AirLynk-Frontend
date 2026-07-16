"use client";

import { motion } from "framer-motion";

const PATHS = [
  { d: "M -5,70 Q 30,45 55,55 T 105,30", delay: 0, duration: 7 },
  { d: "M -5,35 Q 25,60 60,40 T 105,60", delay: 1.4, duration: 8.5 },
  { d: "M -5,85 Q 40,70 65,80 T 105,50", delay: 2.6, duration: 9.5 },
];

/**
 * Faint animated great-circle "flight path" lines drifting across the hero
 * backdrop, with a small glowing dot travelling each path — evokes a live
 * route map without pulling focus from the photography behind it.
 */
export function FlightPaths({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <defs>
        <linearGradient id="flight-path-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--sky-blue)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--sky-blue)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--sky-blue)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {PATHS.map((p, i) => (
        <g key={i}>
          <path
            id={`flight-path-${i}`}
            d={p.d}
            fill="none"
            stroke="url(#flight-path-fade)"
            strokeWidth={0.15}
            strokeDasharray="0.4 1.2"
            vectorEffect="non-scaling-stroke"
          />
          <motion.circle
            r={0.5}
            fill="var(--sky-blue)"
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              offsetPath: `path("${p.d}")`,
              filter: "drop-shadow(0 0 3px var(--sky-blue))",
            }}
          />
        </g>
      ))}
    </svg>
  );
}
