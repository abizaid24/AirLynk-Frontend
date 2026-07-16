import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AirLynk — Fly Beyond Distance",
    short_name: "AirLynk",
    description:
      "The next-generation AI-powered airline experience — search, book, and fly with an interactive 3D globe and AI travel concierge.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
