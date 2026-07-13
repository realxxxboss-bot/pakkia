import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

const COLS = [
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
      { label: "Mon–Fri · 9–17 EET", href: "#" },
      { label: "Finland · EU", href: "#" },
    ],
  },
];

const BADGES = ["EU-hosted", "GDPR-compliant", "Statistics Finland ready"];

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-dark text-white/70">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber/40 to-transparent"
        aria-hidden
      />
      <div className="mx-auto max-w-[1200px] px-5 pt-16 pb-9 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-10 border-b border-white/10 pb-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center gap-2.5 font-heading text-[19px] font-semibold tracking-[-0.02em] text-white">
              <BrandMark />
              Pakkia
            </div>
            <p className="max-w-[34ch] text-[14.5px] leading-[1.6] text-white/55">
              Overnight-stay reporting for Finnish campsites. Compliance-ready,
              EU-hosted, refreshingly simple.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {BADGES.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[11.5px] font-medium text-white/70"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                  {b}
                </span>
              ))}
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h2 className="mb-4 font-eyebrow text-[11px] font-semibold tracking-[0.14em] text-white/45 uppercase">
                {col.title}
              </h2>
              <div className="flex flex-col gap-0.5">
                {col.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="-mx-1 rounded-md px-1 py-[5px] text-[15px] text-white/75 transition-colors duration-150 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3.5 pt-8">
          <div className="text-[13.5px] text-white/55">
            Powered by{" "}
            <b className="font-semibold text-white/85">Growth Nexus</b>
          </div>
          <div className="font-mono text-[12px] tracking-[0.02em] text-white/40">
            © 2026 Pakkia · pakkia.fi · Tehty Suomea varten
          </div>
        </div>
      </div>
    </footer>
  );
}
