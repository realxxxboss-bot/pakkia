"use client";

/* Section 02 — Stats strip (spec §6). Not cards: an editorial data table
   strip between two hairline rules, left-aligned, numbers counting up on
   viewport entry. */

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { HomeContainer } from "@/components/site/primitives";
import { EASE, Reveal } from "@/components/site/reveal";

type Stat = {
  /** rendered before the counted value, e.g. "<" */
  prefix?: string;
  /** rendered after the counted value, e.g. "+", " min" */
  suffix?: string;
  /** numeric target; omit for non-numeric values like "EU" */
  value?: number;
  /** literal value when there is nothing to count */
  literal?: string;
  label: string;
  amber?: boolean;
};

const STATS: Stat[] = [
  { prefix: "<", value: 200, label: "campsites in Finland" },
  { value: 20, suffix: "+", label: "beds = reporting duty" },
  { literal: "EU", label: "data residency", amber: true },
  { value: 5, suffix: " min", label: "to a monthly report" },
];

function CountUp({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, target, {
      duration: 0.6,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, target]);

  // Reduced motion: skip the count-up and show the target directly.
  const value = reduce ? target : display;
  return (
    <span ref={ref}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

export default function StatsStrip() {
  return (
    <section className="bg-paper pb-24 md:pb-32">
      <HomeContainer>
        <Reveal>
          <div className="grid grid-cols-2 border-y border-line md:grid-cols-4">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`py-8 pr-4 md:px-8 ${
                  i === 0 ? "md:pl-0" : "md:border-l md:border-line"
                }`}
              >
                <div
                  className={`font-spline text-[2.25rem] font-medium leading-none tabular-nums ${
                    s.amber ? "text-amber-500" : "text-pine-900"
                  }`}
                >
                  {s.value !== undefined ? (
                    <CountUp target={s.value} prefix={s.prefix} suffix={s.suffix} />
                  ) : (
                    s.literal
                  )}
                </div>
                <div className="mt-3 font-spline text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </HomeContainer>
    </section>
  );
}
