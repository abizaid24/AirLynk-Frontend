# AirLynk — Frontend (Phase 1 – 4, complete) + Premium Airline Redesign

The next-generation AI-powered airline experience. All four phases are done:
Design System & 3D Hero/Globe, Booking & Payments, Dashboard/Concierge/
Loyalty/Reviews/Alerts, and Admin/Notifications/Optimization.

**Redesign v2 — Day/Night theme system.** The color system is now **White +
Light Sky Blue (#4CAEFF) + Black + Grey only**, with a real **light/dark
(day/night) toggle** in the header:

- **Light mode ("day", default):** white background, black text, sky-blue
  accent — bright and airy.
- **Dark mode ("night"):** black/charcoal-grey background, white text, the
  same sky-blue accent.
- The homepage hero photo **switches with the toggle**: real daytime aviation
  photography in light mode (golden-sunrise / clear-blue-afternoon / sunset,
  following the visitor's local hour for variety), a real night skyline photo
  in dark mode. Toggle it and the hero visibly changes, not just the chrome.

### How the theming is implemented

- `next-themes` (`providers/theme-provider.tsx`) manages the `.dark` class on
  `<html>`; `components/layout/theme-toggle.tsx` is the switch (an airplane
  icon gliding between a day-sky and night-sky pill, in the header — desktop
  and mobile menu).
- `app/globals.css` defines two full token sets: `:root` (light) and `.dark`
  (dark). The **existing** token *names* (`navy-950`, `navy-800`, `pearl`,
  `chrome`, `aurora`, `lavender`, etc.) were kept so all ~90 existing
  components that already reference them (`bg-navy-800`, `text-pearl`,
  `text-chrome`, `text-aurora`…) pick up the new light/dark values
  automatically, with no per-component rewrite needed — only what those
  variables *resolve to* changed. Full mapping is documented at the top of
  `globals.css`.
- Two **fixed, theme-independent** tokens were added for the handful of
  places that are deliberately dark regardless of site theme (matching how
  real airline sites keep a dark footer band even on an otherwise light
  site): `ink-fixed` (near-black, for text on a bright accent fill, e.g.
  button labels) and `paper-fixed`/`paper-fixed-muted` (near-white, for text
  inside the always-dark footer, the boarding pass "wallet" card, and the
  cinematic intro).
- Chart colors (`app/admin/page.tsx`), the loyalty 3D badge, and the QR code
  on the boarding pass were all updated off the old aurora-cyan/lavender hex
  values onto the new sky-blue/ocean-blue ones.


## Redesign progress

- **Phase A — Foundation (done):** Deep Navy `#071D49` / Sky Blue `#4CAEFF`
  / neutrals / limited Gold accent design tokens; all glassmorphism/neon-glow
  effects removed site-wide (buttons, status dots, seat selection, concierge
  widget, tilt-card glare) and replaced with solid surfaces + soft realistic
  shadows.
- **Phase B — Hero + Globe cinematic replacement (done):**
  - The homepage hero no longer uses a procedural 3D aircraft scene. It's now
    real cinematic aviation photography (`components/sections/cinematic-hero-backdrop.tsx`)
    with a **dynamic time-of-day system** — the visitor's local hour picks a
    golden-sunrise / clear-blue-afternoon / sunset / night-skyline photo with
    a matching light-temperature overlay and a slow Ken Burns drift, plus a
    minimal drifting aircraft-outline accent (no 3D model). Photos are real,
    licensed Unsplash photography (see `lib/media.ts` for the credited
    catalog — swap in your own AirLynk photography any time by editing that
    one file).
  - The homepage globe is no longer an abstract wireframe/dot sphere. It's
    now a **realistic NASA-style Earth** (`components/three/globe-scene.tsx`)
    built from real day-map photography, a night-lights emissive layer, a
    drifting cloud shell, and a soft atmosphere rim — textures live in
    `public/textures/earth/` (sourced from the three.js official example
    assets, themselves derived from NASA Blue Marble / Visible Earth
    imagery). AirLynk destination markers and animated route arcs are
    unchanged from before.
  - `next.config.ts` now allow-lists `images.unsplash.com` via
    `images.remotePatterns` for the real photography.
- **Phase C — Remaining sections, cards, footer, AI concierge restyle,
  scroll storytelling, and a performance/accessibility pass (done):**
  - **AI Concierge** restyled to read as professional airline support rather
    than "futuristic AI": the homepage section and header shortcut now use a
    headset icon (matching the chat widget, which already used it) instead
    of a sparkle/magic icon — copy was already grounded in real flight data,
    no changes needed there.
  - **Footer** fully rebuilt (`components/layout/site-footer.tsx`) with the
    sections the brief calls for, built only from data that's real: a
    **Destinations** column generated from the same 12 seeded airports used
    everywhere else (each link deep-links into the homepage search panel and
    actually prefills that destination — see below), **Travel & Support**
    links to the real My Bookings / Fare Watchlist / Search pages plus a
    button that opens the real AI Concierge widget, a **Global Offices** /
    **Fleet** column (presentational company info — AirLynk itself is a demo
    brand, not real, so this is structural content, not a claim about a real
    company), and a **newsletter capture** that's explicitly documented as
    front-end-only in a code comment (the backend has no subscriber
    endpoint) rather than silently pretending to send the email anywhere.
    Social links are shown as plain muted "coming soon" labels rather than
    dead links to accounts that don't exist.
  - **Destination deep-linking made real**: `FlightSearchPanel` now reads an
    optional `?destination=IATA` URL param (used by the new footer links),
    prefills that airport into the search store, and scrolls itself into
    view — so those footer links do something, instead of just decorating.
  - **Cards**: the Phase A no-glow pass already covered every card
    (`Card`, `TiltCard`, flight/dashboard/admin cards); `experience-section.tsx`
    already carries the large-photography treatment from Phase B.
  - **Performance/accessibility**: hero photography loads via `next/image`
    (`priority` only on the current hero photo, everything else lazy by
    default), icon-only buttons carry `aria-label`s, focus-visible rings are
    global, and `prefers-reduced-motion` is respected site-wide.


## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Framer Motion · React Three Fiber / drei / three.js · Zustand · Axios

## Getting started

```bash
npm install
cp .env.example .env.local   # already pre-filled for local dev
npm run dev
```

The app expects the AirLynk FastAPI backend running at:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

(the app automatically appends `/api/v1` — see `lib/config.ts`). Change this
in `.env.local` to point at a different backend.

## What's included in Phase 1

- **Design system**: Midnight Navy / Aurora Cyan / Soft Lavender theme,
  Geist display font (bundled offline via the `geist` package) + Manrope
  body fallback, glassmorphism primitives, full Tailwind v4 token system
  in `app/globals.css`.
- **Cinematic intro**: once-per-session dark-to-reveal moment on the homepage.
- **3D Hero**: procedurally-built aircraft (no external GLTF needed), cloud
  and star particle fields, cursor-based camera parallax — `components/three`.
- **Interactive 3D Globe**: airports plotted from the backend's exact seed
  data (`lib/airports.ts`, mirrors `SEED_AIRPORTS` in
  `app/database/init_db.py`), animated route arcs that respond to the
  live search state.
- **Floating glass search panel**: airport autocomplete, date, passengers,
  class — pushes to `/search` with real query params.
- **Auth**: register → verify-email (OTP) → login → forgot/reset password,
  all wired to the exact backend request/response shapes in
  `app/schemas/user.py`. JWT access/refresh stored client-side with silent
  refresh-on-401 in `lib/api-client.ts`.
- **Flight search results** (`/search`) and **flight detail** (`/flights/[id]`)
  pages calling `GET /flights`, `GET /flights/{id}`, and
  `GET /flights/{id}/seats` — including a live seat-map preview.

## Folder structure

```
app/            routes (App Router)
components/     ui primitives, layout, sections, three/, auth, flights
services/       one file per backend router — exact endpoint calls
types/          TypeScript types mirroring the backend Pydantic schemas
store/          Zustand stores (auth, search)
lib/            api client, config, utils, airports data, three helpers
```

## Backend compatibility notes

- API prefix is `/api/v1` (from `app/core/config.py`), base URL is
  configurable via `NEXT_PUBLIC_API_BASE_URL`.
- All request/response types in `types/user.ts` and `types/flight.ts` are
  hand-mirrored from `app/schemas/user.py` and `app/schemas/flight.py` —
  keep both in sync if the backend schemas change.
- The airport list used for search autocomplete + the globe is a static
  mirror of `SEED_AIRPORTS` from `app/database/init_db.py` (there is no
  `/airports` list endpoint in the current backend).
- Fonts: the brief calls for Satoshi / Clash Display. Those aren't bundled
  (no offline license). Instead, typography now uses a **premium iOS-app
  stack**: `-apple-system` / `BlinkMacSystemFont` first, so real Apple
  devices render native **SF Pro** exactly like a native iOS/macOS app, with
  `Inter Variable` (bundled offline via `@fontsource-variable/inter`, visually
  near-identical to SF Pro) as the fallback everywhere else, then Geist.
  Tight letter-spacing + font-feature-settings (kern/liga/calt) are set
  globally in `app/globals.css` to match that crisp Apple type feel. Drop
  Satoshi/Clash Display `.woff2` files into `public/fonts` later if you still
  want them instead.

## What's included in Phase 2

- **Class selection** — on the flight detail page, each fare class is a real
  button wired to `flight.classes` (sold-out classes auto-disable when
  `available_seats < passengers`).
- **Interactive seat map** (`components/booking/seat-map-interactive.tsx`) —
  clicking a seat calls the real `POST /seats/{id}/lock`; clicking your own
  selected seat calls `DELETE /seats/{id}/lock`. Selection is capped at the
  passenger count from your search.
- **4-step booking wizard** (`/booking/[flightId]`) — Seats → Passengers →
  Extras → Review, with a persistent (sessionStorage) `booking-store` so a
  refresh mid-flow doesn't lose progress.
- **Ancillary services** — baggage, meals, lounge, priority boarding, extra
  legroom, travel insurance, Wi-Fi — mirrored 1:1 from `AncillaryType` /
  `ANCILLARY_PRICES` in `app/utils/constants.py`, quantity always equals
  passenger count (matches the backend's `unit_price × quantity` math
  exactly).
- **Order creation** — `POST /orders` in one call with `legs` + `passengers`
  + `ancillaries`, exactly matching `OrderCreate` in `app/schemas/order.py`.
  Guest checkout (name + email) is collected inline if the user isn't logged
  in, since the backend accepts `OptionalUser`.
- **Payment** (`/booking/[flightId]/payment?order=...`) — `POST
  /payments/create-intent` then, in demo mode (no real Stripe keys),
  automatically `POST /payments/demo-confirm` — matching your backend's demo
  flow exactly. A short taxi → accelerate → takeoff animation plays right
  after confirmation.
- **Boarding pass** — Apple-Wallet-style card with a **client-side generated
  QR code** (via the `qrcode` package — no external QR API/network call), PNR,
  seat, flight time, a **Download PDF** button wired to the real `GET
  /orders/{id}/ticket`, and Share (Web Share API / clipboard fallback). The
  "Wallet" button is intentionally disabled — there's no real Apple/Google
  Wallet integration yet, so it doesn't promise something that isn't there.
- **My Bookings** (`/orders`) — lists every order for the logged-in user via
  `GET /orders`, with status badges matching `OrderStatus`.
- **Order detail** (`/orders/[id]`) — full breakdown via `GET /orders/{id}`:
  passengers, seats, extras, total, e-ticket download, and **Cancel booking**
  (`PATCH /orders/{id}/cancel`) when the order is still cancellable.

### A couple of real bugs caught & fixed while wiring Phase 2

Your backend's `FareClass` and `SeatStatus` enums store **lowercase** values
(`"economy"`, `"available"`, `"locked"`, `"booked"`…), but the Phase 1 code
had `class_type` filters and seat-status style lookups in **uppercase**
(`"ECONOMY"`, `"AVAILABLE"`…), which would have silently returned zero search
results and shown every seat as available regardless of its real status.
Both are fixed now (`types/flight.ts`, `components/flights/seat-map-preview.tsx`)
and verified against your actual seed data casing.

## What's included in Phase 3

- **User Dashboard** (`/dashboard`) — stats (upcoming/past trips, total
  spent), upcoming-trip cards, and quick links, built with `TiltCard` — a
  reusable premium 3D-tilt glass card (cursor-reactive rotation + specular
  glare via Framer Motion, no emoji anywhere, matching the Apple/Tesla/Nothing
  brief).
- **AI Travel Concierge** — a global floating chat widget (mounted in
  `app/layout.tsx`, available on every page) wired to `POST /ai/chat` with
  real session continuity (`session_id` persisted in `store/concierge-store.ts`)
  matching `app/schemas/ai.py` exactly.
- **Loyalty Rewards** (`/dashboard/loyalty`) — real `GET /users/me/loyalty`
  data, a rotating **3D loyalty badge** (`components/three/loyalty-badge-scene.tsx`,
  React Three Fiber torus + icosahedron, tier-colored) and full transaction
  history.
- **Profile settings** (`/dashboard/profile`) — `PUT /users/me` for editable
  fields, `DELETE /users/me` for account deletion.
- **Price Alerts / Watchlist** (`/price-alerts`) — create/list/delete via the
  exact `/price-alerts` endpoints in `app/routers/price_alerts.py`.
- **Reviews & Ratings** — flight detail page now shows real reviews via
  `GET /flights/{id}/reviews` and lets signed-in users submit one via
  `POST /reviews`, matching `app/schemas/review.py` (rating + optional
  service/comfort/value sub-ratings).

### Design note

Per your direction: **no emojis anywhere** in the UI (checked and confirmed
across the whole codebase) — status/points/rating indicators use Lucide icons
and the `TiltCard` / 3D components instead. The dashboard, loyalty, and
concierge surfaces lean further into the **3D, premium-app feel**: a real
WebGL 3D badge for loyalty tier, and cursor-reactive 3D-tilt glass cards
throughout the dashboard, on top of the Phase 1 3D hero/globe.

## What's included in Phase 4

- **Admin Dashboard** (`/admin`, admin-role-gated by `AdminGuard` — checks
  `user.role === "admin"` against the real session) — stats tiles, a revenue
  area chart, and an occupancy-by-route bar chart, both from
  `GET /admin/analytics/*`, rendered with `recharts`.
- **Admin → Flights** (`/admin/flights`) — create/edit/deactivate flights via
  `POST/PUT/DELETE /admin/flights`. Note: the backend has no "list all
  flights" endpoint, so this screen searches by route (reusing the public
  `GET /flights`) rather than pretending to paginate every flight in the
  system — an honest reflection of what the API actually supports.
- **Admin → Users** (`/admin/users`) — search + activate/suspend via
  `GET/PATCH /admin/users`.
- **Admin → Orders** (`/admin/orders`) — full order list with status filter
  via `GET /admin/orders`.
- **Notifications** — the backend has **no dedicated notifications table or
  endpoint**, so rather than build a fake one, the bell icon in the header
  (`components/layout/notification-bell.tsx`) derives real notifications from
  data that does exist: upcoming confirmed trips (`GET /orders`, departing
  within 72h) and price alerts that have actually hit their target
  (`GET /price-alerts`, comparing `last_lowest_price` to `target_price`). If
  you add a real notifications endpoint later, this is the one component to
  swap over.
- **SEO** — `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts` (installable
  PWA-lite manifest), and per-page `<title>`/`<meta description>` via Next.js
  Metadata API.
- **Performance** — server-rendered/static where possible (see the route
  table below from the production build), client-only work isolated to
  interactive screens (booking, dashboard, admin).
- **Accessibility** — semantic form labelling throughout via the shared
  `Label`/`Input` primitives, `aria-label`s on icon-only buttons (e.g. the
  notification bell), focus-visible rings on every interactive control,
  and `prefers-reduced-motion` handling in `app/globals.css`.

## Production build

```
Route (app)                                 Size  First Load JS
┌ ○ /                                    10.8 kB         206 kB
├ ○ /admin                                120 kB         303 kB
├ ○ /admin/flights                       9.83 kB         190 kB
├ ○ /admin/orders                        4.91 kB         175 kB
├ ○ /admin/users                         4.71 kB         156 kB
├ ƒ /booking/[flightId]                  9.93 kB         233 kB
├ ƒ /booking/[flightId]/payment          3.95 kB         208 kB
├ ○ /dashboard                           7.25 kB         430 kB
├ ○ /dashboard/loyalty                    5.1 kB         428 kB
├ ○ /dashboard/profile                   6.16 kB         184 kB
├ ƒ /flights/[id]                        8.37 kB         199 kB
├ ○ /orders                              3.83 kB         187 kB
├ ƒ /orders/[id]                         2.56 kB         207 kB
├ ○ /price-alerts                        9.23 kB         228 kB
├ ○ /search                              6.12 kB         216 kB
└ … auth pages, robots.txt, sitemap.xml, manifest.webmanifest
```

`npm run build` passes cleanly with zero type errors across all 23 routes.

