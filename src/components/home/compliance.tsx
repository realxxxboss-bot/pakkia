"use client";

/* Section 05 — Compliance (spec §9). Plain pine-900, a two-column definition
   list with amber index letters, and a narrow flat audit-log column whose
   rows cycle with a slow fade. */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Section, SectionEyebrow } from "./primitives";
import { Reveal, RevealGroup, RevealItem } from "./reveal";

function Key({ children }: { children: React.ReactNode }) {
  return <span className="text-amber-500">{children}</span>;
}

const POINTS: { index: string; body: React.ReactNode }[] = [
  {
    index: "A.",
    body: (
      <>
        Every export maps to the figures <Key>Statistics Finland</Key> actually
        collects.
      </>
    ),
  },
  {
    index: "B.",
    body: (
      <>
        A timestamped <Key>audit trail</Key> on every entry and every edit.
      </>
    ),
  },
  {
    index: "C.",
    body: (
      <>
        Data hosted in the EU — in <Key>Frankfurt</Key> — and never leaves the
        bloc.
      </>
    ),
  },
  {
    index: "D.",
    body: (
      <>
        CSV for filing, a clean PDF for the board, in <Key>one click</Key>.
      </>
    ),
  },
];

const LOG_POOL = [
  "21:34 · Pitch A-12 · 4 persons · edited by staff",
  "21:12 · Pitch B-03 · 2 persons · logged by holder",
  "20:58 · Pitch C-07 · 5 persons · logged by staff",
  "20:41 · June report · CSV · exported by admin",
  "20:17 · Pitch A-02 · 3 persons · logged by holder",
  "19:55 · Pitch D-01 · 6 persons · edited by staff",
];

function AuditLog() {
  const reduce = useReducedMotion();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const interval = setInterval(
      () => setOffset((o) => (o + 1) % LOG_POOL.length),
      3000
    );
    return () => clearInterval(interval);
  }, [reduce]);

  const rows = [0, 1, 2].map((i) => LOG_POOL[(offset + i) % LOG_POOL.length]);

  return (
    <div aria-hidden>
      <div className="font-spline text-[11px] font-medium uppercase tracking-[0.12em] text-cream-muted">
        Audit log
      </div>
      <div className="mt-3">
        {rows.map((entry) => (
          <motion.div
            key={entry}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="border-b border-line-dark py-3 font-spline text-[12px] font-medium leading-snug text-cream-muted first:border-t tabular-nums"
          >
            {entry}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Compliance() {
  return (
    <Section bg="pine">
      <Reveal className="max-w-[40rem]">
        <SectionEyebrow number="04" label="Compliance, by design" dark />
        <h2 className="mt-7 font-familjen text-[clamp(1.9rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-cream">
          Right by the regulator — without thinking about it.
        </h2>
        <p className="mt-5 text-[1rem] leading-[1.65] text-cream-muted">
          Compliance isn&apos;t a feature bolted on the side. It&apos;s the
          reason Pakkia exists. Log the nights and the obligation takes care of
          itself.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-16">
        <RevealGroup className="grid gap-10 sm:grid-cols-2 lg:col-span-8">
          {POINTS.map((p) => (
            <RevealItem key={p.index} className="group">
              <div className="font-spline text-[12px] font-medium text-amber-500">
                {p.index}
              </div>
              <div
                className="mt-3 h-px bg-line-dark transition-colors duration-[250ms] group-hover:bg-amber-500"
                aria-hidden
              />
              <p className="mt-4 text-[1.0625rem] leading-[1.65] text-cream">
                {p.body}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.15} className="lg:col-span-4">
          <AuditLog />
        </Reveal>
      </div>
    </Section>
  );
}
