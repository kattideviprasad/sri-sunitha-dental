import type { CSSProperties } from "react";

export type IconName = "phone" | "arrow" | "wa" | "pin" | "plus" | "check" | "chevron" | "image";

/** Line icon from the shared sprite (rendered once in the root layout). */
export function Icon({ name, size = 16, strokeWidth, style }: { name: IconName; size?: number; strokeWidth?: number; style?: CSSProperties }) {
  return (
    <svg className="i" width={size} height={size} aria-hidden="true" style={strokeWidth ? { strokeWidth, ...style } : style}>
      <use href={`#i-${name}`} />
    </svg>
  );
}

export function Stars({ width, height, className = "stars" }: { width: number; height: number; className?: string }) {
  return (
    <svg className={className} width={width} height={height} role="img" aria-label="5 out of 5 stars">
      <use href="#i-stars" />
    </svg>
  );
}

const star = "M11 1.5l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L11 15.3l-5.4 2.9 1.1-6.1L2.2 7.9l6.1-.8z";

export function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <symbol id="i-phone" viewBox="0 0 24 24"><path d="M5 4h3.5l1.8 4.6-2.3 1.5a11.5 11.5 0 0 0 5.9 5.9l1.5-2.3L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 5.6A1.5 1.5 0 0 1 5 4Z" /></symbol>
      <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></symbol>
      <symbol id="i-wa" viewBox="0 0 24 24"><path d="M4.5 19.5l1.2-3.6A8 8 0 1 1 8.6 18.6Z" /></symbol>
      <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></symbol>
      <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></symbol>
      <symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></symbol>
      <symbol id="i-chevron" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></symbol>
      <symbol id="i-image" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5-9 9" /></symbol>
      <symbol id="i-stars" viewBox="0 0 120 22">
        {[0, 24, 48, 72, 96].map((x) => <path key={x} transform={`translate(${x} 0)`} d={star} />)}
      </symbol>
    </svg>
  );
}
