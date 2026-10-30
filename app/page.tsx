import { pageMetadata } from "@/lib/seo";
import { Hero } from "@/components/sections/Hero";
import { Treatments } from "@/components/sections/Treatments";
import { Doctor } from "@/components/sections/Doctor";
import { Kids } from "@/components/sections/Kids";
import { Reviews } from "@/components/sections/Reviews";
import { Booking } from "@/components/sections/Booking";
import { Clinic } from "@/components/sections/Clinic";
import { Faq } from "@/components/sections/Faq";
import { Visit } from "@/components/sections/Visit";

export const metadata = pageMetadata({ path: "/" });

export default function Home() {
  return (
    <>
      <Hero />
      <Treatments />
      <Doctor />
      <Kids />
      <Reviews />
      <Booking />
      <Clinic />
      <Faq />
      <Visit />
    </>
  );
}
