import Link from "next/link";
import { TentMark, UnderlineLink } from "@/components/site/primitives";

/* Shared auth shell (inner-pages spec §9.1, §9.4) — Nordic editorial split
   screen. Left 45%: pine-900 brand panel (logotype top, a per-page middle
   slot, trust line bottom); collapses to a slim strip below lg. Right 55%:
   the form directly on paper — no card — in a centered max-w-[380px] column,
   with auth chrome top-right (alternate action) and bottom (© row). Auth
   pages carry no site header/footer. Login and Signup differ only via
   `panel`, `mobileLine` and the alt-action props. */

function Logotype() {
  return (
    <Link
      href="/"
      aria-label="Pakkia home"
      className="tap-target flex w-fit items-center gap-2 font-familjen text-[1.25rem] font-bold leading-none tracking-[-0.02em] text-cream"
    >
      <TentMark className="text-cream-muted" />
      Pakkia
    </Link>
  );
}

export default function AuthLayout({
  panel,
  mobileLine,
  altPrompt,
  altLabel,
  altHref,
  children,
}: {
  /** middle content of the left brand panel — varies per auth page */
  panel: React.ReactNode;
  /** the single line beside the logo in the collapsed mobile strip */
  mobileLine: string;
  /** top-right alternate action, e.g. "New to Pakkia?" / "Start free" */
  altPrompt: string;
  altLabel: string;
  altHref: string;
  children: React.ReactNode;
}) {
  return (
    <div className="home-nordic flex min-h-dvh flex-col bg-paper font-body text-ink-900 lg:grid lg:grid-cols-[45fr_55fr]">
      {/* brand panel, collapsed to a slim strip below lg */}
      <div className="flex items-center justify-between gap-4 bg-pine-900 px-5 py-4 lg:hidden">
        <Logotype />
        <p className="truncate font-spline text-[11px] font-medium text-cream-muted">
          {mobileLine}
        </p>
      </div>

      <aside className="hidden bg-pine-900 p-12 lg:flex lg:flex-col lg:justify-between">
        <Logotype />
        <div>{panel}</div>
        <p className="font-spline text-[12px] font-medium text-cream-muted">
          EU-hosted · GDPR · Statistics Finland format
        </p>
      </aside>

      {/* form panel — the form sits directly on the paper, no card */}
      <div
        className="flex flex-1 flex-col px-5 py-6 sm:px-10 lg:px-16 lg:py-8"
        style={
          { "--field-autofill-bg": "var(--color-paper)" } as React.CSSProperties
        }
      >
        <p className="self-end font-spline text-[12px] font-medium text-ink-muted">
          {altPrompt}{" "}
          <UnderlineLink href={altHref} mono>
            {altLabel}
          </UnderlineLink>
        </p>

        <main className="flex flex-1 items-center py-12">
          <div className="mx-auto w-full max-w-[380px]">{children}</div>
        </main>

        <footer className="mx-auto w-full max-w-[380px] font-spline text-[11px] font-medium text-ink-muted tabular-nums">
          © 2026 Pakkia ·{" "}
          <UnderlineLink href="/privacy" mono>
            Privacy
          </UnderlineLink>{" "}
          ·{" "}
          <UnderlineLink href="/terms" mono>
            Terms
          </UnderlineLink>
        </footer>
      </div>
    </div>
  );
}
