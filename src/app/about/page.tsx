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
    <section className="pt-[54px] pb-[70px] lg:pt-20">
      <Container className="grid items-center gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-[72px]">
        <div>
          <Kicker label="Our story" />
          <h1 className="text-[clamp(38px,4.4vw,58px)] font-semibold tracking-[-0.03em]">
            A small tool for a duty that never goes away.
          </h1>
          <p className="mt-6 max-w-[48ch] text-[19px] leading-[1.65] text-secondary">
            Every campsite above a modest size in Finland must report its
            overnight stays. Most still do it in a spreadsheet built years ago.
            Pakkia exists to make that monthly obligation quiet, accurate, and
            impossible to lose.
          </p>
        </div>

        <div className="group relative">
          <div className="relative aspect-[4/4.4] overflow-hidden rounded-[36px] bg-container shadow-clay">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80"
              alt="Sunlight through a Finnish forest"
              loading="lazy"
              className="h-full w-full object-cover saturate-[1.05] transition-transform duration-[900ms] ease-[var(--ease-clay)] group-hover:scale-[1.04]"
            />
          </div>
          <div className="absolute -bottom-7 right-4 w-[236px] rounded-3xl bg-white p-[22px_24px] shadow-clay lg:-left-7 lg:right-auto">
            <div className="font-eyebrow text-[10.5px] tracking-[0.12em] text-secondary uppercase">
              Hosted in
            </div>
            <div className="mt-1 font-heading text-[26px] font-bold tracking-[-0.02em] text-primary">
              EU · Frankfurt
            </div>
            <div className="mt-2 font-eyebrow text-[10.5px] tracking-[0.1em] text-secondary uppercase">
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
    <section className="py-[68px] lg:py-[104px]">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-[72px]">
        <div>
          <Kicker label="How it started" />
          <h2 className="text-[34px]">
            Started for one campsite. Designed for the rest.
          </h2>
        </div>
        <div>
          <p className="text-secondary">
            Pakkia began as a custom system for a single lakeside site tired of
            re-typing totals every month. It worked — so we rebuilt it as a
            platform any Finnish campsite can switch on in an afternoon.
          </p>
          <p className="mt-[18px] text-secondary">
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
    <section className="pt-0 pb-[68px] lg:pb-[104px]">
      <Container>
        <div className="mb-14 max-w-[62ch]">
          <Kicker label="What we hold to" />
          <h2 className="text-[clamp(32px,3.6vw,46px)]">
            Three things we don&apos;t compromise.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v) => (
            <div
              key={v.k}
              className="rounded-[30px] bg-surface p-[38px_34px] shadow-clay transition-transform duration-300 ease-[var(--ease-clay-h)] hover:-translate-y-[6px]"
            >
              <div className="mb-[18px] font-eyebrow text-[11px] tracking-[0.1em] text-primary uppercase">
                {v.k}
              </div>
              <h3 className="mb-2.5 text-[20px]">{v.title}</h3>
              <p className="text-[15px] text-secondary">{v.body}</p>
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
    <section className="pt-0 pb-[68px] lg:pb-[104px]">
      <Container>
        <div className="relative overflow-hidden rounded-[44px] bg-dark px-[26px] py-[44px] text-center text-white shadow-clay-dark lg:p-20">
          <h2 className="mx-auto max-w-[20ch] text-[clamp(30px,3.4vw,44px)] text-white">
            See if Pakkia fits your site.
          </h2>
          <p className="mx-auto mt-[18px] max-w-[50ch] text-white/[0.72]">
            A short call, a quick look at your current spreadsheet, and we&apos;ll
            tell you honestly whether it&apos;s worth switching.
          </p>
          <div className="mt-[34px] flex flex-wrap justify-center gap-4">
            <Link href="#" className={`${btn.base} ${btn.light}`}>
              Talk to us <Arrow />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
