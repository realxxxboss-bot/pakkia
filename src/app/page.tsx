import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ---------- shared bits ---------- */

function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto max-w-[1240px] px-[18px] sm:px-9 lg:px-16 ${className}`}
    >
      {children}
    </div>
  );
}

function Kicker({
  label,
  center = false,
}: {
  label: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-[26px] ${center ? "flex flex-col items-center" : ""}`}>
      <div className="mb-[18px] h-[6px] w-[26px] rounded-full bg-primary shadow-clay-sm" />
      <span className="font-eyebrow text-[12px] font-semibold tracking-[0.2em] text-primary uppercase">
        {label}
      </span>
    </div>
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className={`transition-transform duration-200 ease-[var(--ease-clay-h)] group-hover:translate-x-1 ${className}`}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

const btnBase =
  "group inline-flex items-center gap-2.5 rounded-full font-body text-[15px] font-semibold px-[30px] py-4 transition-[transform,background,box-shadow] duration-300 ease-[var(--ease-clay-h)]";

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

/* ---------- hero ---------- */

function Hero() {
  const trust = [
    "EU-hosted data",
    "GDPR-compliant",
    "Statistics Finland format",
    "CSV & PDF export",
  ];
  return (
    <section className="pt-[54px] pb-[70px] lg:pt-20 lg:pb-24">
      <Container className="grid items-center gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-[72px]">
        <div>
          <Kicker label="Overnight-stay reporting · Suomi" />
          <h1 className="text-[clamp(42px,5vw,70px)] font-semibold tracking-[-0.03em]">
            Report every night.{" "}
            <em className="text-primary not-italic">
              Without the spreadsheet.
            </em>
          </h1>
          <p className="mt-[26px] max-w-[48ch] text-[19px] leading-[1.65] text-secondary">
            Pakkia turns nightly guest counts into the exact figures Statistics
            Finland asks for — accurate, traceable, and ready in minutes. Built
            for campsites, hosted in the EU.
          </p>
          <div className="mt-[38px] flex flex-wrap gap-4">
            <Link
              href="#"
              className={`${btnBase} bg-primary text-white shadow-clay-primary hover:-translate-y-[3px] hover:bg-primary-dark`}
            >
              Start free <Arrow />
            </Link>
            <Link
              href="#"
              className={`${btnBase} bg-surface text-primary shadow-clay-sm hover:-translate-y-[3px] hover:shadow-clay-hover`}
            >
              See how it works
            </Link>
          </div>
          <div className="mt-[38px] flex flex-wrap gap-3">
            {trust.map((t) => (
              <span
                key={t}
                className="flex items-center gap-2 rounded-full bg-surface px-4 py-[9px] text-[13px] font-semibold text-secondary shadow-clay-sm before:h-[7px] before:w-[7px] before:rounded-full before:bg-primary before:content-['']"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="group relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[36px] bg-container shadow-clay">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1000&q=80"
              alt="Tents at a lakeside campsite in Finland at dusk"
              loading="lazy"
              className="h-full w-full object-cover saturate-[1.05] transition-transform duration-[900ms] ease-[var(--ease-clay)] group-hover:scale-[1.04]"
            />
          </div>
          <div className="absolute -bottom-7 right-4 w-[236px] rounded-3xl bg-white p-[22px_24px] shadow-clay lg:-left-7 lg:right-auto">
            <div className="font-eyebrow text-[10.5px] tracking-[0.12em] text-secondary uppercase">
              Nights logged · June
            </div>
            <div className="mt-1 font-heading text-[34px] font-bold tracking-[-0.02em] text-primary">
              1,284
            </div>
            <div className="mt-3 flex h-[34px] items-end gap-1">
              {[1, 0, 1, 1, 0, 1, 1, 1, 0, 1].map((on, i) => (
                <i
                  key={i}
                  className={`block flex-1 rounded-[4px] ${
                    on ? "h-full bg-primary" : "h-[55%] bg-container"
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
    <div>
      <Container>
        <div className="flex flex-wrap justify-between gap-[30px] rounded-[40px] bg-dark px-[18px] py-[52px] shadow-clay-dark sm:px-9 lg:px-16">
          {stats.map((s) => (
            <div key={s.s}>
              <b className="block font-heading text-[42px] font-bold tracking-[-0.02em] text-white">
                {s.b}
              </b>
              <span className="mt-2 block font-eyebrow text-[11px] tracking-[0.12em] text-white/60 uppercase">
                {s.s}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </div>
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
    <section className="py-[68px] lg:py-[104px]">
      <Container>
        <div className="mb-14 max-w-[62ch]">
          <Kicker label="The shift" />
          <h2 className="text-[clamp(32px,3.6vw,46px)]">
            One fragile spreadsheet, replaced by a single source of truth.
          </h2>
          <p className="mt-5 text-[18px] text-secondary">
            Most sites still track nights in a workbook one person owns and
            everyone fears editing. Pakkia keeps the simple habit — enter the
            count — and does the compliance work behind it.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[32px] bg-container p-[40px_38px] shadow-clay">
            <h4 className="mb-[26px] font-eyebrow text-[11px] font-semibold tracking-[0.14em] text-secondary uppercase">
              Today · the spreadsheet
            </h4>
            <ul className="flex flex-col gap-4">
              {before.map((li) => (
                <li
                  key={li}
                  className="flex items-start gap-3.5 text-[16px] leading-[1.5]"
                >
                  <span className="flex-none font-bold text-primary">—</span>
                  {li}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[32px] bg-dark p-[40px_38px] text-white shadow-clay-dark">
            <h4 className="mb-[26px] font-eyebrow text-[11px] font-semibold tracking-[0.14em] text-amber uppercase">
              With Pakkia
            </h4>
            <ul className="flex flex-col gap-4">
              {after.map((li) => (
                <li
                  key={li}
                  className="flex items-start gap-3.5 text-[16px] leading-[1.5]"
                >
                  <span className="flex-none font-bold text-amber">→</span>
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
  0: "bg-container text-secondary",
  1: "bg-occ-1 text-primary-dark",
  2: "bg-occ-2 text-primary-dark",
  3: "bg-occ-3 text-white",
  4: "bg-primary text-white shadow-occ-4",
};

function Interface() {
  return (
    <section className="py-[68px] lg:py-[104px]">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-[72px]">
        <div>
          <Kicker label="The interface" />
          <h2 className="text-[34px]">The whole job is one number a day.</h2>
          <p className="mt-[18px] text-[17px] text-secondary">
            Open the pitch calendar, tap a day, enter how many people stayed.
            Pakkia handles the totals, the formatting and the audit trail. No
            training, no manual.
          </p>
          <div className="mt-[38px] flex flex-wrap gap-4">
            <Link
              href="#"
              className={`${btnBase} bg-surface text-primary shadow-clay-sm hover:-translate-y-[3px] hover:shadow-clay-hover`}
            >
              Walk through it <Arrow />
            </Link>
          </div>
        </div>

        <div className="rounded-[32px] bg-surface p-8 shadow-clay">
          <div className="mb-1.5 flex items-center justify-between">
            <div className="font-heading text-[16px] font-semibold">
              Pitch A-12 · Lakeside
            </div>
            <div className="rounded-full bg-container px-[13px] py-1.5 font-eyebrow text-[10.5px] tracking-[0.08em] text-primary uppercase shadow-clay-inset">
              June 2026
            </div>
          </div>
          <div className="mb-5 font-eyebrow text-[10.5px] tracking-[0.1em] text-secondary uppercase">
            Persons per night
          </div>

          <div className="grid grid-cols-7 gap-2">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
              <div
                key={d}
                className="pb-[3px] text-center font-eyebrow text-[10px] tracking-[0.05em] text-secondary"
              >
                {d}
              </div>
            ))}
            {WEEK.map((c, i) => (
              <div
                key={i}
                className={`flex aspect-square items-end justify-end rounded-[11px] p-1.5 font-body text-[12px] font-semibold ${
                  CELL_STYLES[c.lvl]
                } ${c.today ? "outline-[3px] outline-amber outline-offset-2" : ""}`}
              >
                {c.v}
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t-2 border-dashed border-container pt-[22px]">
            <div className="font-heading text-[30px] font-bold tracking-[-0.02em] text-primary">
              <small className="mb-[3px] block font-eyebrow text-[10px] font-medium tracking-[0.1em] text-secondary uppercase">
                Nights this month
              </small>
              112
            </div>
            <div className="flex items-center gap-[7px] rounded-full bg-container px-4 py-2.5 font-body text-[14px] font-semibold text-primary shadow-clay-sm">
              Export report
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
              </svg>
            </div>
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
        <rect x="3" y="4" width="18" height="17" />
        <path d="M3 9h18M8 2v4M16 2v4" />
      </>
    ),
  },
  {
    title: "Live totals",
    body: "Per pitch, day, month and season — every figure recalculated the moment a number changes.",
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
    body: "Every change recorded — who, what, when. The traceability auditors and boards ask for.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4l3 2" />
      </>
    ),
  },
  {
    title: "Works on any phone",
    body: "Add Pakkia to the home screen and it behaves like an app — no install, no app store, no friction.",
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
    <section className="py-[68px] lg:py-[104px]">
      <Container>
        <div className="mb-14 max-w-[62ch]">
          <Kicker label="What you get" />
          <h2 className="text-[clamp(32px,3.6vw,46px)]">
            Built narrow, on purpose.
          </h2>
          <p className="mt-5 text-[18px] text-secondary">
            Not another booking suite. Pakkia does one regulated job — reporting
            overnight stays — and does it cleanly.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-[30px] bg-surface p-[38px_34px] shadow-clay transition-[transform,box-shadow] duration-300 ease-[var(--ease-clay-h)] hover:-translate-y-[7px] hover:shadow-clay-hover"
            >
              <div className="mb-6 grid h-14 w-14 place-items-center rounded-[18px] bg-container text-primary shadow-clay-inset">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  {f.icon}
                </svg>
              </div>
              <h3 className="mb-[11px] text-[20px]">{f.title}</h3>
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
    <section className="pb-[68px] lg:pb-[104px]">
      <Container>
        <div className="relative overflow-hidden rounded-[44px] bg-dark px-[26px] py-[44px] text-center text-white shadow-clay-dark lg:p-20">
          <h2 className="mx-auto max-w-[20ch] text-[clamp(30px,3.4vw,44px)] text-white">
            Your first season on Pakkia is on us.
          </h2>
          <p className="mx-auto mt-[18px] max-w-[50ch] text-white/[0.72]">
            Set up your pitches, invite your team, and run a full month before
            you decide. No card required.
          </p>
          <div className="mt-[34px] flex flex-wrap justify-center gap-4">
            <Link
              href="#"
              className={`${btnBase} bg-white text-primary shadow-clay-light hover:-translate-y-[3px]`}
            >
              Start free <Arrow />
            </Link>
            <Link
              href="#"
              className={`${btnBase} bg-surface text-primary shadow-clay-sm hover:-translate-y-[3px] hover:shadow-clay-hover`}
            >
              See pricing
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
