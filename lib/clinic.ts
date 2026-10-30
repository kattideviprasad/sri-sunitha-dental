// Single source of truth for every clinic fact on the site.
// Edit a value here and every page, the JSON-LD schema and the sitemap update with it.
// `toConfirm: true` renders a yellow "to confirm" review flag (while flags are on).

export type Hours = { days: string; short: string; open: string; close: string; toConfirm?: boolean };

/** Format "21:00" → "9 PM", "10:00" → "10 AM"; long form → "9:00 PM". */
export function fmtTime(hhmm: string, long = false): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return long ? `${h12}:${String(m).padStart(2, "0")} ${suffix}` : `${h12}${m ? ":" + String(m).padStart(2, "0") : ""} ${suffix}`;
}

export const clinic = {
  /** Live domain — to confirm. Used for canonical URLs, Open Graph and the sitemap. */
  siteUrl: "https://sri-sunitha-dental.vercel.app",
  siteUrlToConfirm: true,

  name: "Sri Sunitha Dental Clinic",
  shortName: "Sunitha Dental Clinic",
  locality: "Beeramguda · Hyderabad",
  doctor: {
    name: "Dr. K. Sunitha",
    credentials: "BDS",
    title: "Cosmetic Dental Surgeon",
    languages: "Telugu, Hindi, English",
    languagesToConfirm: true,
  },

  phone: { display: "080191 11888", tel: "+918019111888" },
  whatsapp: { number: "918019111888", toConfirm: true },

  address: {
    lines: ["1st Floor, Mallikarjuna Shopping Complex", "Mallikarjuna Nagar, Mayuri Nagar", "Beeramguda, Hyderabad 502032"],
    short: "1st Floor, Mallikarjuna Shopping Complex",
    area: "Mallikarjuna Nagar, Beeramguda",
    street: "1st Floor, Mallikarjuna Shopping Complex, Mallikarjuna Nagar, Mayuri Nagar",
    city: "Beeramguda, Hyderabad",
    postalCode: "502032",
    country: "IN",
  },

  maps: {
    placeId: "ChIJeY5sMhONyzsRvSpSSKebyHU",
    place: "https://www.google.com/maps/place/?q=place_id:ChIJeY5sMhONyzsRvSpSSKebyHU",
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=Sri%20Sunitha%20Dental%20Clinic%2C%20Beeramguda&destination_place_id=ChIJeY5sMhONyzsRvSpSSKebyHU",
    embed:
      "https://maps.google.com/maps?q=Sri%20Sunitha%20Dental%20Clinic%2C%20Mallikarjuna%20Shopping%20Complex%2C%20Beeramguda%2C%20Hyderabad%20502032&z=16&output=embed",
  },

  /** The one hours value. Top bar, hero stat, kids card, FAQ, Visit table, footer and JSON-LD all read this. */
  hours: {
    week: { days: "Monday – Saturday", short: "Mon–Sat", open: "10:00", close: "21:00" } as Hours,
    sunday: { days: "Sunday", short: "Sun", open: "10:00", close: "21:00", toConfirm: true } as Hours,
    breakToConfirm: true,
  },

  rating: { value: "5.0", count: "600+", countNumber: 600 },

  links: {
    justdial: "https://www.justdial.com/Hyderabad/Sri-Sunitha-Dental-Clinic-Beeramguda/040PXX40-XX40-230305143741-H8H7_BZDET",
    practo: "https://www.practo.com/hyderabad/clinic/sri-sunitha-dental-clinic-beeramguda",
  },

  kids: { minAge: "From 3 years", minAgeToConfirm: true },

  parking: "Free street and complex parking, including a wheelchair-accessible car park.",

  treatments: [
    { title: "Check-up & cleaning", text: "A full look at your teeth and gums, with scaling and polishing to clear tartar." },
    { title: "Fillings", text: "Repairs cavities and small chips, so the tooth stays strong." },
    { title: "Root canal treatment", text: "Treats infection inside a tooth to ease the pain and save the tooth." },
    { title: "Crowns & bridges", text: "A crown protects a weak tooth. A bridge fills the gap left by a missing one." },
    { title: "Extractions & wisdom teeth", text: "Removal of badly damaged teeth and painful or impacted wisdom teeth." },
    { title: "Veneers & smile makeover", text: "Cosmetic work to improve the shape, colour and line of your smile." },
    { title: "Kids dentistry", text: "Check-ups and care for children, from their very first visit." },
  ],
  /** Extra option only offered in the booking form. */
  formExtraOption: "Toothache / pain",

  reviews: [
    {
      quote:
        "The service at Dr. Sunitha's clinic was outstanding! I experienced no pain during treatment, and the team ensured my comfort throughout. I highly recommend this clinic for the best dental treatment in Beeramguda.",
      author: "Verified Patient",
    },
    { quote: "I had an impaction treatment and I must say Dr. Sunitha is an excellent dentist. The treatment was smooth and pain-free.", author: "allu sowjanya" },
    { quote: "Good dental clinic. Got relief after treatment here. Doctor explains everything in detail and in the simplest possible way.", author: "Mr rider NS" },
  ],

  /** Placeholders still waiting on the clinic. Rendered as yellow notes; never invent these. */
  pending: {
    doctorQuote: "A short line from Dr. Sunitha about how she cares for her patients.",
    qualification: "College & year needed",
    registration: "Dental council reg. no. needed",
    hygiene: "How instruments are cleaned and sterilised between patients, in the clinic's own words.",
    toothacheAnswer: "Answer needed from the clinic on same-day visits for pain.",
    sameDayFlag: "Same-day visits: to confirm",
    heroPhotoFlag: "Interim photo · swap for Dr. Sunitha at work",
    treatmentRoomFlag: "Patient in shot (face hidden): OK to publish?",
  },
} as const;

