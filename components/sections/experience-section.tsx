"use client";

import { motion } from "framer-motion";
import { VIDEOS } from "@/lib/media";
import { VideoBackground } from "@/components/ui/video-background";

const CLASSES = [
  {
    key: "privateJet",
    eyebrow: "Charter",
    title: "Private Jet",
    desc: "Your own aircraft, an AirLynk concierge on call.",
  },
  {
    key: "firstClass",
    eyebrow: "The pinnacle",
    title: "First Class",
    desc: "Private suites, curated dining, uncompromising quiet.",
  },
  {
    key: "businessClass",
    eyebrow: "Business & lie-flat",
    title: "Business Class",
    desc: "Lie-flat seats and direct aisle access, every long-haul.",
  },
  {
    key: "economyClass",
    eyebrow: "Smart comfort",
    title: "Economy",
    desc: "Real-time seat previews, everyday travel done right.",
  },
  {
    key: "crew",
    eyebrow: "Ground & flight",
    title: "Our Crew",
    desc: "Experienced hands, on every single route.",
  },
] as const;

export function ExperienceSection() {
  return (
    <section id="experience" className="relative border-t border-border py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-xl"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-lavender">
            Choose your journey
          </span>
          <h2 className="font-display mt-4 text-4xl text-pearl sm:text-5xl">
            Five ways to fly,
            <br />
            one seamless booking
          </h2>
        </motion.div>

        {/* Five vertical showcase cards, one per cabin/service category */}
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CLASSES.map((c, i) => {
            const video = VIDEOS[c.key];
            return (
              <motion.div
                key={c.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className={`group relative h-[420px] overflow-hidden rounded-2xl border border-border shadow-lg sm:h-[460px] lg:h-[520px] ${
                  i === 4 ? "col-span-2 sm:col-span-1" : ""
                }`}
              >
                <VideoBackground
                  src={video.src}
                  poster={video.poster}
                  className="transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-fixed via-ink-fixed/25 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-ink-fixed/40 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-sky">
                    {c.eyebrow}
                  </span>
                  <h3 className="font-display mt-2 text-xl text-paper-fixed">
                    {c.title}
                  </h3>
                  <p className="mt-1.5 max-w-[22ch] text-xs text-paper-fixed-muted">
                    {c.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
