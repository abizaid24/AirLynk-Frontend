"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  left: number; // %
  size: number; // px
  duration: number; // s
  delay: number; // s
  drift: number; // px, horizontal sway
  opacity: number;
}

/**
 * Slow, ambient drifting light particles — like dust catching sunlight
 * through a cabin window. Deliberately sparse and slow: this is meant to
 * read as atmosphere, not confetti. Respects prefers-reduced-motion via
 * the global CSS rule that collapses all animation durations.
 */
export function FloatingParticles({
  count = 26,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 1.5 + Math.random() * 3,
      duration: 14 + Math.random() * 16,
      delay: -(Math.random() * 20),
      drift: (Math.random() - 0.5) * 60,
      opacity: 0.25 + Math.random() * 0.45,
    }));
  }, [count]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="particle-dot"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
          }}
          initial={{ y: "110%", x: 0, opacity: 0 }}
          animate={{
            y: "-10%",
            x: [0, p.drift, 0],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            y: { duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" },
            x: { duration: p.duration / 2, delay: p.delay, repeat: Infinity, ease: "easeInOut" },
            opacity: {
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.15, 0.85, 1],
            },
          }}
        />
      ))}
    </div>
  );
}
