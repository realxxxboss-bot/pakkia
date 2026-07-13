/* About §1.5 — Who's behind it. One honest paragraph (no invented people,
   no photos) beside a flat fact sheet: a ruled definition list, no card. */

import { Section, SectionEyebrow } from "@/components/site/primitives";
import { Reveal } from "@/components/site/reveal";

const FACTS: { label: string; value: string }[] = [
  { label: "Founded", value: "2026" },
  { label: "Based", value: "Finland" },
  { label: "Hosting", value: "EU · Frankfurt" },
  { label: "Focus", value: "one job, done well" },
];

export default function Team() {
  return (
    <Section bg="paper" padding="pb-24 md:pb-32">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-7">
          <SectionEyebrow number="04" label="Who's behind it" />
          <p className="mt-7 max-w-[38rem] text-[1.0625rem] leading-[1.7] text-ink-muted">
            Pakkia is a small product team working with Finnish site operators,
            with engineering supported by Growth Nexus. When you write to
            support, the people who built the product answer. There are no
            investors pushing for feature bloat — just a narrow tool we intend
            to keep working, season after season.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-5">
          <dl className="border-t border-line">
            {FACTS.map((f) => (
              <div
                key={f.label}
                className="flex items-baseline justify-between gap-6 border-b border-line py-4"
              >
                <dt className="font-spline text-[12px] font-medium uppercase tracking-[0.12em] text-ink-muted">
                  {f.label}
                </dt>
                <dd className="text-right font-spline text-[13px] font-medium text-pine-900 tabular-nums">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
