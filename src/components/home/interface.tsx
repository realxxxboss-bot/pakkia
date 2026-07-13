"use client";

/* Section 04 — The interface (spec §8). The app mockup is the centerpiece:
   a calendar heat-map in a quiet window frame, with a ~5s looping demo where
   one cell gets an amber outline, its value ticks up a tier and the monthly
   total follows. The frame and calendar live in components/site so the
   How-it-works step vignettes reuse them. */

import {
  Section,
  SectionEyebrow,
  SplitButton,
  UnderlineLink,
} from "@/components/site/primitives";
import { WindowFrame } from "@/components/site/window-frame";
import {
  BASE_TOTAL,
  CalendarGrid,
  useDemoLoop,
} from "@/components/site/calendar-demo";
import { Reveal } from "@/components/site/reveal";

function CalendarMockup() {
  const { active, bumped } = useDemoLoop();
  const total = BASE_TOTAL + (bumped ? 1 : 0);

  return (
    <WindowFrame
      titleLeft="Pakkia — Pitch A-12 · Lakeside"
      titleRight="June 2026"
      ariaLabel="The Pakkia calendar for pitch A-12 in June 2026: one nightly guest count per day, 112 nights this month, with a one-click report export."
    >
      <div className="p-4 sm:p-5">
        <CalendarGrid active={active} bumped={bumped} />
      </div>

      {/* totals bar */}
      <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-4">
        <div>
          <div className="font-spline text-[12px] font-medium text-ink-muted">
            Nights this month
          </div>
          <div className="mt-1 font-spline text-[20px] font-medium leading-none text-pine-900 tabular-nums">
            {total}
          </div>
        </div>
        <SplitButton compact>Export report</SplitButton>
      </div>
    </WindowFrame>
  );
}

export default function Interface() {
  return (
    <Section bg="paper">
      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <SectionEyebrow number="03" label="The interface" />
          <h2 className="mt-7 font-familjen text-[clamp(1.9rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-pine-900">
            The whole job is one number a day.
          </h2>
          <p className="mt-5 text-[1rem] leading-[1.65] text-ink-muted">
            Open the pitch calendar, tap a day, enter how many people stayed.
            Pakkia handles the totals, the formatting and the audit trail. No
            training, no manual.
          </p>
          <div className="mt-8">
            <UnderlineLink href="/how-it-works" arrow>
              Walk through it
            </UnderlineLink>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <CalendarMockup />
        </Reveal>
      </div>
    </Section>
  );
}
