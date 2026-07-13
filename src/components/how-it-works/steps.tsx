"use client";

/* §2.2 — The four steps. NOT four cards: a vertical editorial timeline on
   paper-deep, one generous row per step. A single continuous 1px rule runs
   down the left gutter (desktop) with an 8px pine square node per step that
   fills amber when the step crosses the viewport center — the same signal
   the hero's mini-timeline listens to. Right side: flat UI vignettes in the
   shared 16px window frame; step 02 reuses the homepage calendar demo
   (single week) and is the only vignette with the soft shadow. */

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { ArrowDownToLine, Check } from "lucide-react";
import {
  Section,
  SectionEyebrow,
  SplitButton,
} from "@/components/site/primitives";
import { EASE, Reveal } from "@/components/site/reveal";
import { WindowFrame } from "@/components/site/window-frame";
import { CalendarGrid, useDemoLoop } from "@/components/site/calendar-demo";
import { STEPS } from "./steps-data";
import { useStepScroll } from "./steps-context";

/* instrument-style time-cost tag: a 16px rule segment + mono text on a
   1px top rule — deliberately not a pill */
function TimeTag({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-7 w-fit border-t border-line pr-10 pt-3">
      <span className="flex items-center gap-2.5 font-spline text-[12px] font-medium text-pine-700 tabular-nums">
        <span className="h-px w-4 bg-pine-700" aria-hidden />
        {children}
      </span>
    </div>
  );
}

/* ---------- step visuals ---------- */

const PITCHES: [string, string, string][] = [
  ["A-12", "Lakeside", "assigned"],
  ["A-13", "Lakeside", "assigned"],
  ["B-01", "Forest edge", "assigned"],
  ["B-02", "Forest edge", "—"],
];

