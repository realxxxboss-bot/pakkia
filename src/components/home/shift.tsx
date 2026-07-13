/* Section 03 — The shift (spec §7). Editorial ledger comparison: a tired,
   boxless spreadsheet list against an offset Pakkia card. */

import { Section, SectionEyebrow } from "@/components/site/primitives";
import { Reveal } from "@/components/site/reveal";

const BEFORE = [
  "One master file, one person who understands it",
  "Totals re-typed by hand at month end",
  "No record of who changed what",
  "Figures reformatted for every report",
];

const AFTER = [
  "Each pitch holder enters their own nights",
  "Totals add up automatically, in real time",
  "A full audit log of every entry and edit",
  "One click to a Statistics Finland-ready export",
];

export default function Shift() {
  return (
    <Section bg="paper-deep">
      <Reveal className="max-w-[44rem]">
        <SectionEyebrow number="02" label="The shift" />
        <h2 className="mt-7 font-familjen text-[clamp(1.9rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-pine-900">
          One fragile spreadsheet, replaced by a single source of truth.
        </h2>
        <p className="mt-5 text-[1rem] leading-[1.65] text-ink-muted">
          Most sites still track nights in a workbook one person owns and
          everyone fears editing. Pakkia keeps the simple habit — enter the
          count — and does the compliance work behind it.
        </p>
      </Reveal>

      <div className="mt-14 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        {/* boxless list, deliberately tired-looking */}
        <Reveal className="opacity-90">
          <h3 className="border-b border-line pb-3 font-spline text-[12px] font-medium uppercase tracking-[0.12em] text-ink-muted">
            Today · the spreadsheet
          </h3>
          <ul>
            {BEFORE.map((item) => (
              <li
                key={item}
                className="flex items-baseline gap-4 border-b border-dashed border-line py-4 text-[1rem] leading-[1.65] text-ink-muted last:border-b-0"
              >
                <span
                  className="font-spline text-[13px] font-medium text-[#A65D45]"
                  aria-hidden
                >
                  ×
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* the one card in this section, offset upward */}
        <Reveal delay={0.15}>
          <div className="rounded-[12px] border border-line bg-paper px-7 py-6 shadow-soft transition-colors duration-300 hover:border-pine-700 lg:mt-[-16px]">
            <h3 className="flex items-center gap-2.5 border-b border-line pb-3 font-spline text-[12px] font-medium uppercase tracking-[0.12em] text-pine-700">
              With Pakkia
              {/* printer's mark, not a badge */}
              <span className="h-2 w-2 bg-amber-500" aria-hidden />
            </h3>
            <ul>
              {AFTER.map((item) => (
                <li
                  key={item}
                  className="flex items-baseline gap-4 border-b border-line py-4 text-[1rem] leading-[1.65] text-ink-900 last:border-b-0 last:pb-1"
                >
                  <span
                    className="font-spline text-[13px] font-medium text-pine-700"
                    aria-hidden
                  >
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
