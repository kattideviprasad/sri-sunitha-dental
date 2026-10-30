"use client";

import { useRef, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// GSAP + ScrollTrigger live in their own chunk, fetched after hydration so they never delay the hero (LCP).
const MotionEngine = dynamic(() => import("./MotionEngine"), { ssr: false });

/** Wraps the page; the lazily loaded engine animates elements inside it by their data attributes. */
export function Motion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  return (
    <div ref={root}>
      {children}
      <MotionEngine root={root} pathname={pathname} />
    </div>
  );
}
