import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Container, Kicker, Arrow, btn } from "@/components/ui";

export const metadata: Metadata = {
  title: "How it works — Pakkia",
  description:
    "Four steps from set-up to a filed report. The totals, formatting and traceability happen on their own — your team only ever logs the nights.",
};

export default function HowItWorks() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Pipeline />
        <Roles />
        <Cta />
      </main>
      <Footer />
    </>
  );
}

/* ---------- hero ---------- */

function Hero() {
  return (
    <section className="pt-[54px] pb-[60px] lg:pt-20">
      <Container>
        <Kicker label="How it works" />
        <h1 className="max-w-[16ch] text-[clamp(38px,4.6vw,60px)] font-semibold tracking-[-0.03em]">
          Four steps from set-up to a filed report.
        </h1>
        <p className="mt-6 max-w-[48ch] text-[19px] leading-[1.65] text-secondary">
          The hard part — totals, formatting, traceability — happens on its own.
          Your team only ever does step two.
        </p>
      </Container>
    </section>
  );
}

/* ---------- pipeline ---------- */

const STEPS = [
  {
    n: "Step 01",
    title: "Set up your pitches",
    body: "Add your pitch numbers and areas once. An admin assigns each holder to a pitch and defines the season dates.",
    vis: "~ one afternoon",
  },
  {
    n: "Step 02",
    title: "Log the nights",
    body: "Staff or pitch holders open the calendar and enter the number of persons per night. One tap, one number — on any phone.",
    vis: "daily · 10 seconds",
  },
  {
    n: "Step 03",
    title: "Pakkia does the maths",
    body: "Totals roll up per pitch, day, month and season automatically. Every entry is timestamped and logged for the audit trail.",
    vis: "automatic",
  },
  {
    n: "Step 04",
    title: "Export & file",
    body: "At month end, download a Statistics Finland-ready CSV or a formatted PDF for the board. No re-typing, no reformatting.",
    vis: "one click",
  },
];

function Pipeline() {
  return (
    <section className="pt-5 pb-[68px] lg:pb-[104px]">
      <Container>
        <div className="relative pl-11">
          {/* track + fill */}
          <div className="absolute top-2 bottom-2 left-0 w-1.5 rounded-full bg-container shadow-clay-inset" />
          <div className="absolute top-2 left-0 h-[calc(100%-16px)] w-1.5 rounded-full bg-primary shadow-clay-primary" />

          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className={`relative grid grid-cols-1 items-start gap-2 py-[30px] sm:grid-cols-[1fr_auto] sm:gap-[30px] ${
                i < STEPS.length - 1
                  ? "border-b-2 border-dashed border-container"
                  : ""
              }`}
            >
              <span className="absolute top-[38px] -left-[50px] h-[18px] w-[18px] rounded-full bg-primary shadow-clay-primary" />
              <div>
                <div className="mb-2.5 font-eyebrow text-[12px] font-bold tracking-[0.1em] text-primary">
                  {s.n}
                </div>
                <h3 className="mb-2.5 text-[25px]">{s.title}</h3>
                <p className="max-w-[62ch] text-[16px] text-secondary">
                  {s.body}
                </p>
              </div>
              <div className="hidden rounded-full bg-container px-3.5 py-2 font-eyebrow text-[11px] tracking-[0.08em] whitespace-nowrap text-primary uppercase shadow-clay-sm sm:block">
                {s.vis}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------- roles bento ---------- */

const ROLES = [
  {
    lbl: "Administrator",
    title: "Full control",
    body: "Manages users, pitches, settings and full-site exports across the season.",
    variant: "tint" as const,
  },
  {
    lbl: "Power user",
    title: "Day-to-day",
    body: "Assigns pitches, flags special events, and pulls intermediate reports.",
    variant: "surface" as const,
  },
  {
    lbl: "Pitch holder",
    title: "Just their nights",
    body: "Sees only their own pitch calendar and enters their nightly counts.",
    variant: "dark" as const,
  },
];

function Roles() {
  return (
    <section className="py-[68px] lg:py-[104px]">
      <Container>
        <div className="mb-14 max-w-[62ch]">
          <Kicker label="Roles & access" />
          <h2 className="text-[clamp(32px,3.6vw,46px)]">
            Everyone sees exactly their part.
          </h2>
          <p className="mt-5 text-[18px] text-secondary">
            Access is set by role and enforced at the database level, so no one
            can reach another pitch&apos;s — or another campsite&apos;s — data.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {ROLES.map((r) => {
            const dark = r.variant === "dark";
            return (
              <div
                key={r.lbl}
                className={`rounded-[32px] p-11 ${
                  dark
                    ? "bg-dark text-white shadow-clay-dark"
                    : r.variant === "tint"
                      ? "bg-container shadow-clay"
                      : "bg-surface shadow-clay"
                }`}
              >
                <div
                  className={`mb-[18px] font-eyebrow text-[11px] tracking-[0.14em] uppercase ${
                    dark ? "text-amber" : "text-primary"
                  }`}
                >
                  {r.lbl}
                </div>
                <h3 className={`mb-3.5 text-[21px] ${dark ? "text-white" : ""}`}>
                  {r.title}
                </h3>
                <p
                  className={`text-[15px] ${
                    dark ? "text-white/80" : "text-secondary"
                  }`}
                >
                  {r.body}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

/* ---------- cta ---------- */

function Cta() {
  return (
    <section className="pt-0 pb-[68px] lg:pb-[104px]">
      <Container>
        <div className="relative overflow-hidden rounded-[44px] bg-dark px-[26px] py-[44px] text-center text-white shadow-clay-dark lg:p-20">
          <h2 className="mx-auto max-w-[20ch] text-[clamp(30px,3.4vw,44px)] text-white">
            Ready in an afternoon.
          </h2>
          <p className="mx-auto mt-[18px] max-w-[50ch] text-white/[0.72]">
            We&apos;ll help you import your current sheet and set up your first
            pitches at no cost.
          </p>
          <div className="mt-[34px] flex flex-wrap justify-center gap-4">
            <Link href="#" className={`${btn.base} ${btn.light}`}>
              Get set up <Arrow />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
