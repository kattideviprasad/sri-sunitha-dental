import Image from "next/image";
import { clinic } from "@/lib/clinic";
import { Flag, ImageSlot, PlaceholderNote } from "@/components/ui/bits";

export function Clinic() {
  return (
    <section id="clinic" className="section dark clinic">
      <div className="wrap stack-lg">
        <div className="head-split">
          <div className="head-stack">
            <div className="eyebrow" data-reveal>Inside the clinic</div>
            <h2 className="h2" data-reveal>Take a look inside before you visit.</h2>
          </div>
          <div className="hygiene" data-reveal>
            <div className="kicker">Hygiene &amp; sterilisation</div>
            <PlaceholderNote label="Placeholder · details from the clinic">{clinic.pending.hygiene}</PlaceholderNote>
          </div>
        </div>
        <div className="gallery" data-stagger>
          <figure>
            <div className="frame">
              <Image src="/images/reception.webp" alt={`Reception desk and entrance at ${clinic.name}`} fill sizes="(min-width: 1240px) 390px, (min-width: 600px) 33vw, 100vw" />
            </div>
            <figcaption>Reception</figcaption>
          </figure>
          <figure>
            <div className="frame">
              <Image src="/images/treatment-room.webp" alt="Treatment room with the teal dental chair" fill sizes="(min-width: 1240px) 390px, (min-width: 600px) 33vw, 100vw" />
              <Flag>{clinic.pending.treatmentRoomFlag}</Flag>
            </div>
            <figcaption>Treatment room</figcaption>
          </figure>
          <figure>
            <div className="frame">
              <ImageSlot caption="Photo: sterilisation area" />
            </div>
            <figcaption>Sterilisation area</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
