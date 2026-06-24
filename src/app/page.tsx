import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Container, Kicker, Arrow, btn } from "@/components/ui";

/* ---------- page ---------- */

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsBand />
        <Compare />
        <Interface />
        <Features />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

/* ---------- icons (stroke, consistent 1.8 weight) ---------- */

function Check({ className = "" }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function Dash({ className = "" }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M6 12h12" />
    </svg>
  );
}

/* ---------- hero ---------- */

function Hero() {
  const trust = [
    "EU-hosted data",
    "GDPR-compliant",
    "Statistics Finland format",
    "CSV & PDF export",
  ];
  return (
    <section className="pt-14 pb-20 lg:pt-24 lg:pb-28">
      <Container className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <div className="rise rise-1">
            <Kicker label="Overnight-stay reporting · Suomi" />
          </div>
          <h1 className="rise rise-1 text-[clamp(40px,5vw,64px)] font-semibold leading-[1.04] tracking-[-0.03em]">
            Report every night.{" "}
            <span className="text-primary">Without the spreadsheet.</span>
          </h1>
          <p className="rise rise-2 mt-6 max-w-[50ch] text-[19px] leading-[1.6] text-secondary">
            Pakkia turns nightly guest counts into the exact figures Statistics
            Finland asks for. Accurate, traceable, and ready in minutes. Built
            for campsites, hosted in the EU.
          </p>
          <div className="rise rise-3 mt-9 flex flex-wrap gap-3">
            <Link href="#" className={`${btn.base} ${btn.primary}`}>
              Start free <Arrow />
            </Link>
            <Link href="#" className={`${btn.base} ${btn.ghost}`}>
              See how it works
            </Link>
          </div>
          <div className="rise rise-4 mt-9 flex flex-wrap gap-2">
            {trust.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-2 rounded-full bg-surface px-3.5 py-2 text-[13px] font-medium text-secondary ring-1 ring-border"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="rise rise-3 group relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-container ring-1 ring-border shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1000&q=80"
              alt="Tents at a lakeside campsite in Finland at dusk"
              fetchPriority="high"
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-out)] group-hover:scale-[1.03]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark/25 to-transparent" />
          </div>
          <div className="absolute -bottom-6 right-4 w-[228px] rounded-[14px] border border-border bg-surface p-5 shadow-lg lg:-left-8 lg:right-auto">
            <div className="font-eyebrow text-[10.5px] font-semibold tracking-[0.12em] text-muted uppercase">
              Nights logged · June
            </div>
            <div className="nums mt-1.5 font-mono text-[30px] font-semibold tracking-[-0.02em] text-ink">
              1,284
            </div>
            <div className="mt-3 flex h-9 items-end gap-1">
              {[1, 0, 1, 1, 0, 1, 1, 1, 0, 1].map((on, i) => (
                <i
                  key={i}
                  className={`block flex-1 rounded-[2px] ${
                    on ? "h-full bg-primary" : "h-[45%] bg-container"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------- stats band ---------- */

function StatsBand() {
  const stats = [
    { b: "<200", s: "campsites in Finland" },
    { b: "20+", s: "beds = reporting duty" },
    { b: "EU", s: "data residency" },
    { b: "5 min", s: "to a monthly report" },
  ];
  return (
    <section>
      <Container>
        <div className="reveal grid grid-cols-2 gap-y-10 rounded-[20px] bg-dark px-7 py-12 shadow-dark sm:grid-cols-4 sm:px-10 lg:px-14">
          {stats.map((s) => (
            <div
              key={s.s}
              className="sm:border-l sm:border-white/10 sm:pl-8 sm:first:border-l-0 sm:first:pl-0"
            >
              <b className="nums block font-mono text-[40px] font-semibold tracking-[-0.02em] text-white">
                {s.b}
              </b>
              <span className="mt-2 block text-[13.5px] leading-snug text-white/55">
                {s.s}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------- compare ---------- */

function Compare() {
  const before = [
    "One master file, one person who understands it",
    "Totals re-typed by hand at month end",
    "No record of who changed what",
    "Figures reformatted for every report",
  ];
  const after = [
    "Each pitch holder enters their own nights",
    "Totals add up automatically, in real time",
    "A full audit log of every entry and edit",
    "One click to a Statistics Finland-ready export",
  ];
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <div className="mb-12 max-w-[60ch]">
          <Kicker label="The shift" />
          <h2 className="text-[clamp(30px,3.4vw,44px)]">
            One fragile spreadsheet, replaced by a single source of truth.
          </h2>
          <p className="mt-5 text-[18px] leading-[1.6] text-secondary">
            Most sites still track nights in a workbook one person owns and
            everyone fears editing. Pakkia keeps the simple habit, enter the
            count, and does the compliance work behind it.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="reveal rounded-[20px] border border-border bg-surface p-8 lg:p-10">
            <h4 className="mb-7 font-eyebrow text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
              Today · the spreadsheet
            </h4>
            <ul className="flex flex-col gap-4">
              {before.map((li) => (
                <li
                  key={li}
                  className="flex items-start gap-3 text-[16px] leading-[1.5] text-secondary"
                >
                  <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-subtle text-muted">
                    <Dash />
                  </span>
                  {li}
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal rounded-[20px] bg-dark p-8 text-white shadow-dark lg:p-10">
            <h4 className="mb-7 font-eyebrow text-[11px] font-semibold tracking-[0.14em] text-amber uppercase">
              With Pakkia
            </h4>
            <ul className="flex flex-col gap-4">
              {after.map((li) => (
                <li
                  key={li}
                  className="flex items-start gap-3 text-[16px] leading-[1.5] text-white/90"
                >
                  <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-amber/15 text-amber">
                    <Check />
                  </span>
                  {li}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------- interface / occupancy preview ---------- */

type Cell = { lvl: 0 | 1 | 2 | 3 | 4; v: number; today?: boolean };

const WEEK: Cell[] = [
  { lvl: 1, v: 2 }, { lvl: 0, v: 0 }, { lvl: 2, v: 4 }, { lvl: 2, v: 3 }, { lvl: 3, v: 6 }, { lvl: 4, v: 8 }, { lvl: 3, v: 5 },
  { lvl: 1, v: 2 }, { lvl: 1, v: 1 }, { lvl: 2, v: 3 }, { lvl: 3, v: 5 }, { lvl: 4, v: 9 }, { lvl: 4, v: 7, today: true }, { lvl: 3, v: 6 },
  { lvl: 0, v: 0 }, { lvl: 1, v: 2 }, { lvl: 2, v: 4 }, { lvl: 2, v: 3 }, { lvl: 3, v: 5 }, { lvl: 4, v: 8 }, { lvl: 2, v: 4 },
];

const CELL_STYLES: Record<Cell["lvl"], string> = {
  0: "bg-subtle text-muted",
  1: "bg-occ-1 text-primary-dark",
  2: "bg-occ-2 text-primary-dark",
  3: "bg-occ-3 text-white",
  4: "bg-primary text-white",
};

function Interface() {
  return (
    <section className="py-20 lg:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Kicker label="The interface" />
          <h2 className="text-[clamp(28px,3vw,40px)]">
            The whole job is one number a day.
          </h2>
          <p className="mt-5 text-[17px] leading-[1.6] text-secondary">
            Open the pitch calendar, tap a day, enter how many people stayed.
            Pakkia handles the totals, the formatting and the audit trail. No
            training, no manual.
          </p>
          <div className="mt-8">
            <Link href="#" className={`${btn.base} ${btn.ghost}`}>
              Walk through it <Arrow />
            </Link>
          </div>
        </div>

        <div className="reveal rounded-[20px] border border-border bg-surface p-7 shadow-md">
          <div className="flex items-center justify-between">
            <div className="font-heading text-[16px] font-semibold text-ink">
              Pitch A-12 · Lakeside
            </div>
            <div className="rounded-full bg-subtle px-3 py-1 font-eyebrow text-[10.5px] font-semibold tracking-[0.08em] text-primary uppercase">
              June 2026
            </div>
          </div>
          <div className="mt-1.5 mb-5 font-eyebrow text-[10.5px] font-semibold tracking-[0.1em] text-muted uppercase">
            Persons per night
          </div>

          <div className="grid grid-cols-7 gap-2">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
              <div
                key={d}
                className="pb-1 text-center font-eyebrow text-[10px] font-semibold tracking-[0.05em] text-muted"
              >
                {d}
              </div>
            ))}
            {WEEK.map((c, i) => (
              <div
                key={i}
                className={`nums flex aspect-square items-end justify-end rounded-[8px] p-1.5 font-mono text-[12px] font-medium ${
                  CELL_STYLES[c.lvl]
                } ${
                  c.today
                    ? "outline outline-2 outline-amber outline-offset-2"
                    : ""
                }`}
              >
                {c.v}
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
            <div>
              <small className="mb-1 block font-eyebrow text-[10px] font-semibold tracking-[0.1em] text-muted uppercase">
                Nights this month
              </small>
              <span className="nums font-mono text-[28px] font-semibold tracking-[-0.02em] text-primary">
                112
              </span>
            </div>
            <button
              type="button"
              className="group inline-flex items-center gap-2 rounded-[10px] bg-primary px-4 py-2.5 font-body text-[14px] font-semibold text-white transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.97]"
            >
              Export report
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
              </svg>
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------- features ---------- */

const FEATURES = [
  {
    title: "Calendar entry",
    body: "Tap a day, enter the number of persons. That's the whole task for staff and pitch holders.",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M3 9h18M8 2v4M16 2v4" />
      </>
    ),
  },
  {
    title: "Live totals",
    body: "Per pitch, day, month and season. Every figure recalculated the moment a number changes.",
    icon: (
      <>
        <path d="M3 3v18h18" />
        <path d="M7 14l3-4 3 3 4-6" />
      </>
    ),
  },
  {
    title: "Compliance-ready",
    body: "Exports formatted for Statistics Finland reporting, in CSV and a clean board-ready PDF.",
    icon: (
      <>
        <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  {
    title: "Roles & access",
    body: "Admins, staff and pitch holders each see only what they should. Access is enforced, not assumed.",
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
      </>
    ),
  },
  {
    title: "Audit log",
    body: "Every change recorded: who, what, when. The traceability auditors and boards ask for.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4l3 2" />
      </>
    ),
  },
  {
    title: "Works on any phone",
    body: "Add Pakkia to the home screen and it behaves like an app. No install, no app store, no friction.",
    icon: (
      <>
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path d="M11 18h2" />
      </>
    ),
  },
];

function Features() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <div className="mb-12 max-w-[60ch]">
          <Kicker label="What you get" />
          <h2 className="text-[clamp(30px,3.4vw,44px)]">
            Built narrow, on purpose.
          </h2>
          <p className="mt-5 text-[18px] leading-[1.6] text-secondary">
            Not another booking suite. Pakkia does one regulated job, reporting
            overnight stays, and does it cleanly.
          </p>
        </div>

        <div className="reveal grid grid-cols-1 gap-px overflow-hidden rounded-[16px] border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-surface p-8 transition-colors duration-200 ease-[var(--ease-out)] hover:bg-subtle"
            >
              <div className="mb-5 grid h-11 w-11 place-items-center rounded-[10px] bg-primary-tint text-primary">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  {f.icon}
                </svg>
              </div>
              <h3 className="mb-2 text-[19px]">{f.title}</h3>
              <p className="text-[15.5px] leading-[1.6] text-secondary">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------- final CTA ---------- */

function FinalCta() {
  return (
    <section className="pb-20 lg:pb-28">
      <Container>
        <div className="reveal relative overflow-hidden rounded-[24px] bg-dark px-6 py-16 text-center text-white shadow-dark lg:px-20 lg:py-20">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber/40 to-transparent"
            aria-hidden
          />
          <h2 className="mx-auto max-w-[20ch] text-[clamp(28px,3.2vw,42px)] text-white">
            Your first season on Pakkia is on us.
          </h2>
          <p className="mx-auto mt-5 max-w-[50ch] text-[17px] leading-[1.6] text-white/70">
            Set up your pitches, invite your team, and run a full month before
            you decide. No card required.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="#" className={`${btn.base} ${btn.light}`}>
              Start free <Arrow />
            </Link>
            <Link href="#" className={`${btn.base} ${btn.darkGhost}`}>
              See pricing
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
