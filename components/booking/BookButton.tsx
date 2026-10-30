"use client";

import type { MouseEvent, ReactNode } from "react";
import { useBooking } from "./BookingProvider";

/**
 * Any "Book" call to action. Renders a real link to the booking form (works without JS);
 * with JS it prefills the treatment and scrolls to the form on the current page.
 */
export function BookButton({ treatment, className, children, onBook }: { treatment?: string; className: string; children: ReactNode; onBook?: () => void }) {
  const { book } = useBooking();
  const href = treatment ? `/contact/?treatment=${encodeURIComponent(treatment)}#book` : "/contact/#book";
  const onClick = (e: MouseEvent) => {
    e.preventDefault();
    onBook?.();
    book(treatment);
  };
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}