export const telHref = `tel:${clinic.phone.tel}`;
export const waHref = (text = `Hello ${clinic.name}, `) => `https://wa.me/${clinic.whatsapp.number}?text=${encodeURIComponent(text)}`;

const { week, sunday } = clinic.hours;
/** "Open Monday to Saturday, 10 AM – 9 PM" (top bar) */
export const openLine = `Open ${week.days.replace(" – ", " to ")}, ${fmtTime(week.open)} – ${fmtTime(week.close)}`;
/** "Mon–Sat, 10 AM – 9 PM" */
export const hoursShort = `${week.short}, ${fmtTime(week.open)} – ${fmtTime(week.close)}`;

export type Faq = { q: string; a: string; flag?: string; pending?: string };

export const faqs: Faq[] = [
  { q: "Do I need an appointment?", a: "Booking ahead is recommended. Walk-ins are seen when a slot is free.", flag: "To confirm" },
  {
    q: "What are your timings?",
    a: `${week.days.replace(" – ", " to ")}, ${fmtTime(week.open)} to ${fmtTime(week.close)}. ${sunday.days}, ${fmtTime(sunday.open)} to ${fmtTime(sunday.close)}.`,
    flag: sunday.toConfirm ? "Sunday & any afternoon break: to confirm" : undefined,
  },
  { q: "Can I come in today with a toothache?", a: `Please call ${clinic.phone.display} before you set out.`, pending: clinic.pending.toothacheAnswer },
  { q: "Do you see children?", a: "Yes. Children are seen from 3 years of age.", flag: "Exact minimum age: to confirm" },
  { q: "How can I pay?", a: "UPI, cash and debit cards.", flag: "Credit cards: to confirm" },
  { q: "Is there parking?", a: `Yes. There's ${clinic.parking.charAt(0).toLowerCase()}${clinic.parking.slice(1)}` },
  { q: "Which languages does Dr. Sunitha speak?", a: "Telugu, Hindi and English.", flag: "To confirm" },
];
