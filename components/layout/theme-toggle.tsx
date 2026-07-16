"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Plane } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Day / night toggle. Renders a small track with an airplane that glides
 * from a "day sky" position to a "night sky" position — a light, on-brand
 * way to switch themes instead of a plain sun/moon icon swap.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to day mode" : "Switch to night mode"}
      className={cn(
        "relative flex h-8 w-14 shrink-0 items-center rounded-full border border-border px-1 transition-colors duration-300",
        isDark ? "bg-[#14161a]" : "bg-[#eaf4ff]",
        className
      )}
    >
      <motion.span
        className={cn(
          "flex size-6 items-center justify-center rounded-full shadow-sm",
          isDark ? "bg-[#3c301e] text-paper-fixed" : "bg-white text-sky-dim"
        )}
        animate={{ x: isDark ? 22 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      >
        <Plane className="size-3.5" strokeWidth={2} />
      </motion.span>
    </button>
  );
}
