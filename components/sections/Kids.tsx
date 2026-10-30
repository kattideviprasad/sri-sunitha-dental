import { clinic, fmtTime } from "@/lib/clinic";
import { Icon } from "@/components/ui/Icon";
import { Flag, ImageSlot, SectionHeading } from "@/components/ui/bits";
import { BookButton } from "@/components/booking/BookButton";

export function Kids() {
  const close = fmtTime(clinic.hours.week.close);
  return (
    <section id="kids" className="section kids">
      <div className="wrap two-col">
        <div className="col">
          <div className="eyebrow" data-reveal>Kids dentistry</div>
          <SectionHeading>Healthy habits start with an easy first visit.</SectionHeading>
          <p className="lede" data-reveal>Bring your child in for a check-up before anything hurts. Evening appointments until {close} fit around school and tuition.</p>
          <div className="mini-cards" data-stagger>
            <div className="mini">
              <span className="mini-label">Age</span>
              <span className="mini-value">{clinic.kids.minAge}</span>
              {clinic.kids.minAgeToConfirm && <Flag>Exact age: to confirm</Flag>}
            </div>
            <div className="mini">
              <span className="mini-label">Timings</span>
              <span className="mini-value">Until {close}, {clinic.hours.week.short}</span>
            </div>
          </div>
          <BookButton treatment="Kids dentistry" className="btn btn-primary self-start">
            Book a visit for my child <Icon name="arrow" />
          </BookButton>
        </div>
        <div className="kids-photo" data-reveal>
          <ImageSlot caption="Kids photo · kids' corner or chair set for a child. No faces without a parent's consent." />
        </div>
      </div>
    </section>
  );
}
