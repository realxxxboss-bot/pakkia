"use client";

/* Section 04 — The interface (spec §8). The app mockup is the centerpiece:
   a calendar heat-map in a quiet window frame, with a ~5s looping demo where
   one cell gets an amber outline, its value ticks up a tier and the monthly
   total follows. */

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  Section,
  SectionEyebrow,
  SplitButton,
  UnderlineLink,
} from "./primitives";
import { Reveal } from "./reveal";

/* June 2026 starts on a Monday: 30 days, no leading blanks.
   Values sum to 112 — the total shown in the bar below. */
const JUNE: number[] = [
  2, 1, 3, 2, 5, 8, 6,
  1, 0, 3, 4, 6, 9, 7,
  2, 1, 2, 3, 5, 7, 4,
  0, 1, 2, 3, 4, 8, 5,
  3, 5,
];
const BASE_TOTAL = 112;
const DEMO_INDEX = 9; // June 10 — ticks 3 → 4, crossing into the next tier
const DEMO_WEEK = 1; // the week row kept visible on mobile
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function tierClasses(v: number) {
  if (v === 0) return "border border-line text-ink-muted";
  if (v <= 3) return "bg-pine-100 text-pine-900";
  if (v <= 6) return "bg-[#9DBFB0] text-pine-900";
  return "bg-pine-700 text-cream";
}

function useDemoLoop() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);
  const [bumped, setBumped] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      setActive(true);
      timeouts.push(setTimeout(() => setBumped(true), 600));
      timeouts.push(
        setTimeout(() => {
          setActive(false);
          setBumped(false);
        }, 3600)
      );
    };
    const first = setTimeout(run, 1500);
    const interval = setInterval(run, 5000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, [reduce]);

  return { active, bumped };
}

function CalendarMockup() {
  const { active, bumped } = useDemoLoop();
  const total = BASE_TOTAL + (bumped ? 1 : 0);

  return (
    <div
      role="img"
      aria-label="The Pakkia calendar for pitch A-12 in June 2026: one nightly guest count per day, 112 nights this month, with a one-click report export."
      className="overflow-hidden rounded-[16px] border border-line bg-paper shadow-soft"
    >
      <div aria-hidden>
        {/* slim title bar — no traffic-light dots */}
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 font-spline text-[12px] font-medium">
          <span className="truncate text-ink-900">
            Pakkia — Pitch A-12 · Lakeside
          </span>
          <span className="shrink-0 text-ink-muted tabular-nums">June 2026</span>
        </div>

        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-7 gap-1.5">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="pb-1 text-center font-spline text-[11px] font-medium text-ink-muted"
              >
                {d}
              </div>
            ))}
            {JUNE.map((v, i) => {
              const isDemo = i === DEMO_INDEX;
              const value = isDemo && bumped ? v + 1 : v;
              const week = Math.floor(i / 7);
              return (
                <div
                  key={i}
                  className={`h-9 items-center justify-center rounded-[6px] font-spline text-[12px] font-medium tabular-nums transition-colors duration-300 sm:h-10 ${tierClasses(
                    value
                  )} ${
                    isDemo && active
                      ? "outline outline-1 outline-offset-2 outline-amber-500"
                      : ""
                  } ${week === DEMO_WEEK ? "flex" : "hidden sm:flex"}`}
                >
                  {value}
                </div>
              );
            })}
          </div>
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
      </div>
    </div>
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
