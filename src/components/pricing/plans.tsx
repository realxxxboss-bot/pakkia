"use client";

/* Pricing §3.2 — the editorial rate table. Not three rounded cards: one
   bordered structure whose three columns share 1px --line rules like a
   printed rate card. Standard is marked by a --paper-deep fill, a 2px
   amber top rule and a mono label — no badge, no scale, no shadow.
   Prices count up once on first view, then cross-fade (200ms) when the
   billing toggle switches. On mobile the columns stack as separate
   bordered blocks with Standard first. */

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { Check } from "lucide-react";
import {
  Section,
  SplitButton,
  UnderlineLink,
} from "@/components/site/primitives";
import { EASE, Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import type { Billing } from "./hero";

type Plan = {
  name: string;
  desc: string;
  monthly: number;
  capacity: string;
  features: string[];
  popular?: boolean;
  cta: { label: string; href: string; kind: "split" | "underline" };
};

const PLANS: Plan[] = [
  {
    name: "Starter",
    desc: "Small sites getting off the spreadsheet.",
    monthly: 19,
    capacity: "up to 25 pitches",
    features: [
      "Calendar entry & live totals",
      "CSV & PDF export",
      "1 admin · 2 staff",
      "Audit log",
      "Email support",
    ],
    cta: { label: "Start free", href: "/signup", kind: "split" },
  },
  {
    name: "Standard",
    desc: "The full toolkit for a busy season.",
    monthly: 39,
    capacity: "up to 80 pitches",
    features: [
      "Everything in Starter",
      "Unlimited staff & holders",
      "Event highlights & filters",
      "Season & multi-pitch reports",
      "Priority support",
    ],
    popular: true,
    cta: { label: "Start free", href: "/signup", kind: "split" },
  },
  {
    name: "Multi-site",
    desc: "Operators running more than one campsite.",
    monthly: 79,
    capacity: "unlimited pitches · per site",
    features: [
      "Everything in Standard",
      "Multiple sites, one login",
      "Group reporting across sites",
      "Onboarding assistance",
      "Dedicated contact",
    ],
    cta: { label: "Talk to us", href: "/contact", kind: "underline" },
  },
];

/* yearly-effective monthly price: two months free, rounded (€19 → €16) */
const yearlyMonthly = (m: number) => Math.round((m * 10) / 12);

const REASSURANCE = [
  "All prices exclude VAT",
  "Cancel anytime",
  "Your data exports with you",
];

function Price({ monthly, billing }: { monthly: number; billing: Billing }) {
  const value = billing === "yearly" ? yearlyMonthly(monthly) : monthly;
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  // non-null only while the one-time count-up is running
  const [counting, setCounting] = useState<number | null>(null);
  // the price shown at mount — the count-up always targets this value
  const [mountValue] = useState(value);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, mountValue, {
      duration: 0.6,
      ease: EASE,
      onUpdate: (v) => setCounting(Math.round(v)),
      onComplete: () => setCounting(null),
    });
    return () => controls.stop();
  }, [inView, reduce, mountValue]);

  // a toggle before the count-up finishes shows the real value immediately
  const shown = value === mountValue && counting !== null ? counting : value;

  return (
    <span
      ref={ref}
      className="relative inline-flex font-spline text-[2.5rem] font-medium leading-none text-pine-900 tabular-nums"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={billing}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
        >
          €{shown}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function PlanColumn({ plan, billing }: { plan: Plan; billing: Billing }) {
  return (
    <RevealItem
      className={`flex flex-col max-lg:rounded-[12px] max-lg:border max-lg:border-line max-lg:overflow-hidden lg:border-l lg:border-line lg:first:border-l-0 ${
        plan.popular ? "bg-paper-deep max-lg:order-first" : ""
      }`}
    >
      {/* 2px amber top rule — the Standard column only */}
      {plan.popular && <div className="h-[2px] bg-amber-500" aria-hidden />}

      {/* header zone */}
      <div className="border-b border-line px-7 py-6">
        <div className="h-4">
          {plan.popular && (
            <span className="font-spline text-[11px] font-medium uppercase tracking-[0.12em] text-amber-500">
              Most popular
            </span>
          )}
        </div>
        <h3 className="mt-1 font-familjen text-[1.25rem] font-semibold tracking-[-0.02em] text-pine-900">
          {plan.name}
        </h3>
        <p className="mt-1 min-h-[42px] text-[0.875rem] leading-[1.5] text-ink-muted">
          {plan.desc}
        </p>
      </div>

      {/* price zone */}
      <div className="border-b border-line px-7 py-6">
        <div className="flex items-baseline gap-1.5">
          <Price monthly={plan.monthly} billing={billing} />
          <span className="font-spline text-[14px] font-medium text-ink-muted">
            /mo
          </span>
        </div>
        {/* fixed-height slot so the toggle never shifts the layout */}
        <div className="mt-2 h-[14px]">
          <AnimatePresence initial={false}>
            {billing === "yearly" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="font-spline text-[11px] font-medium leading-none text-ink-muted"
              >
                billed yearly
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <p className="mt-2 font-spline text-[12px] font-medium text-pine-700 tabular-nums">
          {plan.capacity}
        </p>
      </div>

      {/* features zone — no rules inside, 12px row gaps */}
      <ul className="flex flex-col gap-3 px-7 py-6">
        {plan.features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-3 text-[0.9375rem] leading-[1.5] text-ink-900"
          >
            <span
              className="font-spline text-[13px] font-medium leading-[1.6] text-pine-700"
              aria-hidden
            >
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>

      {/* action zone — mt-auto so the buttons align across columns */}
      <div className="mt-auto border-t border-line px-7 py-6">
        <div className="flex min-h-[46px] items-center">
          {plan.cta.kind === "split" ? (
            <SplitButton href={plan.cta.href}>{plan.cta.label}</SplitButton>
          ) : (
            <UnderlineLink href={plan.cta.href} arrow>
              {plan.cta.label}
            </UnderlineLink>
          )}
        </div>
      </div>
    </RevealItem>
  );
}

export default function Plans({ billing }: { billing: Billing }) {
  return (
    <Section bg="paper" padding="pt-2 pb-24 md:pb-32">
      <RevealGroup
        stagger={0.08}
        className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-0 lg:rounded-[12px] lg:border lg:border-line"
      >
        {PLANS.map((plan) => (
          <PlanColumn key={plan.name} plan={plan} billing={billing} />
        ))}
      </RevealGroup>

      {/* reassurance footnote */}
      <Reveal
        as="p"
        className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-center font-spline text-[12px] font-medium text-ink-muted"
      >
        {REASSURANCE.map((t, i) => (
          <span key={t} className="inline-flex items-center gap-x-2">
            {i > 0 && (
              <span className="mr-2" aria-hidden>
                ·
              </span>
            )}
            <Check size={12} strokeWidth={2.5} className="text-pine-700" aria-hidden />
            {t}
          </span>
        ))}
      </Reveal>
    </Section>
  );
}
