"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SITE_TAGLINE } from "@/lib/config";

const SESSION_KEY = "airlynk_intro_seen";

export function CinematicIntro() {
  const [show, setShow] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (!seen) {
      setShow(true);
      sessionStorage.setItem(SESSION_KEY, "1");
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => setShow(false), 3400);
    return () => clearTimeout(timer);
  }, [show]);

  if (!ready) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#120d08]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          <div className="aurora-glow absolute inset-0" />

          <motion.div
            className="relative flex flex-col items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.img
                src="/images/airlynk-icon.png"
                alt="AirLynk"
                className="h-16 w-16 object-contain sm:h-20 sm:w-20"
                initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.1, delay: 0.3, ease: "easeOut" }}
              />
              <span className="font-display text-2xl tracking-[0.3em] text-paper-fixed uppercase">
                AirLynk
              </span>
            </motion.div>

            <motion.p
              className="font-display text-sm tracking-[0.4em] text-paper-fixed-muted uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.6 }}
            >
              {SITE_TAGLINE}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
