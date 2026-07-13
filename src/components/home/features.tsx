/* Section 06 — What you get (spec §10). Not a card grid: an editorial index
   table. Six full-width rows between hairline rules, with the only icon
   usage on the page right-aligned in each row. */

import {
  Activity,
  CalendarDays,
  FileCheck2,
  ScrollText,
  Smartphone,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Section, SectionEyebrow } from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";

const FEATURES: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: "Calendar entry",
    body: "Tap a day, enter the number of persons. That's the whole task for staff and pitch holders.",
    icon: CalendarDays,
  },
  {
    title: "Live totals",
    body: "Per pitch, day, month and season. Every figure recalculated the moment a number changes.",
    icon: Activity,
  },
  {
    title: "Compliance-ready",
    body: "Exports formatted for Statistics Finland reporting, in CSV and a clean board-ready PDF.",
    icon: FileCheck2,
  },
  {
    title: "Roles & access",
    body: "Admins, staff and pitch holders each see only what they should. Access is enforced, not assumed.",
    icon: Users,
  },
  {
    title: "Audit log",
    body: "Every change recorded: who, what, when. The traceability auditors and boards ask for.",
    icon: ScrollText,
  },
  {
    title: "Works on any phone",
    body: "Add Pakkia to the home screen and it behaves like an app. No install, no app store, no friction.",
    icon: Smartphone,
  },
];

export default function Features() {
  return (
    <Section bg="paper">
      <Reveal className="max-w-[44rem]">
        <SectionEyebrow number="05" label="What you get" />
        <h2 className="mt-7 font-familjen text-[clamp(1.9rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-pine-900">
          Built narrow, on purpose.
        </h2>
        <p className="mt-5 text-[1rem] leading-[1.65] text-ink-muted">
          Not another booking suite. Pakkia does one regulated job — reporting
          overnight stays — and does it cleanly.
        </p>
      </Reveal>

      <RevealGroup as="ul" className="mt-14 border-t border-line" stagger={0.06}>
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <RevealItem
              key={f.title}
              as="li"
              y={12}
              className="group grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-2 border-b border-line px-2 py-6 transition-colors duration-[250ms] hover:bg-paper-deep md:grid-cols-[3rem_minmax(0,30%)_1fr_2.5rem] md:items-center md:gap-x-6 md:px-4"
            >
              <span className="font-spline text-[12px] font-medium text-amber-500 transition-colors duration-[250ms] group-hover:text-pine-700 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-familjen text-[1.25rem] font-semibold tracking-[-0.02em] text-pine-900">
                {f.title}
              </h3>
              <p className="col-span-2 text-[1rem] leading-[1.65] text-ink-muted md:col-span-1">
                {f.body}
              </p>
              <span className="hidden justify-self-end md:block" aria-hidden>
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  className="text-pine-700 transition-transform duration-[250ms] group-hover:-translate-x-0.5"
                />
              </span>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
