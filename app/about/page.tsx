import { pageMetadata } from "@/lib/seo";
import { Doctor } from "@/components/sections/Doctor";
import { Clinic } from "@/components/sections/Clinic";
import { Reviews } from "@/components/sections/Reviews";

export const metadata = pageMetadata({
  title: "Dr. K. Sunitha",
  description:
    "Meet Dr. K. Sunitha, BDS, Cosmetic Dental Surgeon, and take a look inside Sri Sunitha Dental Clinic in Beeramguda, Hyderabad before you visit.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <>
      <Doctor headingAs="h1" />
      <Clinic />
      <Reviews />
    </>
  );
}
