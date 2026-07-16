"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  className?: string;
  glare?: boolean;
  strength?: number;
}

/**
 * A glass card that responds to the cursor with a subtle 3D tilt + specular
 * glare — the "premium app" card feel used throughout the dashboard.
 * Pure CSS-3D via Framer Motion springs, no WebGL needed for this scale.
 */
export function TiltCard({
  children,
  className,
  glare = true,
  strength = 10,
  ...props
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { stiffness: 200, damping: 20, mass: 0.4 };
  const rotateX = useSpring(
    useTransform(y, [0, 1], [strength, -strength]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(x, [0, 1], [-strength, strength]),
    springConfig
  );
  const glareX = useSpring(useTransform(x, [0, 1], [0, 100]), springConfig);
  const glareY = useSpring(useTransform(y, [0, 1], [0, 100]), springConfig);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 900,
      }}
      className={cn(
        "glass-panel relative overflow-hidden rounded-2xl will-change-transform",
        className
      )}
      {...props}
    >
      {glare && (
        <TiltGlare glareX={glareX} glareY={glareY} />
      )}
      <div style={{ transform: "translateZ(24px)" }}>{children}</div>
    </motion.div>
  );
}

function TiltGlare({
  glareX,
  glareY,
}: {
  glareX: MotionValue<number>;
  glareY: MotionValue<number>;
}) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background: useTransform(
          [glareX, glareY],
          ([gx, gy]: number[]) =>
            `radial-gradient(420px circle at ${gx}% ${gy}%, rgba(255,255,255,0.06), transparent 55%)`
        ),
      }}
    />
  );
}
