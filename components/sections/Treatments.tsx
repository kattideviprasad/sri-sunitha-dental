import { clinic, telHref } from "@/lib/clinic";
import { Icon } from "@/components/ui/Icon";
import { Flag, SectionHeading } from "@/components/ui/bits";
import { BookButton } from "@/components/booking/BookButton";

export function Treatments({ headingAs = "h2" }: { headingAs?: "h1" | "h2" }) {
  return (
    <section id="treatments" className="section">
      <div className="wrap stack-lg">
        <div className="head-split treat-head">
          <div className="head-stack">
            <div className="eyebrow" data-reveal>Treatments</div>
            <SectionHeading as={headingAs}>From routine check-ups to smile makeovers.</SectionHeading>
          </div>
          <p className="lede" data-reveal>Not sure what you need? Start with a check-up, and Dr. Sunitha will talk you through your options.</p>
        </div>

        <div className="cards" data-stagger>
          {clinic.treatments.map((t, i) => (
            <div className="card" key={t.title}>
              <div className="card-num">{String(i + 1).padStart(2, "0")}</div>
              <h3>{t.title}</h3>
              <p>{t.text}</p>
              <BookButton treatment={t.title} className="book-this">
                Book this <span className="circle tap"><Icon name="arrow" size={14} /></span>
              </BookButton>
            </div>
          ))}
          <div className="card card-dark">
            <div className="kicker">Toothache?</div>
            <h3>In pain right now?</h3>
            <p>Call before you set out and tell us what&apos;s wrong.</p>
            <Flag>{clinic.pending.sameDayFlag}</Flag>
            <a href={telHref} className="btn btn-primary btn-xs">
              <Icon name="phone" size={15} />
              Call {clinic.phone.display}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
