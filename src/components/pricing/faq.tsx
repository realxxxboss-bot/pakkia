"use client";

/* Pricing §3.4 — FAQ as a ruled accordion list, not accordion cards:
   full-width rows on 1px --line rules, question left, a mono "+" that
   rotates 45° to × when open, answers expanding with a height-auto
   animation. The last two questions are the anxiety-killers — they exist
   to be seen, and link the billing policies inline. */

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Section,
  SectionEyebrow,
  UnderlineLink,
} from "@/components/site/primitives";
import { EASE, Reveal } from "@/components/site/reveal";

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: "Is the free trial really free?",
    a: "Yes — a full month, no card. Set up your site and run a real reporting cycle before you pay.",
  },
  {
    q: "Can I import my spreadsheet?",
    a: "We'll help you bring across pitches and recent history during onboarding, free on every plan.",
  },
  {
    q: "Where is my data stored?",
    a: "On EU infrastructure in the Frankfurt region, with daily backups. It never leaves the EU.",
  },
  {
    q: "What if I outgrow a plan?",
    a: "Move up any time — the change is instant and prorated. No data migration needed.",
  },
  {
    q: "What happens when my free month ends?",
    a: (
      <>
        Nothing is charged automatically — we never took a card. When the
        month is up you choose a plan to keep going; until you do, your site
        simply pauses and your data stays exportable. The details are in our{" "}
        <UnderlineLink href="/subscription-policy">
          Subscription Policy
        </UnderlineLink>
        .
      </>
    ),
  },
  {
    q: "How do I cancel?",
    a: (
      <>
        One click in your account settings — no call, no email thread. Your
        plan runs to the end of the period you&apos;ve paid for, and your data
        export stays available throughout. How yearly payments are handled is
        covered in the <UnderlineLink href="/refunds">Refund Policy</UnderlineLink>
        .
      </>
    ),
  },
];

function FaqRow({
  q,
  a,
  index,
}: {
  q: string;
  a: React.ReactNode;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const panelId = `pricing-faq-panel-${index}`;

  return (
    <div>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span className="font-familjen text-[1.125rem] font-medium tracking-[-0.02em] text-pine-900 transition-colors duration-200 group-hover:text-pine-700">
            {q}
          </span>
          {/* reduced motion swaps the glyph instead of rotating it */}
          <motion.span
            animate={reduce ? undefined : { rotate: open ? 45 : 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="font-spline text-[1.125rem] font-medium leading-none text-ink-muted transition-colors duration-200 group-hover:text-pine-700"
            aria-hidden
          >
            {reduce && open ? "×" : "+"}
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.3, ease: EASE }
            }
            className="overflow-hidden"
          >
            <p className="max-w-[44rem] pb-6 text-[1rem] leading-[1.65] text-ink-muted">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  return (
    <Section bg="paper">
      <Reveal className="max-w-[44rem]">
        <SectionEyebrow number="03" label="Questions, answered." />
        <h2 className="mt-7 font-familjen text-[clamp(1.9rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-pine-900">
          Questions, answered.
        </h2>
      </Reveal>
      <Reveal delay={0.1} className="mt-12 border-y border-line divide-y divide-line">
        {FAQ.map((item, i) => (
          <FaqRow key={item.q} q={item.q} a={item.a} index={i} />
        ))}
      </Reveal>
    </Section>
  );
}
