import { getImageProps } from "next/image";
import { preload } from "react-dom";

// 1×1 transparent GIF: lets the hidden hero variant pick a "source" that costs nothing to load.
const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const WIDE = "(min-width: 900px)";
const NARROW = "(max-width: 899.98px)";

const IMAGES = {
  wide: { src: "/images/waiting-room.webp", width: 1200, height: 900, media: WIDE, other: NARROW },
  narrow: { src: "/images/waiting-room-m.webp", width: 828, height: 621, media: NARROW, other: WIDE },
} as const;

/**
 * Hero photo (the LCP element). Both hero layouts are in the HTML; each photo only downloads
 * at its own breakpoint (art-direction <picture>), is preloaded with matching media and
 * fetchpriority=high, and is never hidden by animation.
 */
export function HeroImage({ variant, alt }: { variant: "wide" | "narrow"; alt: string }) {
  const img = IMAGES[variant];
  preload(img.src, { as: "image", fetchPriority: "high", media: img.media });
  const { props } = getImageProps({ src: img.src, alt, width: img.width, height: img.height, fetchPriority: "high", loading: "eager" });
  return (
    <picture>
      <source media={img.other} srcSet={BLANK} />
      <img {...props} alt={alt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
    </picture>
  );
}
