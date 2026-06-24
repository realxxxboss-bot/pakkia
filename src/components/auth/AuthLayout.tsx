import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

/* Split-screen auth shell: form column + deep-green branded panel.
   The panel is decorative and hidden below lg; the form is always primary. */

const PANEL_POINTS = [
  "Data hosted in the EU, never leaves the bloc",
  "Statistics Finland reporting format, built in",
  "A full audit trail on every entry and edit",
];

export default function AuthLayout({
  eyebrow,
  title,
  subtitle,
  children,
  altPrompt,
  altLabel,
  altHref,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  altPrompt: string;
  altLabel: string;
  altHref: string;
}) {
  return (
    <div className="min-h-[100dvh] bg-bg lg:grid lg:grid-cols-[1fr_minmax(440px,46%)]">
      {/* ---------- form column ---------- */}
      <div className="flex min-h-[100dvh] flex-col px-6 py-7 sm:px-10 lg:min-h-0 lg:px-14 xl:px-20">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            aria-label="Pakkia home"
            className="flex items-center gap-2.5 font-heading text-[19px] font-semibold tracking-[-0.02em] text-ink"
          >
            <BrandMark />
            Pakkia
          </Link>
          <Link
            href={altHref}
            className="text-[14px] font-medium text-secondary transition-colors duration-150 hover:text-ink"
          >
            {altPrompt}{" "}
            <span className="font-semibold text-primary">{altLabel}</span>
          </Link>
        </header>

        <main className="flex flex-1 flex-col justify-center py-10 lg:py-12">
          <div className="mx-auto w-full max-w-[420px]">
            <p className="font-eyebrow text-[12px] font-semibold tracking-[0.16em] text-primary uppercase">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-[clamp(28px,4vw,36px)] leading-[1.05]">
              {title}
            </h1>
            <p className="mt-3 text-[16px] leading-[1.55] text-secondary">
              {subtitle}
            </p>
            <div className="mt-8">{children}</div>
          </div>
        </main>

        <footer className="text-[12.5px] leading-relaxed text-muted lg:hidden">
          {altPrompt}{" "}
          <Link href={altHref} className="font-semibold text-primary">
            {altLabel}
          </Link>
        </footer>
      </div>

      {/* ---------- brand panel ---------- */}
      <aside className="relative hidden overflow-hidden bg-dark px-14 py-16 text-white lg:flex lg:flex-col">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber/45 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[28px] border-white/[0.04]"
          aria-hidden
        />

        <div className="flex items-center gap-2.5 font-heading text-[19px] font-semibold tracking-[-0.02em] text-white">
          <BrandMark />
          Pakkia
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <h2 className="max-w-[18ch] text-[clamp(28px,2.6vw,36px)] leading-[1.1] text-white">
            The nightly count, handled. The compliance, automatic.
          </h2>
          <ul className="mt-9 flex flex-col gap-4">
            {PANEL_POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[15.5px] text-white/85">
                <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-amber/15 text-amber">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-white/10 pt-6 font-eyebrow text-[10.5px] font-semibold tracking-[0.12em] text-white/55 uppercase">
          <span>EU · Frankfurt</span>
          <span aria-hidden className="text-white/25">/</span>
          <span>GDPR-compliant</span>
          <span aria-hidden className="text-white/25">/</span>
          <span>Statistics Finland ready</span>
        </div>
      </aside>
    </div>
  );
}
