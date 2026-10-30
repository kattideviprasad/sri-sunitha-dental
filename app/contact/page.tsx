import { pageMetadata } from "@/lib/seo";
import { clinic } from "@/lib/clinic";
import { Booking } from "@/components/sections/Booking";
import { Visit } from "@/components/sections/Visit";
import { Faq } from "@/components/sections/Faq";

export const metadata = pageMetadata({
  title: "Book & visit",
  description: `Book in three quick steps on WhatsApp, or call ${clinic.phone.display}. Find us at ${clinic.address.short}, ${clinic.address.area}, Hyderabad.`,
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <>
      <Booking headingAs="h1" />
      <Visit />
      <Faq />
    </>
  );
}
