/**
 * Curated real aviation photography used across the site, per the
 * "real photography, not AI-generated art" brief. All sourced from
 * Unsplash under the Unsplash License (unsplash.com/license) — free for
 * commercial use, no attribution legally required, credited below anyway.
 *
 * Swap any `id` for a different Unsplash photo id if you'd rather use your
 * own AirLynk-branded photography later — everywhere these are used reads
 * from this one catalog.
 */

function unsplash(id: string, params = "q=80&auto=format&fit=crop") {
  return `https://images.unsplash.com/${id}?${params}`;
}

export const PHOTOS = {
  // Hero — wing above clouds, blue midday sky. Credit: Patrick Tomasso.
  heroDay: unsplash("photo-1532364158125-02d75a0f7fb9"),
  // Hero — wing above clouds at golden-hour sunset. Credit: iwin (@mono_log).
  heroSunset: unsplash("photo-1763455892848-39bbc7ca90a0"),
  // Hero — airport / city aerial at night, runway + skyline lights.
  // Credit: Mohit Kumar.
  heroNight: unsplash("photo-1625153979079-659514a98de5"),
  // Cockpit — pilot and co-pilot at the controls. Credit: Quilia.
  cockpit: unsplash("photo-1503468120394-03d29a34a0bf"),
  // Business class cabin, widebody aircraft. Credit: Frugal Flyer.
  cabin: unsplash("photo-1706921271123-c3bef3d8a8c1"),
  // Night airport / city aerial — reused for footer / night sections.
  nightAirport: unsplash("photo-1625153979079-659514a98de5"),
} as const;

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

/**
 * AirLynk's own cabin-class motion footage for the "Experience" section —
 * five vertical clips supplied by the client, one per cabin/service
 * category, hosted locally under /public/videos with matching poster
 * frames under /public/images so the first paint is instant even before
 * the video is playable.
 */
export const VIDEOS = {
  privateJet: {
    src: "/videos/private-jet.mp4",
    poster: "/images/private-jet-poster.jpg",
  },
  firstClass: {
    src: "/videos/first-class.mp4",
    poster: "/images/first-class-poster.jpg",
  },
  businessClass: {
    src: "/videos/business-class.mp4",
    poster: "/images/business-class-poster.jpg",
  },
  economyClass: {
    src: "/videos/economy-class.mp4",
    poster: "/images/economy-class-poster.jpg",
  },
  crew: {
    src: "/videos/crew.mp4",
    poster: "/images/crew-poster.jpg",
  },
} as const;

/** Local-hour based time-of-day bucket, per the brief's "dynamic time system". */
export function getTimeOfDay(hour = new Date().getHours()): TimeOfDay {
  if (hour >= 5 && hour < 8) return "morning";
  if (hour >= 8 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 20) return "evening";
  return "night";
}

interface TimeOfDayTheme {
  photo: string;
  /** CSS gradient overlay approximating natural light for this time of day. */
  overlay: string;
  label: string;
}

export const TIME_OF_DAY_THEME: Record<TimeOfDay, TimeOfDayTheme> = {
  morning: {
    photo: PHOTOS.heroSunset,
    overlay:
      "linear-gradient(180deg, rgba(255,196,120,0.22) 0%, rgba(90,60,15,0.35) 60%, rgba(20,13,5,0.85) 100%)",
    label: "Golden sunrise",
  },
  afternoon: {
    photo: PHOTOS.heroDay,
    overlay:
      "linear-gradient(180deg, rgba(138,90,18,0.10) 0%, rgba(90,60,15,0.45) 60%, rgba(20,13,5,0.9) 100%)",
    label: "Clear blue sky",
  },
  evening: {
    photo: PHOTOS.heroSunset,
    overlay:
      "linear-gradient(180deg, rgba(255,138,76,0.24) 0%, rgba(90,60,15,0.4) 60%, rgba(20,13,5,0.9) 100%)",
    label: "Sunset over the clouds",
  },
  night: {
    photo: PHOTOS.heroNight,
    overlay:
      "linear-gradient(180deg, rgba(90,60,15,0.35) 0%, rgba(20,13,5,0.75) 60%, rgba(20,13,5,0.95) 100%)",
    label: "Night flight",
  },
};
