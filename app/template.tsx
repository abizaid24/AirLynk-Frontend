"use client";

import { motion } from "framer-motion";

/**
 * Next.js re-mounts `template.tsx` on every navigation (unlike layout.tsx,
 * which persists) — that's exactly the hook we need for a per-route enter
 * transition. Kept intentionally subtle: a quick fade + gentle rise, not a
 * full-page wipe, so it reads as "smooth" rather than "slow". Respects
 * prefers-reduced-motion via the global CSS rule that collapses all
 * animation durations to ~0.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
