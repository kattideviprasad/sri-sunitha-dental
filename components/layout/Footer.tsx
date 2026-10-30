import Image from "next/image";
import { clinic, hoursShort, telHref } from "@/lib/clinic";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <Image src="/images/logo.webp" alt="Sunitha Dental Clinic logo" width={72} height={72} />
            <div>
              <b>{clinic.name}</b>
              <span>{clinic.doctor.name}, {clinic.doctor.credentials}, {clinic.doctor.title}</span>
            </div>
          </div>
          <div className="foot-cols">
            <div className="foot-col">
              <span className="mini-label">Visit</span>
              <span>
                {clinic.address.lines.map((l, i) => (
                  <span key={l}>{i > 0 && <br />}{l}</span>
                ))}
              </span>
            </div>
            <div className="foot-col">
              <span className="mini-label">Contact</span>
              <a href={telHref}>{clinic.phone.display}</a>
              <a href={`https://wa.me/${clinic.whatsapp.number}`} target="_blank" rel="noopener">WhatsApp</a>
              <span className="muted">{hoursShort}</span>
            </div>
            <div className="foot-col">
              <span className="mini-label">Find us on</span>
              <a href={clinic.maps.place} target="_blank" rel="noopener">Google Maps</a>
              <a href={clinic.links.justdial} target="_blank" rel="noopener">Justdial</a>
              <a href={clinic.links.practo} target="_blank" rel="noopener">Practo</a>
            </div>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 {clinic.name}, Beeramguda, Hyderabad</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
