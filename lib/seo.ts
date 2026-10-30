import type { Metadata } from "next";
import { clinic } from "./clinic";

export const defaultDescription = `${clinic.doctor.name}, ${clinic.doctor.credentials}, ${clinic.doctor.title}. Family dental clinic at Mallikarjuna Shopping Complex, Beeramguda, Hyderabad. Open till 9 PM. Book on WhatsApp or call ${clinic.phone.display}.`;

/** Per-page metadata with canonical URL and Open Graph / Twitter cards. */
export function pageMetadata({ title, description = defaultDescription, path }: { title?: string; description?: string; path: string }): Metadata {
  const fullTitle = title ? `${title} · ${clinic.name}` : `${clinic.name} · Family Dentist in Beeramguda, Hyderabad`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: clinic.name,
      url: path,
      title: fullTitle,
      description,
      images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: `Waiting area at ${clinic.name}` }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: ["/images/og.jpg"] },
  };
}

/** schema.org Dentist, built from lib/clinic.ts. Unconfirmed hours (Sunday) are left out on purpose. */
export function dentistJsonLd() {
  const { week, sunday } = clinic.hours;
  const hours = [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: week.open, closes: week.close },
  ];
  if (!sunday.toConfirm) hours.push({ "@type": "OpeningHoursSpecification", dayOfWeek: ["Sunday"], opens: sunday.open, closes: sunday.close });
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": `${clinic.siteUrl}/#clinic`,
    name: clinic.name,
    url: clinic.siteUrl,
    image: `${clinic.siteUrl}/images/og.jpg`,
    logo: `${clinic.siteUrl}/images/logo.png`,
    telephone: clinic.phone.tel,
    address: {
      "@type": "PostalAddress",
      streetAddress: clinic.address.street,
      addressLocality: clinic.address.city,
      postalCode: clinic.address.postalCode,
      addressCountry: clinic.address.country,
    },
    hasMap: clinic.maps.place,
    openingHoursSpecification: hours,
    employee: { "@type": "Person", name: clinic.doctor.name, jobTitle: `${clinic.doctor.credentials}, ${clinic.doctor.title}` },
    sameAs: [clinic.links.justdial, clinic.links.practo],
  };
}
