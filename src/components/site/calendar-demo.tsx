"use client";

/* The calendar heat-map demo from the homepage mockup (spec §8), extracted
   unchanged so the How-it-works step vignettes can reuse it: the June data,
   the value→tier fill scale, the ~5s loop where one cell gets a 1px amber
   outline and ticks up a tier, and the grid itself. `weekOnly` renders just
   the demo week row (the How-it-works "money shot"); the full grid keeps the
   homepage behavior of collapsing to that week on mobile. */

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/* June 2026 starts on a Monday: 30 days, no leading blanks.
   Values sum to 112 — the total shown in the homepage totals bar. */
export const JUNE: number[] = [
  2, 1, 3, 2, 5, 8, 6,
  1, 0, 3, 4, 6, 9, 7,
  2, 1, 2, 3, 5, 7, 4,
  0, 1, 2, 3, 4, 8, 5,
  3, 5,
];
export const BASE_TOTAL = 112;
export const DEMO_INDEX = 9; // June 10 — ticks 3 → 4, crossing into the next tier
export const DEMO_WEEK = 1; // the week row kept visible on mobile / in weekOnly
export const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export function tierClasses(v: number) {
  if (v === 0) return "border border-line text-ink-muted";
  if (v <= 3) return "bg-pine-100 text-pine-900";
  if (v <= 6) return "bg-[#9DBFB0] text-pine-900";
  return "bg-pine-700 text-cream";
}

export function useDemoLoop() {
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

export function CalendarGrid({
  active,
  bumped,
  weekOnly = false,
}: {
  active: boolean;
  bumped: boolean;
  weekOnly?: boolean;
}) {
  return (
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
        const week = Math.floor(i / 7);
        if (weekOnly && week !== DEMO_WEEK) return null;
        const isDemo = i === DEMO_INDEX;
        const value = isDemo && bumped ? v + 1 : v;
        return (
          <div
            key={i}
            className={`h-9 items-center justify-center rounded-[6px] font-spline text-[12px] font-medium tabular-nums transition-colors duration-300 sm:h-10 ${tierClasses(
              value
            )} ${
              isDemo && active
                ? "outline outline-1 outline-offset-2 outline-amber-500"
                : ""
            } ${weekOnly || week === DEMO_WEEK ? "flex" : "hidden sm:flex"}`}
          >
            {value}
          </div>
        );
      })}
    </div>
  );
}
