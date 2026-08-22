# cocoNuts2 — Mr. Coconetto (Simply Original)

## Problem Statement
Deploy & build out the "Mr. Coconetto" site — a premium personalized-coconut brand for weddings, events & celebrations. User uploaded the real codebase, then requested: content overhaul (premium/trustworthy, softened claims), enriched Services/Plans/FAQ/About, working Contact enquiry form, Blog, on-page SEO, an interactive "Customize Your Coconut" order section, and full mobile responsiveness.

## Architecture
- **Frontend**: React 19 (CRA + craco), Tailwind + shadcn/ui, framer-motion, react-router (`/`, `/blog`, `/blog/:slug`). Content in `src/data/mock.js`.
- **Backend**: FastAPI + Motor (MongoDB). Endpoints: `/api/health`, `/api/status`, `POST /api/enquiries`, `POST /api/orders`.
- **DB**: MongoDB via MONGO_URL / DB_NAME.

## Homepage sections (in order)
Hero → Customizer → About Us (+ founder) → EventTypes → Stats → Video → Services → Plans → Cities → Occasions → WhyChoose → CTA → Testimonials → BlogTeaser → FAQ → Contact.

## Key Features Implemented
- **Content overhaul**: keyword-rich, trustworthy copy. Softened claims ("AI-Powered Engraving"→"Precision Custom Engraving", "Wellness Bar"→"Customized Coconut Bar"). Removed unverified Celebrities & Partners/hotel sections.
- **Services**: 8 cards, each with description + customization + min order + WhatsApp CTA.
- **Plans**: Gold/Diamond/Platinum with complete inclusions.
- **About Us**: reference-matched layout (mascot + real product + founder Rupesh Gaur, story + promise).
- **Contact**: enquiry form (Name, WhatsApp, Event Date, Location, Quantity, Event Type, Customization) → saves to DB + opens WhatsApp; Call Us.
- **Customize Your Coconut**: live preview (real coconut image) with engraved Print text + Event name; order form (Print ≤40 chars, Event, Mobile) → `POST /api/orders` returns instant order number `MC-XXXXXX`, success card, opens WhatsApp. Order also intended for email (PENDING provider).
- **Blog**: list + 10 individual posts + homepage teaser; related posts.
- **SEO**: title/meta/OG, robots.txt, sitemap.xml, ALT text, internal linking.
- **Production hardening**: env-driven CORS, `/api/health` with DB ping, global error handler (no stack traces).
- **Privacy fix**: removed public `GET /api/enquiries` (was world-readable leads).
- **Mobile responsive**: overflow-x fixes, stacking founder card, wrapped form labels, mobile-sized floating buttons, anchor scroll-offset, responsive grids throughout.

## Testing
- iteration_1: backend+frontend 100% (landing, blog, enquiry form).
- iteration_2: backend+frontend 100% (customizer/order flow, mobile overflow fixed, GET /api/enquiries removed).
- Backend regression suite: `pytest /app/backend/tests -v` (22 cases).

## Backlog / Next
- P1: **Email on order/enquiry** — needs a provider (Resend/SendGrid) + API key from user (integration pending).
- P1: Protected admin endpoint to view orders/enquiries (currently write-only).
- P2: After deploy, set `CORS_ORIGINS` to live domain (drop wildcard).
- P2: Mobile format validation (E.164) on order mobile; visible "Open WhatsApp" fallback link in success card.
- P3: Replace stock service/blog images with real brand photography.

