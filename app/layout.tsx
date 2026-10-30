import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import { clinic } from "@/lib/clinic";
import { dentistJsonLd, pageMetadata } from "@/lib/seo";
import { IconSprite } from "@/components/ui/Icon";
import { AnnouncementBar, Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCallBar } from "@/components/layout/MobileCallBar";
import { BookingProvider } from "@/components/booking/BookingProvider";
import { Motion } from "@/components/motion/Motion";

const interTight = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap", variable: "--font-inter-tight" });

export const metadata: Metadata = {
  metadataBase: new URL(clinic.siteUrl),
  applicationName: clinic.name,
  icons: { icon: "/images/favicon.png", apple: "/images/apple-touch-icon.png" },
  formatDetection: { telephone: false },
  ...pageMetadata({ path: "/" }),
};

export const viewport: Viewport = { themeColor: "#244d54", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={interTight.variable}>
      {/* Remove "show-flags" to hide the yellow "to confirm" review notes before going live. */}
      <body className="show-flags">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dentistJsonLd()) }} />
        <IconSprite />
        <BookingProvider>
          <AnnouncementBar />
          <Header />
          <Motion>
            <main>{children}</main>
          </Motion>
          <Footer />
          <MobileCallBar />
        </BookingProvider>
      </body>
    </html>
  );
}