function PitchListVignette() {
  return (
    <WindowFrame
      titleLeft="Pakkia — Pitches · Lakeside"
      titleRight="Set-up"
      shadow={false}
      ariaLabel="The set-up screen: a short list of pitches with their areas and holder assignments, and an add-pitch button."
    >
      <div className="px-5">
        {PITCHES.map(([id, area, status]) => (
          <div
            key={id}
            className="flex items-baseline justify-between gap-4 border-b border-line py-3.5 font-spline font-medium last:border-b-0"
          >
            <span className="text-[13px] text-ink-900 tabular-nums">
              {id} · {area}
            </span>
            <span className="text-[11px] text-ink-muted">{status}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-line px-5 py-4">
        <SplitButton compact>Add pitch</SplitButton>
      </div>
    </WindowFrame>
  );
}

function WeekVignette() {
  const { active, bumped } = useDemoLoop();
  return (
    <WindowFrame
      titleLeft="Pakkia — Pitch A-12 · Lakeside"
      titleRight="June 2026"
      ariaLabel="One week of the pitch calendar: a nightly guest count per day, with one day ticking up as a night is logged."
    >
      <div className="p-4 sm:p-5">
        <CalendarGrid active={active} bumped={bumped} weekOnly />
      </div>
    </WindowFrame>
  );
}

function CountUp({ target }: { target: number }) {
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

  const value = reduce ? target : display;
  return <span ref={ref}>{value.toLocaleString("en-US")}</span>;
}

const TOTALS = [
  { label: "Pitch A-12", value: 112 },
  { label: "June", value: 1284 },
  { label: "Season", value: 4913 },
];

function TotalsVignette() {
  return (
    <WindowFrame
      titleLeft="Pakkia — Totals · Lakeside"
      titleRight="Season 2026"
      shadow={false}
      ariaLabel="Totals rolling up on their own: 112 nights on pitch A-12, 1,284 in June, 4,913 for the season — every entry timestamped in the audit trail."
    >
      <div className="px-5">
        {TOTALS.map((t) => (
          <div
            key={t.label}
            className="flex items-baseline justify-between gap-4 border-b border-line py-3.5 last:border-b-0"
          >
            <span className="font-spline text-[13px] font-medium text-ink-muted">
              {t.label}
            </span>
            <span className="font-spline text-[16px] font-medium text-pine-900 tabular-nums">
              <CountUp target={t.value} />
            </span>
          </div>
        ))}
      </div>
      {/* faded audit line */}
      <div className="border-t border-line px-5 py-3">
        <span className="font-spline text-[11px] font-medium text-ink-muted tabular-nums">
          21:34 · +4 · staff
        </span>
      </div>
    </WindowFrame>
  );
}

const FILES = ["statistics-finland-june.csv", "board-report-june.pdf"];

function ExportVignette() {
  return (
    <WindowFrame
      titleLeft="Pakkia — Exports"
      titleRight="June 2026"
      shadow={false}
      ariaLabel="The export screen: a Statistics Finland CSV and a board PDF ready to download, filed on 2 July 2026."
    >
      <div className="px-5">
        {FILES.map((f) => (
          <div
            key={f}
            className="flex items-center justify-between gap-4 border-b border-line py-3.5 last:border-b-0"
          >
            <span className="truncate font-spline text-[13px] font-medium text-ink-900">
              {f}
            </span>
            <ArrowDownToLine
              size={16}
              strokeWidth={1.5}
              className="shrink-0 text-pine-700"
            />
          </div>
        ))}
      </div>
      <div className="border-t border-line px-5 py-3">
        <span className="flex items-center gap-2 font-spline text-[12px] font-medium text-pine-700 tabular-nums">
          <Check size={12} strokeWidth={2.5} />
          Filed · 02.07.2026
        </span>
      </div>
    </WindowFrame>
  );
}

const VIGNETTES = [
  PitchListVignette,
  WeekVignette,
  TotalsVignette,
  ExportVignette,
];

/* ---------- step row ---------- */

function StepRow({ index }: { index: number }) {
  const step = STEPS[index];
  const ref = useRef<HTMLDivElement>(null);
  /* a 10%-tall band around the viewport center */
  const centered = useInView(ref, { margin: "-45% 0px -45% 0px" });
  const { setActive } = useStepScroll();

  useEffect(() => {
    if (centered) setActive(index);
  }, [centered, index, setActive]);

  const Vignette = VIGNETTES[index];

  return (
    <div
      ref={ref}
      id={step.id}
      className="relative scroll-mt-28 py-12 lg:grid lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-20"
    >
      {/* gutter node — fills amber while the step holds the viewport center */}
      <span
        className={`absolute left-[-52px] top-1/2 hidden h-2 w-2 -translate-y-1/2 transition-colors duration-[250ms] lg:block ${
          centered ? "bg-amber-500" : "bg-pine-700"
        }`}
        aria-hidden
      />

      <Reveal className="lg:col-span-5">
        <div className="font-spline text-[12px] font-medium uppercase tracking-[0.12em] text-amber-500 tabular-nums">
          Step {step.number}
        </div>
        <h3 className="mt-4 font-familjen text-[1.5rem] font-semibold leading-[1.2] tracking-[-0.02em] text-pine-900">
          {step.title}
        </h3>
        <p className="mt-3 max-w-[32rem] text-[1rem] leading-[1.65] text-ink-muted">
          {step.body}
        </p>
        <TimeTag>{step.time}</TimeTag>
      </Reveal>

      <Reveal delay={0.12} className="mt-10 lg:col-span-7 lg:mt-0">
        <Vignette />
      </Reveal>
    </div>
  );
}

export default function Steps() {
  return (
    <Section bg="paper-deep" id="process" padding="py-24 md:py-28">
      <Reveal>
        <SectionEyebrow number="02" label="The process" />
        <h2 className="sr-only">The process</h2>
      </Reveal>

      <div className="relative mt-6 lg:pl-14">
        {/* the single continuous gutter rule */}
        <span
          className="absolute bottom-2 left-[7.5px] top-2 hidden w-px bg-line lg:block"
          aria-hidden
        />
        {STEPS.map((s, i) => (
          <StepRow key={s.id} index={i} />
        ))}
      </div>
    </Section>
  );
}
