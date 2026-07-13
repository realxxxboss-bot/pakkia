"use client";

/* Pricing §3.1 — compact hero. Single column, left-aligned, with the
   Monthly / Yearly segmented control (two adjacent rectangles sharing a
   1px --line border — NOT a pill switch). The billing state lives in
   sections.tsx so the rate table can react to it. */

import { Section, SectionEyebrow } from "@/components/site/primitives";
import { RevealGroup, RevealItem } from "@/components/site/reveal";

export type Billing = "monthly" | "yearly";

const SEGMENTS: { value: Billing; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly — 2 mo free" },
];

function BillingToggle({
  billing,
  onChange,
}: {
  billing: Billing;
  onChange: (b: Billing) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Billing period"
      className="inline-flex rounded-[6px] border border-line"
    >
      {SEGMENTS.map((s, i) => {
        const active = billing === s.value;
        return (
          <button
            key={s.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(s.value)}
            className={`tap-min h-10 px-4 font-spline text-[13px] font-medium tabular-nums transition-colors duration-200 ${
              i === 0
                ? "rounded-l-[5px]"
                : "rounded-r-[5px] border-l border-line"
            } ${
              active
                ? "bg-pine-700 text-cream"
                : "text-ink-muted hover:text-pine-900"
            }`}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

export default function PricingHero({
  billing,
  onBillingChange,
}: {
  billing: Billing;
  onBillingChange: (b: Billing) => void;
}) {
  return (
    <Section bg="paper" padding="pt-14 pb-10 md:pt-20 md:pb-12">
      <RevealGroup mode="mount" className="max-w-[52rem]">
        <RevealItem>
          <SectionEyebrow number="01" label="Pricing" />
        </RevealItem>
        <RevealItem
          as="h1"
          className="mt-7 font-familjen text-[clamp(2.6rem,5.5vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-pine-900"
        >
          Plain pricing.{" "}
          <span className="text-amber-500">No per-night fees.</span>
        </RevealItem>
        <RevealItem
          as="p"
          className="mt-6 max-w-[36rem] text-[1.0625rem] leading-[1.65] text-ink-muted"
        >
          One flat monthly price by site size. Every plan includes exports,
          audit log and EU hosting.
        </RevealItem>
        <RevealItem className="mt-8 max-w-[36rem] border-t border-line pt-4">
          <p className="font-spline text-[13px] font-medium text-pine-700 tabular-nums">
            Two months free when you pay yearly
          </p>
        </RevealItem>
        <RevealItem className="mt-6">
          <BillingToggle billing={billing} onChange={onBillingChange} />
        </RevealItem>
      </RevealGroup>
    </Section>
  );
}
