"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { clinic, telHref } from "@/lib/clinic";
import { TIMES, buildBooking, todayISO, validate, type BookingErrors, type BookingInput, type DayKey, type TimeKey } from "@/lib/whatsapp";
import { Icon } from "@/components/ui/Icon";
import { Flag, SectionHeading } from "@/components/ui/bits";
import { scrollToBook, useBooking } from "@/components/booking/BookingProvider";

const EMPTY: BookingInput = { name: "", phone: "", treatment: "", day: "", date: "", time: "", note: "" };
const DAYS: { key: DayKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "tomorrow", label: "Tomorrow" },
  { key: "other", label: "Another day" },
];
const OPTIONS: string[] = [...clinic.treatments.map((t) => t.title), clinic.formExtraOption];

export function Booking({ headingAs = "h2" }: { headingAs?: "h1" | "h2" }) {
  const { request } = useBooking();
  const [form, setForm] = useState<BookingInput>(EMPTY);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [sent, setSent] = useState<{ url: string; summary: string } | null>(null);
  const [minDate, setMinDate] = useState<string>();
  const handledUrl = useRef(false);

  // "Book this" on the same page → prefill the treatment and reopen the form.
  useEffect(() => {
    if (request.nonce === 0) return;
    setSent(null);
    if (request.treatment) setForm((f) => ({ ...f, treatment: request.treatment as string }));
  }, [request]);

  // Arriving from another page via /contact/?treatment=…#book.
  useEffect(() => {
    setMinDate(todayISO());
    if (handledUrl.current) return;
    handledUrl.current = true;
    const t = new URLSearchParams(window.location.search).get("treatment");
    if (t && OPTIONS.includes(t)) setForm((f) => ({ ...f, treatment: t }));
    if (window.location.hash === "#book") requestAnimationFrame(() => scrollToBook());
  }, []);

  const set = <K extends keyof BookingInput>(k: K, v: BookingInput[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: false, ...(k === "date" ? { day: false } : {}) }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const result = buildBooking(form);
    try {
      window.open(result.url, "_blank", "noopener");
    } catch {
      /* popup blocked: the "Open WhatsApp again" button still works */
    }
    setErrors({});
    setSent(result);
  };

  return (
    <section id="book" className="section book">
      <div className="wrap two-col">
        <div className="col">
          <div className="eyebrow" data-reveal>Book an appointment</div>
          <SectionHeading as={headingAs}>Book in three quick steps.</SectionHeading>
          <ol className="steps" data-stagger>
            <li><span className="step-n">1</span><span><span className="step-t">Tell us when suits you</span><span className="step-d">Your name, phone number and a preferred day and time.</span></span></li>
            <li><span className="step-n">2</span><span><span className="step-t">Send it on WhatsApp</span><span className="step-d">Your request opens in WhatsApp, already written. Just tap Send.</span></span></li>
            <li><span className="step-n">3</span><span><span className="step-t">Get your slot confirmed</span><span className="step-d">The clinic replies on WhatsApp to confirm your appointment.</span></span></li>
          </ol>
          <a href={telHref} className="call-link tap">
            <Icon name="phone" />
            <span>Prefer to talk? Call <b>{clinic.phone.display}</b></span>
          </a>
        </div>

        <div className="form-card" data-reveal>
          <form className="form" id="book-form" noValidate onSubmit={submit} hidden={!!sent}>
            <div className="form-row">
              <label className="field">
                <span className="field-label">Your name</span>
                <input
                  className="input" type="text" name="name" autoComplete="name" placeholder="Full name" enterKeyHint="next"
                  value={form.name} onChange={(e) => set("name", e.target.value)}
                  aria-invalid={!!errors.name} aria-describedby={errors.name ? "err-name" : undefined}
                />
                {errors.name && <span className="error" id="err-name">Please enter your name.</span>}
              </label>
              <label className="field">
                <span className="field-label">Mobile number</span>
                <input
                  className="input" type="tel" name="phone" autoComplete="tel-national" inputMode="tel" maxLength={16}
                  placeholder="10-digit number" enterKeyHint="next"
                  value={form.phone} onChange={(e) => set("phone", e.target.value)}
                  aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "err-phone" : undefined}
                />
                {errors.phone && <span className="error" id="err-phone">Enter a 10-digit mobile number.</span>}
              </label>
            </div>

            <label className="field">
              <span className="field-label">What&apos;s it for?</span>
              <span className="select-wrap">
                <select className="input" name="treatment" value={form.treatment} onChange={(e) => set("treatment", e.target.value)}>
                  <option value="">Not sure yet / check-up</option>
                  {OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                <Icon name="chevron" size={18} />
              </span>
            </label>

            <div className="field" role="group" aria-labelledby="lbl-day">
              <span className="field-label" id="lbl-day">Preferred day</span>
              <div className="chips">
                {DAYS.map((d) => (
                  <button key={d.key} type="button" className="chip" aria-pressed={form.day === d.key} onClick={() => set("day", d.key)}>
                    {d.label}
                  </button>
                ))}
              </div>
              {form.day === "other" && (
                <input className="input input-date" type="date" name="date" aria-label="Choose a date" min={minDate} value={form.date} onChange={(e) => set("date", e.target.value)} />
              )}
              {errors.day && <span className="error" role="alert">Choose a day.</span>}
            </div>

            <div className="field" role="group" aria-labelledby="lbl-time">
              <span className="field-label" id="lbl-time">Preferred time</span>
              <div className="chips">
                {(Object.keys(TIMES) as TimeKey[]).map((k) => (
                  <button key={k} type="button" className="chip" aria-pressed={form.time === k} onClick={() => set("time", k)}>
                    {TIMES[k].chip}
                  </button>
                ))}
              </div>
              {errors.time && <span className="error" role="alert">Choose a time.</span>}
            </div>

            <label className="field">
              <span className="field-label">Anything we should know? <i>(optional)</i></span>
              <textarea className="input" name="note" rows={3} placeholder="e.g. sensitive tooth on the left side" value={form.note} onChange={(e) => set("note", e.target.value)} />
            </label>

            <div className="submit-wrap">
              <button type="submit" className="btn btn-primary">
                <Icon name="wa" size={18} strokeWidth={1.7} />
                Send request on WhatsApp
              </button>
              <p className="fine">Opens WhatsApp with your details filled in. Nothing is sent until you tap Send.</p>
              {clinic.whatsapp.toConfirm && <Flag>WhatsApp number: to confirm</Flag>}
            </div>
          </form>

          {sent && (
            <div className="sent" aria-live="polite">
              <span className="sent-icon"><Icon name="check" size={24} strokeWidth={2} /></span>
              <h3>Almost done. Tap Send in WhatsApp.</h3>
              <p>Your request is ready: <b>{sent.summary}</b>. The clinic will reply on WhatsApp to confirm your slot.</p>
              <div className="sent-actions">
                <a href={sent.url} target="_blank" rel="noopener" className="btn btn-primary btn-md">Open WhatsApp again</a>
                <button type="button" className="btn btn-outline btn-md" onClick={() => setSent(null)}>Edit request</button>
              </div>
              <a href={telHref} className="tel tap">WhatsApp not opening? Call {clinic.phone.display}</a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
