/* §2.4 — Onboarding promise. A slim paper beat before the CTA: the
   "Ready in an afternoon" claim over a 3-item ruled strip (the homepage
   stats-strip pattern — left-aligned cells, hairline rules, no cards). */

import { Section, SectionEyebrow } from "@/components/site/primitives";
import { Reveal } from "@/components/site/reveal";

const ITEMS = [
  { label: "Free", body: "We import your sheet." },
  { label: "On a call", body: "First pitches set up with you." },
  { label: "Before you file", body: "First export checked together." },
];

export default function Onboarding() {
  return (
    <Section bg="paper" padding="py-20 md:py-24">
      <Reveal>
        <SectionEyebrow number="04" label="Switching" />
        <h2 className="mt-7 font-familjen text-[clamp(1.9rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-pine-900">
          Ready in an afternoon.
        </h2>
      </Reveal>

      <Reveal delay={0.1} className="mt-12">
        <div className="grid border-y border-line md:grid-cols-3">
          {ITEMS.map((it, i) => (
            <div
              key={it.label}
              className={`py-8 pr-4 md:px-8 ${
                i === 0
                  ? "md:pl-0"
                  : "border-t border-line md:border-l md:border-t-0"
              }`}
            >
              <div className="font-spline text-[12px] font-medium uppercase tracking-[0.12em] text-ink-muted">
                {it.label}
              </div>
              <div className="mt-3 text-[1rem] leading-[1.6] text-ink-900">
                {it.body}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
