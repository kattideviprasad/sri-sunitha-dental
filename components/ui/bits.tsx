import type { ReactNode } from "react";
import { Icon } from "./Icon";

/** Yellow "to confirm" review flag. Hidden site-wide when <body> loses the `show-flags` class. */
export function Flag({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`flag ${className}`}>{children}</span>;
}

/** Yellow placeholder box for content the clinic still has to supply. Always shown. */
export function PlaceholderNote({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`placeholder-note ${className}`}>
      <span className="label">{label}</span>
      <span className="body">{children}</span>
    </div>
  );
}

export function Eyebrow({ children, ...rest }: { children: ReactNode; "data-reveal"?: boolean }) {
  return <div className="eyebrow" {...rest}>{children}</div>;
}

/** Heading that renders as h1 on sub-pages (where the section leads the page) and h2 elsewhere. Same look. */
export function SectionHeading({ as = "h2", className = "h2", children }: { as?: "h1" | "h2"; className?: string; children: ReactNode }) {
  const Tag = as;
  return <Tag className={className} data-reveal>{children}</Tag>;
}

/** Empty photo slot shown until the clinic supplies the picture. */
export function ImageSlot({ caption }: { caption: string }) {
  return (
    <div className="slot slot-empty">
      <Icon name="image" size={28} strokeWidth={1.5} />
      <span>{caption}</span>
    </div>
  );
}
