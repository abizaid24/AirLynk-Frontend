"use client";

import { useEffect, useRef } from "react";

/**
 * A muted, looping ambient video background with a poster fallback.
 * Pauses automatically when scrolled out of view (IntersectionObserver)
 * so it doesn't burn battery/bandwidth off-screen. The poster image
 * renders immediately and the browser swaps to live video the moment
 * it's playable — no manual fade needed.
 */
export function VideoBackground({
  src,
  poster,
  className = "",
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {
            // Autoplay can be blocked in rare cases (e.g. low-power mode) —
            // the poster image still covers us visually.
          });
        } else {
          el.pause();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      className={`h-full w-full object-cover ${className}`}
      poster={poster}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
    />
  );
}
