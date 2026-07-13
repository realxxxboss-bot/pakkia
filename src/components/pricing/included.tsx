/* Pricing §3.3 — "Always included", a slim ruled strip (the stats-strip
   pattern from the homepage): 4 cells between hairline rules, vertical
   rules on desktop, no cards. Kills the "what's the catch" doubt. */

import { Section, SectionEyebrow } from "@/components/site/primitives";
import { Reveal } from "@/components/site/reveal";

const ITEMS = [
  "EU hosting · Frankfurt",
  "Audit log",
  "Statistics Finland exports",
  "Free onboarding import",
];

export default function Included() {
  return (
    <Section bg="paper-deep" padding="py-16 md:py-20">
      <Reveal>
        <SectionEyebrow number="02" label="Always included" />
        <div className="mt-8 grid grid-cols-2 border-y border-line md:grid-cols-4">
          {ITEMS.map((t, i) => (
            <div
              key={t}
              className={`py-6 pr-4 md:px-8 ${
                i === 0 ? "md:pl-0" : "md:border-l md:border-line"
              }`}
            >
              <span className="font-spline text-[13px] font-medium text-pine-900">
                {t}
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
