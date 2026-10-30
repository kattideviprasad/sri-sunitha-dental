import { pageMetadata } from "@/lib/seo";
import { Treatments } from "@/components/sections/Treatments";
import { Booking } from "@/components/sections/Booking";

export const metadata = pageMetadata({
  title: "Treatments",
  description:
    "From routine check-ups to smile makeovers: check-up & cleaning, fillings, root canal treatment, crowns & bridges, extractions & wisdom teeth, veneers and kids dentistry in Beeramguda, Hyderabad.",
  path: "/treatments/",
});

export default function TreatmentsPage() {
  return (
    <>
      <Treatments headingAs="h1" />
      <Booking />
    </>
  );
}
