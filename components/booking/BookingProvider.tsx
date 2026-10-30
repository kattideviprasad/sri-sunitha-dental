"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

const HEADER_OFFSET = 76;

type Request = { treatment: string | null; nonce: number };
type Ctx = { request: Request; book: (treatment?: string) => void };

const BookingContext = createContext<Ctx | null>(null);

export function scrollToBook() {
  const el = document.getElementById("book");
  if (!el) return false;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET, behavior: reduce ? "auto" : "smooth" });
  return true;
}

/** Shares "Book this" requests between CTAs and the booking form. */
export function BookingProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [request, setRequest] = useState<Request>({ treatment: null, nonce: 0 });

  const book = useCallback(
    (treatment?: string) => {
      if (document.getElementById("book")) {
        setRequest((r) => ({ treatment: treatment ?? null, nonce: r.nonce + 1 }));
        scrollToBook();
      } else {
        // Form isn't on this page: go to /contact and let the form pick the treatment up from the URL.
        router.push(treatment ? `/contact/?treatment=${encodeURIComponent(treatment)}#book` : "/contact/#book");
      }
    },
    [router],
  );

  return <BookingContext.Provider value={{ request, book }}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
