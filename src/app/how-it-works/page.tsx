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
    <section className="pt-14 pb-16 lg:pt-24 lg:pb-20">
      <Container>
        <div className="rise rise-1">
          <Kicker label="How it works" />
        </div>
        <h1 className="rise rise-1 max-w-[16ch] text-[clamp(38px,4.6vw,60px)] font-semibold leading-[1.05] tracking-[-0.03em]">
          Four steps from set-up to a filed report.
        </h1>
        <p className="rise rise-2 mt-6 max-w-[48ch] text-[19px] leading-[1.6] text-secondary">
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
    <section className="pb-20 lg:pb-28">
      <Container>
        <div className="relative pl-9 sm:pl-11">
          {/* track */}
          <span
            className="absolute top-4 bottom-4 left-[3px] w-px bg-border sm:left-[5px]"
            aria-hidden
          />

          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className={`reveal relative grid grid-cols-1 items-start gap-2 py-7 sm:grid-cols-[1fr_auto] sm:gap-8 ${
                i < STEPS.length - 1 ? "border-b border-border" : ""
              }`}
            >
              {/* node */}
              <span
                className="absolute top-[34px] -left-[33px] h-[11px] w-[11px] rounded-full bg-primary ring-4 ring-bg sm:-left-[40px]"
                aria-hidden
              />
              <div>
                <div className="mb-2.5 font-eyebrow text-[11px] font-semibold tracking-[0.12em] text-primary uppercase">
                  {s.n}
                </div>
                <h3 className="mb-2.5 text-[clamp(21px,2vw,25px)]">{s.title}</h3>
                <p className="max-w-[62ch] text-[16px] leading-[1.6] text-secondary">
                  {s.body}
                </p>
              </div>
              <div className="hidden self-start rounded-full bg-subtle px-3.5 py-2 font-eyebrow text-[10.5px] font-semibold tracking-[0.08em] whitespace-nowrap text-primary uppercase sm:block">
                {s.vis}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------- roles ---------- */

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
    <section className="pb-20 lg:pb-28">
      <Container>
        <div className="mb-12 max-w-[62ch]">
          <Kicker label="Roles & access" />
          <h2 className="text-[clamp(30px,3.4vw,44px)]">
            Everyone sees exactly their part.
          </h2>
          <p className="mt-5 text-[18px] leading-[1.6] text-secondary">
            Access is set by role and enforced at the database level, so no one
            can reach another pitch&apos;s — or another campsite&apos;s — data.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {ROLES.map((r) => {
            const dark = r.variant === "dark";
            return (
              <div
                key={r.lbl}
                className={`reveal rounded-[20px] p-8 lg:p-10 ${
                  dark
                    ? "bg-dark text-white shadow-dark"
                    : r.variant === "tint"
                      ? "border border-border bg-subtle"
                      : "border border-border bg-surface"
                }`}
              >
                <div
                  className={`mb-4 font-eyebrow text-[11px] font-semibold tracking-[0.14em] uppercase ${
                    dark ? "text-amber" : "text-primary"
                  }`}
                >
                  {r.lbl}
                </div>
                <h3 className={`mb-3 text-[21px] ${dark ? "text-white" : ""}`}>
                  {r.title}
                </h3>
                <p
                  className={`text-[15.5px] leading-[1.6] ${
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
    <section className="pb-20 lg:pb-28">
      <Container>
        <div className="reveal relative overflow-hidden rounded-[24px] bg-dark px-6 py-16 text-center text-white shadow-dark lg:px-20 lg:py-20">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber/40 to-transparent"
            aria-hidden
          />
          <h2 className="mx-auto max-w-[20ch] text-[clamp(28px,3.2vw,42px)] text-white">
            Ready in an afternoon.
          </h2>
          <p className="mx-auto mt-5 max-w-[50ch] text-[17px] leading-[1.6] text-white/70">
            We&apos;ll help you import your current sheet and set up your first
            pitches at no cost.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="#" className={`${btn.base} ${btn.light}`}>
              Get set up <Arrow />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
