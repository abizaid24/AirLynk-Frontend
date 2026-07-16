"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlaneTakeoff } from "lucide-react";

const MESSAGES = ["Taxiing to runway…", "Accelerating…", "Wheels up"];

export function TakeoffScene({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(onDone, 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center overflow-hidden">
      <div className="relative h-24 w-full max-w-md">
        <div className="absolute bottom-4 left-0 right-0 h-px bg-chrome/20" />
        <motion.div
          className="absolute bottom-2"
          initial={{ left: "10%", y: 0, rotate: 0 }}
          animate={{
            left: phase >= 2 ? "85%" : phase >= 1 ? "55%" : "15%",
            y: phase >= 2 ? -60 : 0,
            rotate: phase >= 2 ? -18 : 0,
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <PlaneTakeoff className="size-8 text-aurora drop-shadow-[0_0_12px_var(--sky-blue)]" />
        </motion.div>
      </div>
      <motion.p
        key={phase}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-sm text-chrome"
      >
        {MESSAGES[phase]}
      </motion.p>
    </div>
  );
}
