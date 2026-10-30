import { clinic, fmtTime, waHref } from "@/lib/clinic";
import { Icon, Stars } from "@/components/ui/Icon";
import { Flag } from "@/components/ui/bits";
import { BookButton } from "@/components/booking/BookButton";
import { HeroImage } from "./HeroImage";

const headline = (
  <>
    Trusted dental care for the whole family, <em>close to home.</em>
  </>
);
const lede = `${clinic.doctor.name}, ${clinic.doctor.credentials}, ${clinic.doctor.title}, looks after kids, parents and working professionals, with appointments until ${fmtTime(clinic.hours.week.close)}.`;
const closeHour = fmtTime(clinic.hours.week.close).split(" "); // ["9", "PM"]
const photoAlt = `Waiting area at ${clinic.name}`;

/** Hero: wide (≥900px) and mobile layouts, toggled by CSS so there's no flash before hydration. */
export function Hero() {
  return (
    <>
      <section className="hero only-wide" data-hero-root>
        <div className="hero-card">
          <div className="hero-copy">
            <div className="hero-top">
              <div className="eyebrow" data-hero="eyebrow">Family dental clinic · Beeramguda</div>
              <h1 data-hero="title">{headline}</h1>
              <p className="hero-lede" data-hero="lede">{lede}</p>
              <div className="hero-ctas" data-hero="ctas">
                <BookButton className="btn btn-primary">
                  Book Appointment <Icon name="arrow" />
                </BookButton>
                <a href={waHref()} target="_blank" rel="noopener" className="btn btn-outline-light">
                  <Icon name="wa" size={18} strokeWidth={1.7} />
                  WhatsApp us
                </a>
              </div>
            </div>
            <div className="stats" data-hero="stats">
              <div className="stat">
                <span className="stat-label">Google rating</span>
                <span className="stat-num" data-count={clinic.rating.value}>{clinic.rating.value}</span>
                <Stars width={80} height={14} />
              </div>
              <a className="stat" href={clinic.maps.place} target="_blank" rel="noopener">
                <span className="stat-label">Google reviews</span>
                <span className="stat-num" data-count={clinic.rating.count}>{clinic.rating.count}</span>
                <span className="stat-sub">Read reviews <Icon name="arrow" size={14} /></span>
              </a>
              <div className="stat">
                <span className="stat-label">Open until</span>
                <span className="stat-num">{closeHour[0]}<small>{closeHour[1]}</small></span>
                <span className="stat-sub">{clinic.hours.week.short}, from {fmtTime(clinic.hours.week.open)}</span>
              </div>
            </div>
          </div>
          <div className="hero-photo">
            <div className="slot" data-hero="photo">
              <HeroImage variant="wide" alt={photoAlt} />
            </div>
            <div className="fade" />
            <a className="addr-chip" href={clinic.maps.directions} target="_blank" rel="noopener">
              <Icon name="pin" strokeWidth={1.7} />
              {clinic.address.short} <Icon name="arrow" size={14} />
            </a>
            <Flag className="photo-flag">{clinic.pending.heroPhotoFlag}</Flag>
          </div>
        </div>
      </section>

      <section className="hero-m only-narrow" data-hero-root>
        <div className="hero-m-photo">
          <div className="slot" data-hero="photo">
            <HeroImage variant="narrow" alt={photoAlt} />
          </div>
          <div className="fade" />
          <Flag className="photo-flag">{clinic.pending.heroPhotoFlag}</Flag>
        </div>
        <div className="hero-m-copy">
          <div className="eyebrow" data-hero="eyebrow">Family dental clinic · Beeramguda</div>
          <h1 data-hero="title">{headline}</h1>
          <p className="hero-m-lede" data-hero="lede">{lede}</p>
          <div data-hero="ctas" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <BookButton className="btn btn-primary">
              Book Appointment <Icon name="arrow" />
            </BookButton>
            <a className="hero-m-dir tap" href={clinic.maps.directions} target="_blank" rel="noopener">
              <Icon name="pin" strokeWidth={1.7} style={{ stroke: "#6dddbd" }} />
              <span>{clinic.address.short} · <b>Directions</b></span>
            </a>
          </div>
        </div>
        <div className="stats-m" data-hero="stats">
          <div>
            <span className="stat-num" data-count={clinic.rating.value}>{clinic.rating.value}</span>
            <span className="stat-label">Google rating</span>
          </div>
          <a href={clinic.maps.place} target="_blank" rel="noopener">
            <span className="stat-num" data-count={clinic.rating.count}>{clinic.rating.count}</span>
            <span className="stat-label">Reviews</span>
          </a>
          <div>
            <span className="stat-num">{closeHour[0]}<small>{closeHour[1]}</small></span>
            <span className="stat-label">Open until</span>
          </div>
        </div>
      </section>
    </>
  );
}
