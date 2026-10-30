"use client";

import { useEffect, useState } from "react";
import { telHref, waHref } from "@/lib/clinic";
import { Icon } from "@/components/ui/Icon";

const isField = (el: EventTarget | null) => el instanceof HTMLElement && el.matches("input, select, textarea");

/** Sticky Call / WhatsApp bar on phones. Slides away while a form field is focused so it never sits over the form above the keyboard. */
export function MobileCallBar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onIn = (e: FocusEvent) => isField(e.target) && setHidden(true);
    const onOut = (e: FocusEvent) => isField(e.target) && !isField(e.relatedTarget) && setHidden(false);
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  return (
    <div className="only-narrow">
      <div className="callbar-space" />
      <div className="callbar" data-hidden={hidden}>
        <a href={telHref} className="call">
          <Icon name="phone" size={16} />
          Call
        </a>
        <a href={waHref()} target="_blank" rel="noopener" className="wa">
          <Icon name="wa" size={17} strokeWidth={1.7} />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