- 2026-06 feature batch (logo upload + new pages + polish), tested 100% (iteration_3, backend 21/21, frontend 21/21):
  - **Logo/image upload** in the customizer via **Emergent Object Storage** (backend `POST /api/upload-logo` + `GET /api/files/{path}`; orders now carry `logo_url`/`logo_path`). Live preview shows the uploaded logo on the coconut.
  - **Dedicated `/customize` page** added to the top nav (desktop + mobile) and footer.
  - **Multi-line + larger preview text** (print field is now a textarea, `print_text` max 60, preview renders line breaks — e.g. "Radha / and / Rupesh").
  - **Submit Order button → green.** Added an iOS-safe "Open WhatsApp" fallback in the success card.
  - **Instagram feed section** above the footer (home) + **Instagram floating button** (with WhatsApp + Call) + **brand-colored footer socials** (IG gradient, FB blue, YT red) linking to instagram.com/mrcoconetto, facebook.com/mrcoconetto, youtube.com/@mrcoconetto.
  - **City chips are clickable** → `/cities/:city` detail page with city-specific info.
  - **Services "Read Full Story"** buttons → `/services/:slug` story pages.
  - **Plans section redesigned** to a dark neon theme (gold/diamond/platinum glowing cards).
  - **Testimonials carousel** now auto-advances (looping).

- 2026-06 feature batch #2 (auth + admin + email + logo placement + polish), tested 100% (iteration_4, backend 34/34, frontend all flows):
  - **JWT admin auth** (single seeded admin, Bearer token) + **Admin Inbox** at `/admin` (login at `/admin/login`) to view all orders (with uploaded logo thumbnails) and enquiries. Endpoints: `/api/auth/login`, `/api/auth/me`, `/api/admin/orders`, `/api/admin/enquiries`. Admin creds in `/app/memory/test_credentials.md`.
  - **Email alerts (Resend)** on new order/enquiry to info@mrcoconetto.com + mrcoconetto@gmail.com. **NOT ACTIVE YET** — `RESEND_API_KEY` is empty; `send_alert()` safely no-ops (logs) until the key is added. Order/enquiry creation is never blocked.
  - **Logo placement**: uploaded logo renders **black & white (grayscale)** on the coconut, is **draggable** to reposition, and **resizable** via a slider.
  - **City detail page redesigned** — mobile-first hero, stats band, offerings/occasions, gallery, CTA band, related cities.
  - **Testimonials** auto-scroll 34% faster (1650ms).
  - **Header** nav moved to `xl` breakpoint to fix desktop crowding after the Customize link was added.

## Notes
- No auth in app → no test_credentials needed.
- WhatsApp CTAs use wa.me deep links; email delivery is NOT yet wired (needs provider key).

## Ship / Deploy log
- 2026-06: Ported full codebase into workspace `/app` (preserved protected .env). Backend health OK, `/api/orders` + `/api/enquiries` verified via curl. deployment_agent: **PASS** (fixed one unbounded `/api/status` query → added sort+limit 100). App is deployment-ready.
- 2026-06 mobile polish pass (items 8–15): mobile header logo enlarged; "Request a Quote" confirmed green (pink kept as secondary accent); hero marquee/ticker made responsive with wider edge-fade + seamless loop; floating WhatsApp/Call buttons made smaller & repositioned; Cities list confirmed clean (no NCR/Goa); "Fresh & Hygienically Prepared" wording confirmed; Sangeet & Mehndi card description no longer clipped on mobile (stronger gradient + taller collage, removed line-clamp); mobile hero heading made more compact while keeping premium typography.

## Ship / Deploy log (continued)
- 2026-06 (re-import): User uploaded full codebase zip and said "deploy here". Ported source into `/app` (frontend src + backend server.py), preserved protected `.env` (MONGO_URL/DB_NAME) and added deploy-critical vars: JWT_SECRET (fresh), ADMIN_EMAIL/ADMIN_PASSWORD (admin@mrcoconetto.com), EMERGENT_LLM_KEY + INTEGRATION_PROXY_URL (object storage), RESEND_API_KEY empty (email no-op). Installed `resend`. Ran `yarn install`.
- Verified running: `/api/health` = ok/db up; POST `/api/enquiries`, `/api/orders`, `/api/auth/login` all pass via curl; homepage renders full site. Removed a stray default `admin@example.com` user seeded before env loaded, and cleaned test data.
- deployment_agent: **PASS** (no blockers). App is deployment-ready; user to click the platform **Deploy** button to go live.
- Post-deploy TODO (P2): set `CORS_ORIGINS` to the live domain (drop `*`); optionally add `RESEND_API_KEY` to activate email alerts.
