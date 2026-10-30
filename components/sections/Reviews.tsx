import { clinic } from "@/lib/clinic";
import { Icon, Stars } from "@/components/ui/Icon";

export function Reviews() {
  return (
    <section id="reviews" className="section dark">
      <div className="wrap stack-lg">
        <div className="reviews-head">
          <div className="head-stack">
            <div className="eyebrow" data-reveal>Google reviews</div>
            <h2 className="h2" data-reveal>In our patients&apos; own words.</h2>
          </div>
          <div className="rating-box" data-reveal>
            <div className="rating-line">
              <Stars width={100} height={18} />
              <span><b>{clinic.rating.value}</b> from {clinic.rating.count} reviews</span>
            </div>
            <a href={clinic.maps.place} target="_blank" rel="noopener" className="btn btn-outline-light btn-sm">
              Read all reviews on Google <Icon name="arrow" />
            </a>
          </div>
        </div>

        <div className="review-grid" data-stagger>
          {clinic.reviews.map((r) => (
            <figure className="review" key={r.author}>
              <Stars width={90} height={16} />
              <blockquote>&quot;{r.quote}&quot;</blockquote>
              <figcaption><b>{r.author}</b><span>Google review</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
