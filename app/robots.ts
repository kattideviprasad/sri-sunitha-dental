import type { MetadataRoute } from "next";
import { clinic } from "@/lib/clinic";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${clinic.siteUrl}/sitemap.xml` };
}
