# Progress log — Sri Sunitha Dental Clinic website

## 2026-10-30 · Static build (approved visual reference)
- Built a plain HTML/CSS/JS version of the Claude Design handoff (`Sri Sunitha Dental Clinic.dc.html`).
- Approved as the visual reference. Now kept at `_reference/site/` (not deleted).

## 2026-10-30 · Next.js static build with GSAP

### Stack
- Next.js 16.4 (App Router, Turbopack) + React 19 + TypeScript 5.9 (pinned: TS 7 isn't supported by Next's type check yet).
- Tailwind CSS 4.3: colour tokens from `styles.css` live in `@theme` (`app/globals.css`); the static build's rules were ported 1:1 into `@layer components`.
- `output: "export"`, `trailingSlash: true`, `images.unoptimized: true` → fully static site in `out/`.
- GSAP 3.15 + `@gsap/react` (useGSAP, ScrollTrigger, SplitText).

### Structure
- Routes: `/` (all sections), `/treatments/`, `/about/`, `/contact/`, plus `sitemap.xml` and `robots.txt`.
- `lib/clinic.ts`: the single source for every clinic fact (name, phone, WhatsApp, address, hours, Maps links, rating, review count, treatments, reviews, FAQ, placeholders). `SITE_URL` = `https://sri-sunitha-dental.vercel.app` (**to confirm**).
- `lib/whatsapp.ts`: booking validation and the WhatsApp message (same logic as the static `main.js`). `lib/seo.ts`: per-page metadata, Open Graph/Twitter cards, `Dentist` JSON-LD.
- Components: `layout/` (AnnouncementBar + Header, Footer, MobileCallBar), `sections/` (Hero, HeroImage, Treatments, Doctor, Kids, Reviews, Booking, Clinic, Faq, Visit), `booking/` (BookingProvider, BookButton), `motion/` (Motion + lazily loaded MotionEngine), `ui/`.
- Sub-pages make their first section's heading the `<h1>` (same styling).

### Decisions and fixes
- **Hours inconsistency fixed:** the top bar, hero "Open until", kids "Timings", FAQ, Visit table, footer and JSON-LD all read `clinic.hours`. Sunday is flagged "To confirm" and left out of the JSON-LD until it's confirmed.
- Review flags stay **on** (`<body class="show-flags">` in `app/layout.tsx`); all placeholders kept. No facts invented.
- Nav: Treatments → `/treatments/`, Dr. Sunitha → `/about/`, Visit us → `/contact/`, Kids → `/#kids`, Reviews → `/#reviews`, FAQ → `/contact/#faq`. "Book" CTAs scroll to the form on the current page, otherwise go to `/contact/?treatment=…#book`.
- Images: WebP in `public/images` via `next/image`. Hero has a separate 828px mobile file (23 KB) and a 1200px desktop file (51 KB), served through an art-direction `<picture>` so phones never download the desktop copy. Logos shrunk to 3–6 KB WebP. `og.jpg` 1200×630 generated for social previews.
- `scripts/fix-export-prefetch.mjs` (postbuild): Next 16's export writes segment-prefetch files as `__next.<seg>/__PAGE__.txt`, but the router requests `__next.<seg>.__PAGE__.txt`. A flat copy avoids 404s and console errors on plain static hosts.
- Tailwind preflight sets `line-height: 1.5` on `html`; reset to `normal` so heights match the reference exactly.

### Motion (GSAP, mobile first)
- Only `transform`/`opacity` are animated. Initial states are set with `gsap.set` inside `useGSAP` (never CSS), so content is visible if JS fails.
- The GSAP engine is a separate chunk loaded after hydration, so it never competes with the hero image.
- Hero: the headline and photo (LCP candidates) are **never hidden on the first page load**. The eyebrow, lede, CTAs and stats get a short (<1s) intro, but only if hydration happens within 250ms of first paint; otherwise visible content is left alone, so nothing flashes. In-app navigations run the full intro (headline lines via SplitText on desktop, photo fade).
- Sections fade up (y 24 / 16 on mobile, 0.6s / 0.5s, power2.out), once, never reversed. Desktop staggers cards, reviews, FAQ, steps and gallery; phones reveal each group as one unit (fewer triggers).
- Count-up on 5.0 and 600+, once, when scrolled into view.
- `gsap.matchMedia()` handles breakpoints and `prefers-reduced-motion` (no motion at all). No parallax, pinning, scrub or smooth-scroll library.
- Clean-up: `revertOnUpdate` on route change, matchMedia revert on breakpoint change, `ignoreMobileResize`, debounced `ScrollTrigger.refresh()` on content height changes. On slow first loads, setup is deferred to `requestIdleCallback`.
- Bug found and fixed while testing: with only `isDesktop`/`reduce` conditions, gsap.matchMedia never ran on phones. An `isMobile` condition was added.

### Mobile UX
- Tap targets ≥ 44px: invisible hit-area extension (`.tap`) on small text links. Footer link rows become 44px tall on phones (footer is 36px taller at 360px; everything else is identical).
- The sticky Call/WhatsApp bar slides away while a form field is focused; `scroll-padding-bottom` and a safe-area-aware spacer keep it off the form and footer.
- Inputs are 16px; the phone field uses `type="tel"`, `inputmode="tel"`, `autocomplete="tel-national"`. No horizontal scroll at 360, 390 or 1280px.

### Verification
- `npm run build`: passes with zero errors; `tsc --noEmit` clean.
- Side by side against `_reference/site`:
  - 1280px: every section height identical (page 8463px vs 8463px).
  - 360px: every section identical; footer +36px from the tap-target change.
- Booking form tested with `window.open` stubbed: empty submit shows all 4 errors; a valid submit builds the correct `wa.me/918019111888` message (phone normalised from +91), shows the summary, and "Edit request" keeps the input. Tested on the same page (`/treatments/` "Book this" prefill + scroll to 76px) and across pages (`/about/` → `/contact/#book`).
- Motion: no element left hidden after scrolling any page; reduced motion → nothing hidden or moved; count-up ends on exactly "5.0" and "600+".

### Lighthouse — mobile, `/` (Lighthouse 12, local static server with gzip)
Run with Chrome's PaintHolding disabled: in local headless runs it holds the first paint ~2s, even for the plain HTML reference. That doesn't happen for real visitors.

| Run | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| 1 | 96 | 100 | 100 | 100 | 2.5 s | 0 | 140 ms |
| 2 | 89 | 100 | 100 | 100 | 2.7 s | 0 | 310 ms |
| 3 | 95 | 100 | 100 | 100 | 2.7 s | 0 | 140 ms |
| 4 | 81 | 100 | 100 | 100 | 2.7 s | 0 | 610 ms |
| 5 | 94 | 100 | 100 | 100 | 2.7 s | 0 | 170 ms |
| **Median** | **94** | **100** | **100** | **100** | **2.7 s** | **0** | **170 ms** |

- Spread comes from TBT spikes on the local machine; LCP and CLS are stable.
- Static reference on the same setup: Performance 91, Accessibility 97.
- GSAP impact measured: loading it eagerly cost ~2 points and ~0.3s LCP, so it is now lazy-loaded.

### Before going live (owner)
- Turn review flags off: remove `show-flags` from `<body>` in `app/layout.tsx`.
- Confirm the domain (`clinic.siteUrl`), Sunday hours / afternoon break, WhatsApp number, kids' minimum age, languages, payment methods.
- Supply the placeholders: Dr. Sunitha's portrait and quote, college/year, registration number, kids photo, sterilisation photo and hygiene text, toothache answer, and a real hero photo.
