import { clinic } from "@/lib/clinic";
import { Icon } from "@/components/ui/Icon";
import { Flag, ImageSlot, PlaceholderNote } from "@/components/ui/bits";
import { BookButton } from "@/components/booking/BookButton";

export function Doctor({ headingAs = "h2" }: { headingAs?: "h1" | "h2" }) {
  const Name = headingAs;
  const d = clinic.doctor;
  return (
    <section id="doctor" className="section dark doctor">
      <div className="wrap two-col">
        <div className="portrait" data-reveal>
          <ImageSlot caption="Portrait of Dr. K. Sunitha · vertical, mask off" />
        </div>
        <div className="col">
          <div className="eyebrow" data-reveal>Meet your dentist</div>
          <div className="doc-name" data-reveal>
            <Name>{d.name}</Name>
            <p>{d.credentials} · {d.title}</p>
          </div>
          <PlaceholderNote label="Placeholder · in her words">{clinic.pending.doctorQuote}</PlaceholderNote>
          <dl className="facts" style={{ margin: 0 }} data-reveal>
            <div className="fact">
              <dt>Qualification</dt>
              <dd>{d.credentials} <span className="pill-needed">{clinic.pending.qualification}</span></dd>
            </div>
            <div className="fact">
              <dt>Registration</dt>
              <dd><span className="pill-needed">{clinic.pending.registration}</span></dd>
            </div>
            <div className="fact">
              <dt>Languages</dt>
              <dd>{d.languages} {d.languagesToConfirm && <Flag>To confirm</Flag>}</dd>
            </div>
          </dl>
          <BookButton className="btn btn-primary self-start">
            Book with Dr. Sunitha <Icon name="arrow" />
          </BookButton>
        </div>
      </div>
    </section>
  );
}
