"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { clinic, openLine, telHref } from "@/lib/clinic";
import { Icon } from "@/components/ui/Icon";
import { BookButton } from "@/components/booking/BookButton";

const mainNav = [
  { href: "/treatments/", label: "Treatments" },
  { href: "/about/", label: "Dr. Sunitha" },
  { href: "/#kids", label: "Kids" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/contact/", label: "Visit us" },
];

const mobileNav = [
  { href: "/treatments/", label: "Treatments" },
  { href: "/about/", label: "Dr. Sunitha" },
  { href: "/#kids", label: "Kids dentistry" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/contact/#faq", label: "FAQ" },
  { href: "/contact/", label: "Visit us" },
];

export function AnnouncementBar() {
  return (
    <div id="top" className="announce">
      <div className="wrap">
        <span className="open">{openLine}</span>
        <a href={telHref} className="tap">
          <Icon name="phone" size={15} />
          Call {clinic.phone.display}
        </a>
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change and when the viewport grows past the mobile breakpoint.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const onChange = (e: MediaQueryListEvent) => e.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link href="/" className="brand" onClick={close}>
          <Image src="/images/logo-96.webp" alt="Sunitha Dental Clinic logo" width={48} height={48} loading="eager" />
          <span className="brand-text">
            <span className="brand-name">{clinic.name}</span>
            <span className="brand-loc">{clinic.locality}</span>
          </span>
        </Link>
        <span className="spacer" />
        <nav className="main-nav only-wide" aria-label="Main">
          {mainNav.map((l) => (
            <Link key={l.href} href={l.href} className="tap">{l.label}</Link>
          ))}
        </nav>
        <BookButton className="btn btn-primary header-cta only-wide">Book Appointment</BookButton>
        <BookButton className="btn btn-primary header-book only-narrow" onBook={close}>Book</BookButton>
        <button
          type="button"
          className="menu-btn only-narrow"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>
      <nav id="mobile-nav" className="mobile-nav only-narrow" aria-label="Mobile" hidden={!open}>
        {mobileNav.map((l) => (
          <Link key={l.href} href={l.href} onClick={close}>{l.label}</Link>
        ))}
      </nav>
    </header>
  );
}
