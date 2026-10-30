"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

// True until the first page has hydrated. On that first load the server HTML is already on screen,
// so we must not hide anything the visitor can already see (that would flash). Client-side route
// changes render fresh DOM and useGSAP runs before paint, so the hidden states never show.
let firstLoad = true;

/**
 * Page motion engine (loaded lazily by <Motion>, so GSAP never competes with first paint).
 * Sections only carry data attributes:
 *   data-hero-root / data-hero="eyebrow|title|lede|ctas|photo|stats"  → hero load-in (< 1s)
 *   data-reveal                                                        → fade-up once
 *   data-stagger (children)                                            → staggered fade-up once
 *   data-count="5.0" | "600+"                                          → count-up once
 * Only transform and opacity are animated. Initial states are set here (never in CSS),
 * so everything stays visible if JS fails. Reduced motion → nothing moves.
 */
export default function MotionEngine({ root, pathname }: { root: RefObject<HTMLDivElement | null>; pathname: string }) {
  useGSAP(
    (_ctx, contextSafe) => {
      const el = root.current;
      if (!el) return;

      // Content already painted for a while (slow device / slow hydration)? Then leave what's visible alone.
      const fcp = performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 0;
      const initial = firstLoad;
      const late = initial && performance.now() - fcp > 250;
      firstLoad = false;
      const offscreen = (n: Element) => n.getBoundingClientRect().top > window.innerHeight;
      const canHide = (n: Element) => !late || offscreen(n);

      const mm = gsap.matchMedia();
      const setup = () => mm.add(
        // matchMedia only runs this callback while at least one condition matches, so both breakpoints are listed.
        { isDesktop: "(min-width: 900px)", isMobile: "(max-width: 899.98px)", reduce: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          const { isDesktop, reduce } = ctx.conditions as { isDesktop: boolean; reduce: boolean };
          if (reduce) return;

          const dist = isDesktop ? 24 : 16;
          const ease = "power2.out";
          const reveal = { opacity: 1, y: 0, duration: isDesktop ? 0.6 : 0.5, ease, clearProps: "transform,opacity" };

          // ---------- Hero load-in (only the variant that is displayed) ----------
          // The headline and photo are the LCP candidates: on the first page load they are painted straight
          // from the HTML and never hidden. They only join the intro on in-app navigations (no LCP, no flash).
          const hero = el.querySelector<HTMLElement>(isDesktop ? ".hero[data-hero-root]" : ".hero-m[data-hero-root]");
          if (hero && !late) {
            const q = (k: string) => hero.querySelector<HTMLElement>(`[data-hero="${k}"]`);
            const tl = gsap.timeline({ defaults: { ease, clearProps: "transform,opacity" } });
            const title = q("title");
            if (!initial && title && isDesktop) {
              const split = SplitText.create(title, { type: "lines", linesClass: "hero-line" });
              tl.from(split.lines, { opacity: 0, y: 20, duration: 0.5, stagger: 0.06, onComplete: () => split.revert() }, 0.05);
            } else if (!initial && title) {
              tl.from(title, { opacity: 0, y: 12, duration: 0.5 }, 0.05);
            }
            if (!initial) tl.from(q("photo"), isDesktop ? { opacity: 0, scale: 1.04, duration: 0.7 } : { opacity: 0, duration: 0.5 }, 0.2);
            tl.from(q("eyebrow"), { opacity: 0, y: 10, duration: 0.4 }, 0)
              .from(q("lede"), { opacity: 0, y: dist / 2, duration: 0.45 }, 0.22)
              .from(q("ctas"), { opacity: 0, y: dist / 2, duration: 0.45 }, 0.32);
            const stats = q("stats");
            if (stats && canHide(stats)) tl.from(stats, { opacity: 0, y: dist / 2, duration: 0.45 }, 0.42);
          }

          // ---------- Count-up on the teal stat block ----------
          const restore: (() => void)[] = [];
          hero?.querySelectorAll<HTMLElement>("[data-count]").forEach((n) => {
            if (!canHide(n)) return;
            const raw = n.dataset.count ?? "";
            const m = raw.match(/^([\d.]+)(.*)$/);
            if (!m) return;
            const target = parseFloat(m[1]);
            const decimals = (m[1].split(".")[1] ?? "").length;
            const suffix = m[2];
            const show = (v: number) => (n.textContent = v.toFixed(decimals) + suffix);
            const o = { v: 0 };
            show(0);
            restore.push(() => (n.textContent = raw));
            ScrollTrigger.create({
              trigger: n,
              start: "top 95%",
              once: true,
              onEnter: () => gsap.to(o, { v: target, duration: isDesktop ? 1.2 : 1, delay: 0.3, ease, onUpdate: () => show(o.v), onComplete: () => (n.textContent = raw) }),
            });
          });

          // ---------- Section reveals (play once, never reverse) ----------
          // Desktop staggers the children of [data-stagger]; phones reveal each group as one unit
          // (fewer staggers, fewer ScrollTriggers, less main-thread work on mid-range Android).
          const items: HTMLElement[] = [];
          el.querySelectorAll<HTMLElement>("[data-reveal]").forEach((n) => {
            if (!n.closest("[data-hero-root]")) items.push(n);
          });
          el.querySelectorAll<HTMLElement>("[data-stagger]").forEach((group) => {
            if (isDesktop) items.push(...(Array.from(group.children) as HTMLElement[]));
            else items.push(group);
          });
          const hidden = items.filter(canHide); // all layout reads happen here, before any writes
          if (hidden.length) {
            gsap.set(hidden, { opacity: 0, y: dist });
            ScrollTrigger.batch(hidden, {
              start: "top 92%",
              once: true,
              interval: 0.1,
              batchMax: isDesktop ? 6 : 3,
              onEnter: (batch) => gsap.to(batch, { ...reveal, stagger: isDesktop ? 0.08 : 0.05, overwrite: true }),
            });
          }

          return () => restore.forEach((fn) => fn());
        },
        el,
      );

      // Slow first load: everything we would touch is below the fold, so set it up when the browser is idle
      // instead of adding to the hydration long task. Otherwise (fast load / in-app navigation) run now, before paint.
      let idle: number | undefined;
      if (late && "requestIdleCallback" in window) idle = window.requestIdleCallback(contextSafe!(setup), { timeout: 1500 });
      else setup();

      // Content height changes (FAQ toggles, form states, late images) move trigger positions: refresh, debounced.
      // The observer fires once on observe(); skip that one.
      let t: ReturnType<typeof setTimeout> | undefined;
      let primed = false;
      const ro = new ResizeObserver(() => {
        if (!primed) return void (primed = true);
        clearTimeout(t);
        t = setTimeout(() => ScrollTrigger.refresh(), 200);
      });
      ro.observe(el);

      return () => {
        if (idle !== undefined) window.cancelIdleCallback(idle);
        clearTimeout(t);
        ro.disconnect();
        mm.revert();
      };
    },
    { scope: root, dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
