"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

/**
 * Buttery-smooth inertia scrolling for the whole site via Lenis. This
 * replaces the browser's default scroll physics with eased, momentum-based
 * scrolling — the same technique used on most "premium" marketing sites
 * (Linear, Vercel, Stripe). Disabled automatically when the visitor has
 * prefers-reduced-motion set, so it never fights an accessibility need.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.1,
    });

    let frameId: number;
    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
