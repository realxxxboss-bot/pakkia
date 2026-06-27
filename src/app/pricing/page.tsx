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

/* ---------- check ---------- */

function Check({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

/* ---------- hero ---------- */

function Hero() {
  return (
    <section className="pt-14 pb-14 lg:pt-24 lg:pb-16">
      <Container className="text-center">
        <div className="rise rise-1">
          <Kicker label="Pricing" center />
        </div>
        <h1 className="rise rise-1 text-[clamp(38px,4.6vw,58px)] font-semibold leading-[1.05] tracking-[-0.03em]">
          Plain pricing. No per-night fees.
        </h1>
        <p className="rise rise-2 mx-auto mt-6 max-w-[52ch] text-[19px] leading-[1.6] text-secondary">
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
    <section className="pb-20 lg:pb-28">
      <Container>
        <div className="grid items-stretch gap-5 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`reveal flex flex-col rounded-[20px] p-8 lg:p-9 ${
                p.featured
                  ? "bg-dark text-white shadow-dark lg:-translate-y-3"
                  : "border border-border bg-surface transition-colors duration-200 ease-[var(--ease-out)] hover:border-border-strong"
              }`}
            >
              <div
                className={`mb-3.5 h-3.5 font-eyebrow text-[10px] font-semibold tracking-[0.12em] uppercase ${
                  p.featured ? "text-amber" : "text-amber-ink"
                }`}
              >
                {p.tag ?? " "}
              </div>
              <div
                className={`font-heading text-[20px] font-semibold ${
                  p.featured ? "text-white" : "text-ink"
                }`}
              >
                {p.name}
              </div>
              <div
                className={`mt-2 min-h-[42px] text-[14px] leading-[1.5] ${
                  p.featured ? "text-white/65" : "text-secondary"
                }`}
              >
                {p.desc}
              </div>
              <div
                className={`nums mt-6 mb-1.5 font-mono text-[44px] font-semibold tracking-[-0.02em] ${
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
                className={`mb-7 font-eyebrow text-[10.5px] font-semibold tracking-[0.1em] uppercase ${
                  p.featured ? "text-white/65" : "text-muted"
                }`}
              >
                {p.per}
              </div>
              <ul className="mb-8 flex flex-col gap-3.5">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-[15px] leading-[1.45]"
                  >
                    <span
                      className={`inline-grid h-[22px] w-[22px] flex-none place-items-center rounded-full ${
                        p.featured
                          ? "bg-amber/15 text-amber"
                          : "bg-primary-tint text-primary"
                      }`}
                    >
                      <Check />
                    </span>
                    <span className={p.featured ? "text-white/90" : "text-ink"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="#"
                className={`${btn.base} ${btn[p.ctaVariant]} mt-auto w-full justify-center`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-9 text-center font-eyebrow text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">
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
  // mockup splits the four cards across two columns (1 & 2 | 3 & 4)
  const columns = [
    [FAQ[0], FAQ[1]],
    [FAQ[2], FAQ[3]],
  ];
  return (
    <section className="pb-20 lg:pb-28">
      <Container>
        <div className="mx-auto mb-12 max-w-[62ch] text-center">
          <Kicker label="FAQ" center />
          <h2 className="text-[clamp(30px,3.4vw,44px)]">Questions, answered.</h2>
        </div>
        <div className="grid items-start gap-5 lg:grid-cols-2">
          {columns.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-5">
              {col.map((item) => (
                <div
                  key={item.q}
                  className="reveal rounded-[16px] border border-border bg-surface p-7 transition-colors duration-200 ease-[var(--ease-out)] hover:bg-subtle"
                >
                  <h3 className="mb-2 text-[19px]">{item.q}</h3>
                  <p className="text-[15.5px] leading-[1.6] text-secondary">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
