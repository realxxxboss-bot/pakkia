import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Container, Kicker, btn } from "@/components/ui";

export const metadata: Metadata = {
  title: "Pricing — Pakkia",
  description:
    "Plain pricing. No per-night fees. One flat monthly price by site size — every plan includes exports, audit log and EU hosting.",
};

export default function Pricing() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Plans />
        <Faq />
      </main>
      <Footer />
    </>
  );
}

/* ---------- hero ---------- */

function Hero() {
  return (
    <section className="pt-[54px] pb-[56px] lg:pt-20">
      <Container className="text-center">
        <Kicker label="Pricing" center />
        <h1 className="text-[clamp(38px,4.6vw,58px)] font-semibold tracking-[-0.03em]">
          Plain pricing. No per-night fees.
        </h1>
        <p className="mx-auto mt-6 max-w-[52ch] text-[19px] leading-[1.65] text-secondary">
          One flat monthly price by site size. Every plan includes exports,
          audit log and EU hosting. Two months free when you pay yearly.
        </p>
      </Container>
    </section>
  );
}

/* ---------- plans ---------- */

type Plan = {
  tag?: string;
  name: string;
  desc: string;
  price: string;
  per: string;
  features: string[];
  cta: string;
  ctaVariant: "ghost" | "light";
  featured?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Starter",
    desc: "Small sites getting off the spreadsheet.",
    price: "€19",
    per: "up to 25 pitches",
    features: [
      "Calendar entry & live totals",
      "CSV & PDF export",
      "1 admin · 2 staff",
      "Audit log",
      "Email support",
    ],
    cta: "Start free",
    ctaVariant: "ghost",
  },
  {
    tag: "Most popular",
    name: "Standard",
    desc: "The full toolkit for a busy season.",
    price: "€39",
    per: "up to 80 pitches",
    features: [
      "Everything in Starter",
      "Unlimited staff & holders",
      "Event highlights & filters",
      "Season & multi-pitch reports",
      "Priority support",
    ],
    cta: "Start free",
    ctaVariant: "light",
    featured: true,
  },
  {
    name: "Multi-site",
    desc: "Operators running more than one campsite.",
    price: "€79",
    per: "unlimited pitches · per site",
    features: [
      "Everything in Standard",
      "Multiple sites, one login",
      "Group reporting across sites",
      "Onboarding assistance",
      "Dedicated contact",
    ],
    cta: "Talk to us",
    ctaVariant: "ghost",
  },
];

function Plans() {
  return (
    <section className="pt-5 pb-[68px] lg:pb-[104px]">
      <Container>
        <div className="grid items-stretch gap-6 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`flex flex-col rounded-[32px] p-[40px_36px] transition-transform duration-300 ease-[var(--ease-clay-h)] ${
                p.featured
                  ? "bg-dark text-white shadow-clay-dark lg:-translate-y-[10px] lg:hover:-translate-y-[16px]"
                  : "bg-surface shadow-clay hover:-translate-y-[6px]"
              }`}
            >
              <div className="mb-3.5 h-3.5 font-eyebrow text-[10px] tracking-[0.12em] text-amber uppercase">
                {p.tag ?? " "}
              </div>
              <div
                className={`font-heading text-[20px] font-bold ${
                  p.featured ? "text-white" : ""
                }`}
              >
                {p.name}
              </div>
              <div
                className={`mt-[7px] min-h-[42px] text-[14px] ${
                  p.featured ? "text-white/65" : "text-secondary"
                }`}
              >
                {p.desc}
              </div>
              <div
                className={`mt-6 mb-[5px] font-heading text-[46px] font-bold tracking-[-0.02em] ${
                  p.featured ? "text-white" : "text-primary"
                }`}
              >
                {p.price}
                <small
                  className={`font-body text-[15px] font-medium tracking-normal ${
                    p.featured ? "text-white/60" : "text-secondary"
                  }`}
                >
                  {" "}
                  /mo
                </small>
              </div>
              <div
                className={`mb-[26px] font-eyebrow text-[10.5px] tracking-[0.1em] uppercase ${
                  p.featured ? "text-white/65" : "text-secondary"
                }`}
              >
                {p.per}
              </div>
              <ul className="mb-[30px] flex flex-col gap-[13px]">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-[15px] leading-[1.4]"
                  >
                    <span
                      className={`inline-grid h-[22px] w-[22px] flex-none place-items-center rounded-full text-[12px] font-bold ${
                        p.featured
                          ? "bg-white/10 text-amber"
                          : "bg-container text-primary shadow-clay-inset"
                      }`}
                    >
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="#"
                className={`${btn.base} ${btn[p.ctaVariant]} mt-auto justify-center`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-[34px] text-center font-eyebrow text-[11px] tracking-[0.08em] text-secondary uppercase">
          All prices exclude VAT · Cancel anytime · Your data exports with you
        </p>
      </Container>
    </section>
  );
}

/* ---------- faq ---------- */

const FAQ = [
  {
    q: "Is the free trial really free?",
    a: "Yes — a full month, no card. Set up your site and run a real reporting cycle before you pay.",
  },
  {
    q: "Can I import my spreadsheet?",
    a: "We'll help you bring across pitches and recent history during onboarding, free on every plan.",
  },
  {
    q: "Where is my data stored?",
    a: "On EU infrastructure in the Frankfurt region, with daily backups. It never leaves the EU.",
  },
  {
    q: "What if I outgrow a plan?",
    a: "Move up any time — the change is instant and prorated. No data migration needed.",
  },
];

function Faq() {
  // mockup splits the four cards across two columns (1 & 3 | 2 & 4)
  const columns = [
    [FAQ[0], FAQ[1]],
    [FAQ[2], FAQ[3]],
  ];
  return (
    <section className="py-[68px] lg:py-[104px]">
      <Container>
        <div className="mx-auto mb-14 max-w-[62ch] text-center">
          <Kicker label="FAQ" center />
          <h2 className="text-[clamp(32px,3.6vw,46px)]">Questions, answered.</h2>
        </div>
        <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-[72px]">
          {columns.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-4">
              {col.map((item) => (
                <div
                  key={item.q}
                  className="rounded-[24px] bg-surface p-[22px_26px] shadow-clay-sm"
                >
                  <h3 className="mb-2 text-[19px]">{item.q}</h3>
                  <p className="text-[15.5px] text-secondary">{item.a}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
