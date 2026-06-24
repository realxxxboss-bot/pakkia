import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Container, Kicker, Arrow, btn } from "@/components/ui";

export const metadata: Metadata = {
  title: "About — Pakkia",
  description:
    "A small tool for a duty that never goes away. Pakkia makes the monthly overnight-stay obligation quiet, accurate, and impossible to lose.",
};

export default function About() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Origin />
        <Values />
        <Cta />
      </main>
      <Footer />
    </>
  );
}

/* ---------- hero ---------- */

function Hero() {
  return (
    <section className="pt-14 pb-20 lg:pt-24 lg:pb-28">
      <Container className="grid items-center gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-16">
        <div>
          <div className="rise rise-1">
            <Kicker label="Our story" />
          </div>
          <h1 className="rise rise-1 text-[clamp(38px,4.4vw,58px)] font-semibold leading-[1.05] tracking-[-0.03em]">
            A small tool for a duty that never goes away.
          </h1>
          <p className="rise rise-2 mt-6 max-w-[48ch] text-[19px] leading-[1.6] text-secondary">
            Every campsite above a modest size in Finland must report its
            overnight stays. Most still do it in a spreadsheet built years ago.
            Pakkia exists to make that monthly obligation quiet, accurate, and
            impossible to lose.
          </p>
        </div>

        <div className="rise rise-3 group relative">
          <div className="relative aspect-[4/4.4] overflow-hidden rounded-[20px] bg-container ring-1 ring-border shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80"
              alt="Sunlight through a Finnish forest"
              fetchPriority="high"
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-out)] group-hover:scale-[1.03]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark/25 to-transparent" />
          </div>
          <div className="absolute -bottom-6 right-4 w-[236px] rounded-[14px] border border-border bg-surface p-5 shadow-lg lg:-left-7 lg:right-auto">
            <div className="font-eyebrow text-[10.5px] font-semibold tracking-[0.12em] text-muted uppercase">
              Hosted in
            </div>
            <div className="mt-1.5 font-heading text-[24px] font-semibold tracking-[-0.02em] text-primary">
              EU · Frankfurt
            </div>
            <div className="mt-2.5 font-eyebrow text-[10.5px] font-semibold tracking-[0.1em] text-muted uppercase">
              GDPR by design
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------- origin ---------- */

function Origin() {
  return (
    <section className="py-20 lg:py-28">
      <Container className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Kicker label="How it started" />
          <h2 className="text-[clamp(28px,3vw,40px)]">
            Started for one campsite. Designed for the rest.
          </h2>
        </div>
        <div className="reveal">
          <p className="text-[17px] leading-[1.6] text-secondary">
            Pakkia began as a custom system for a single lakeside site tired of
            re-typing totals every month. It worked — so we rebuilt it as a
            platform any Finnish campsite can switch on in an afternoon.
          </p>
          <p className="mt-5 text-[17px] leading-[1.6] text-secondary">
            We kept it deliberately narrow. Pakkia is not a booking engine or a
            payment processor. It does one regulated job well, stays out of the
            way the rest of the time, and keeps your data inside the EU.
          </p>
        </div>
      </Container>
    </section>
  );
}

/* ---------- values ---------- */

const VALUES = [
  {
    k: "01 — Compliance first",
    title: "Right by the regulator.",
    body: "Every export maps to the figures Statistics Finland actually collects. Compliance isn't a feature here — it's the point.",
  },
  {
    k: "02 — Quiet by design",
    title: "Easy enough to forget.",
    body: "The daily task is a single number. No training days, no manuals. If your team can use a calendar, they can use Pakkia.",
  },
  {
    k: "03 — Local & honest",
    title: "Built for Finnish sites.",
    body: "EU-hosted, plainly priced, no lock-in. Your data is yours and exports any time you ask.",
  },
];

function Values() {
  return (
    <section className="pb-20 lg:pb-28">
      <Container>
        <div className="mb-12 max-w-[62ch]">
          <Kicker label="What we hold to" />
          <h2 className="text-[clamp(30px,3.4vw,44px)]">
            Three things we don&apos;t compromise.
          </h2>
        </div>
        <div className="reveal grid grid-cols-1 gap-px overflow-hidden rounded-[16px] border border-border bg-border md:grid-cols-3">
          {VALUES.map((v) => (
            <div
              key={v.k}
              className="bg-surface p-8 transition-colors duration-200 ease-[var(--ease-out)] hover:bg-subtle lg:p-9"
            >
              <div className="mb-5 font-eyebrow text-[11px] font-semibold tracking-[0.12em] text-primary uppercase">
                {v.k}
              </div>
              <h3 className="mb-2.5 text-[20px]">{v.title}</h3>
              <p className="text-[15.5px] leading-[1.6] text-secondary">
                {v.body}
              </p>
            </div>
          ))}
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
            See if Pakkia fits your site.
          </h2>
          <p className="mx-auto mt-5 max-w-[50ch] text-[17px] leading-[1.6] text-white/70">
            A short call, a quick look at your current spreadsheet, and we&apos;ll
            tell you honestly whether it&apos;s worth switching.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="#" className={`${btn.base} ${btn.light}`}>
              Talk to us <Arrow />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
