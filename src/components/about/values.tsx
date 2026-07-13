/* About §1.4 — Values. An editorial index of three full-width ruled rows,
   the same component family as the homepage features table. No icons
   anywhere on this page. */

import { Section, SectionEyebrow } from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";

const VALUES: { title: string; tagline: string; body: string }[] = [
  {
    title: "Compliance first",
    tagline: "Right by the regulator.",
    body: "Every export maps to the figures Statistics Finland actually collects. Compliance isn't a feature here — it's the point.",
  },
  {
    title: "Quiet by design",
    tagline: "Easy enough to forget.",
    body: "The daily task is a single number. No training days, no manuals. If your team can use a calendar, they can use Pakkia.",
  },
  {
    title: "Local & honest",
    tagline: "Built for Finnish sites.",
    body: "EU-hosted, plainly priced, no lock-in. Your data is yours and exports any time you ask.",
  },
];

export default function Values() {
  return (
    <Section bg="paper">
      <Reveal className="max-w-[44rem]">
        <SectionEyebrow number="03" label="What we hold to" />
        <h2 className="mt-7 font-familjen text-[clamp(1.9rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-pine-900">
          Three things we don&apos;t compromise.
        </h2>
      </Reveal>

      <RevealGroup as="ul" className="mt-14 border-t border-line" stagger={0.08}>
        {VALUES.map((v, i) => (
          <RevealItem
            key={v.title}
            as="li"
            y={12}
            className="group grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-3 border-b border-line px-2 py-7 transition-colors duration-[250ms] hover:bg-paper-deep md:grid-cols-[3rem_minmax(0,28%)_1fr] md:items-center md:gap-x-6 md:px-4"
          >
            <span className="font-spline text-[12px] font-medium text-amber-500 transition-colors duration-[250ms] group-hover:text-pine-700 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-familjen text-[1.375rem] font-semibold tracking-[-0.02em] text-pine-900">
                {v.title}
              </h3>
              <p className="mt-2 font-spline text-[12px] font-medium uppercase tracking-[0.12em] text-ink-muted">
                {v.tagline}
              </p>
            </div>
            <p className="col-span-2 text-[1rem] leading-[1.65] text-ink-muted md:col-span-1">
              {v.body}
            </p>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
