"use client";

/* §2.1 — Hero. 7/5 split like the homepage hero, but the right column is
   functional instead of decorative: a vertical mini-timeline of the four
   steps, connected by a 1px rule, synced to the scroll position of §2.2 —
   the in-view step's number turns amber. Hidden on mobile. */

import {
  HomeContainer,
  SectionEyebrow,
  SplitButton,
  UnderlineLink,
} from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { STEPS } from "./steps-data";
import { useStepScroll } from "./steps-context";

function MiniTimeline() {
  const { active } = useStepScroll();
  return (
    <nav aria-label="The four steps" className="relative">
      {/* the connecting rule; step numbers sit on top of it on paper */}
      <span
        className="absolute bottom-5 left-[7px] top-5 w-px bg-line"
        aria-hidden
      />
      <ol className="relative">
        {STEPS.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="group flex items-baseline gap-5 py-3"
            >
              <span
                className={`relative shrink-0 bg-paper py-1 font-spline text-[12px] font-medium tabular-nums transition-colors duration-[250ms] ${
                  active === i ? "text-amber-500" : "text-pine-700"
                }`}
              >
                {s.number}
              </span>
              <span className="text-[0.9375rem] font-medium leading-snug text-ink-900 transition-colors duration-200 group-hover:text-pine-700">
                {s.title}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default function HowHero() {
  return (
    <section className="bg-paper pb-24 pt-14 md:pt-20">
      <HomeContainer>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <RevealGroup className="lg:col-span-7">
            <RevealItem>
              <SectionEyebrow number="01" label="How it works" />
            </RevealItem>
            <RevealItem
              as="h1"
              className="mt-7 max-w-[16ch] font-familjen text-[clamp(2.6rem,5.5vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-pine-900"
            >
              <span className="text-amber-500">Four steps</span> from set-up
              to a filed report.
            </RevealItem>
            <RevealItem
              as="p"
              className="mt-6 max-w-[36rem] text-[1.0625rem] leading-[1.65] text-ink-muted"
            >
              The hard part — totals, formatting, traceability — happens on
              its own. Your team only ever does step two.
            </RevealItem>
            <RevealItem className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <SplitButton href="/signup">Start free</SplitButton>
              <UnderlineLink href="/pricing">See pricing</UnderlineLink>
            </RevealItem>
          </RevealGroup>

          <Reveal
            delay={0.2}
            className="hidden lg:col-span-4 lg:col-start-9 lg:block"
          >
            <MiniTimeline />
          </Reveal>
        </div>
      </HomeContainer>
    </section>
  );
}
