import Image from "next/image";
import { clinic, fmtTime, telHref, waHref, type Hours } from "@/lib/clinic";
import { Icon } from "@/components/ui/Icon";
import { Flag } from "@/components/ui/bits";

function HoursRow({ h }: { h: Hours }) {
  return (
    <div className="hours-row">
      <span>{h.days} {h.toConfirm && <Flag>To confirm</Flag>}</span>
      <span>{fmtTime(h.open, true)} – {fmtTime(h.close, true)}</span>
    </div>
  );
}

export function Visit() {
  return (
    <section id="visit" className="section dark visit">
      <div className="wrap two-col">
        <div className="col">
          <div className="head-stack">
            <div className="eyebrow" data-reveal>Visit us</div>
            <h2 className="h2" data-reveal>Find us in {clinic.address.area}.</h2>
          </div>
          <address data-reveal>
            {clinic.name}
            {clinic.address.lines.map((l) => (
              <span key={l}><br />{l}</span>
            ))}
          </address>
          <div className="hours" data-reveal>
            <HoursRow h={clinic.hours.week} />
            <HoursRow h={clinic.hours.sunday} />
            {clinic.hours.breakToConfirm && (
              <div className="flag-row flag-only"><Flag>Afternoon break, if any: to confirm</Flag></div>
            )}
          </div>
          <p className="note" data-reveal>{clinic.parking}</p>
          <div className="btn-row" data-reveal>
            <a href={telHref} className="btn btn-primary btn-md">
              <Icon name="phone" />
              Call {clinic.phone.display}
            </a>
            <a href={waHref()} target="_blank" rel="noopener" className="btn btn-outline-light btn-md">
              <Icon name="wa" size={17} strokeWidth={1.7} />
              WhatsApp
            </a>
            <a href={clinic.maps.directions} target="_blank" rel="noopener" className="btn btn-outline-light btn-md">
              <Icon name="pin" size={17} strokeWidth={1.7} />
              Directions
            </a>
          </div>
        </div>
        <div className="map-col" data-reveal>
          <div className="map">
            <iframe title={`Map: ${clinic.name}, Beeramguda`} src={clinic.maps.embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <div className="sign">
            <div className="sign-img" style={{ position: "relative" }}>
              <Image src="/images/signboard.webp" alt="The lit Sunitha Dental Clinic signboard at night" fill sizes="150px" />
            </div>
            <div className="sign-text">
              <span className="kicker">Look for this sign</span>
              <span>The &quot;{clinic.shortName}&quot; board at Mallikarjuna Shopping Complex.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
