export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8000";

export const API_V1_PREFIX = "/api/v1";

export const API_URL = `${API_BASE_URL}${API_V1_PREFIX}`;

export const SITE_NAME = "AirLynk";
export const SITE_TAGLINE = "Fly Beyond Distance";
/** Second hero headline — the glowing accent line beneath SITE_TAGLINE. */
export const SITE_SUBLINE = "Where Every Journey Begins";
