/* Site footer (spec §12), continuous pine-900 with the CTA section above it,
   shared by every redesigned page. The legacy <Footer /> stays untouched
   for the not-yet-migrated pages. */

import Link from "next/link";
import { Check } from "lucide-react";
import { HomeContainer, TentMark } from "./primitives";

const COLS: {
  title: string;
  links: { label: string; href?: string }[];
}[] = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "Start free", href: "/signup" },
      { label: "Log in", href: "/login" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy & GDPR", href: "/privacy" },
      { label: "Refunds", href: "/refunds" },
      { label: "Subscription", href: "/subscription-policy" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "hello@pakkia.fi", href: "mailto:hello@pakkia.fi" },
      { label: "Mon–Fri · 9–17 EET" },
      { label: "Finland · EU" },
    ],
  },
];

const TRUST = ["EU-hosted", "GDPR-compliant", "Statistics Finland ready"];

export default function SiteFooter() {
  return (
    <footer className="border-t border-line-dark bg-pine-900 py-16">
      <HomeContainer>
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 font-familjen text-[1.25rem] font-bold tracking-[-0.02em] text-cream">
              <TentMark className="text-cream-muted" />
              Pakkia
            </div>
            <p className="mt-4 max-w-[30ch] text-[0.9375rem] leading-[1.65] text-cream-muted">
              Overnight-stay reporting for Finnish campsites. Compliance-ready,
              EU-hosted, refreshingly simple.
            </p>
            <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1.5 font-spline text-[12px] font-medium text-cream-muted">
              {TRUST.map((t, i) => (
                <span key={t} className="inline-flex items-center gap-x-2">
                  {i > 0 && (
                    <span className="mr-2" aria-hidden>
                      ·
                    </span>
                  )}
                  <Check size={12} strokeWidth={2.5} aria-hidden />
                  {t}
                </span>
              ))}
            </p>
          </div>

          {COLS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="font-spline text-[11px] font-medium uppercase tracking-[0.12em] text-cream-muted">
                {col.title}
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <Link
                        href={link.href}
                        className="tap-target inline-block text-[0.9375rem] text-cream transition-colors duration-200 hover:text-amber-500"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <span className="text-[0.9375rem] text-cream">
                        {link.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-line-dark pt-6 font-spline text-[12px] font-medium">
          <span className="text-cream-muted tabular-nums">
            © 2026 Pakkia · pakkia.fi
          </span>
          <span className="flex items-center gap-6">
            <a
              href="https://growthnexus.fi"
              className="tap-target inline-block text-cream-muted transition-colors duration-200 hover:text-cream"
            >
              Powered by Growth Nexus
            </a>
            <span className="italic text-amber-500" lang="fi">
              Tehty Suomea varten
            </span>
          </span>
        </div>
      </HomeContainer>
    </footer>
  );
}
