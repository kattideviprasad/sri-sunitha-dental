import type { MetadataRoute } from "next";
import { clinic } from "@/lib/clinic";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { path: "/", priority: 1 },
    { path: "/treatments/", priority: 0.8 },
    { path: "/about/", priority: 0.7 },
    { path: "/contact/", priority: 0.9 },
  ].map(({ path, priority }) => ({ url: clinic.siteUrl + path, changeFrequency: "monthly", priority }));
}
