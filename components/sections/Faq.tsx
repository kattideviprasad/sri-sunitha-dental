"use client";

import { useState } from "react";
import { faqs, waHref, clinic } from "@/lib/clinic";
import { Icon } from "@/components/ui/Icon";
import { Flag } from "@/components/ui/bits";

/** FAQ accordion: one answer open at a time, the first open by default. */
export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="section faq">
      <div className="wrap">
        <div className="faq-intro">
          <div className="eyebrow" data-reveal>Questions</div>
          <h2 className="h2" data-reveal>Good to know before you visit.</h2>
          <a href={waHref(`Hello ${clinic.name}, I have a question: `)} target="_blank" rel="noopener" className="btn btn-outline btn-sm" data-reveal>
            <Icon name="wa" size={17} strokeWidth={1.7} />
            Ask us on WhatsApp
          </a>
        </div>
        <div className="faq-list" data-stagger>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div className="faq-item" key={f.q}>
                <button type="button" className="faq-q" aria-expanded={isOpen} aria-controls={`faq-${i + 1}`} onClick={() => setOpen(isOpen ? -1 : i)}>
                  <span>{f.q}</span>
                  <span className="plus"><Icon name="plus" /></span>
                </button>
                <div className="faq-a" id={`faq-${i + 1}`} hidden={!isOpen}>
                  {f.pending && (
                    <div className="placeholder-note"><span className="label">Placeholder · </span>{f.pending}</div>
                  )}
                  <p>{f.a}</p>
                  {f.flag && <Flag>{f.flag}</Flag>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
