/* §2.3 — Roles & access. Dark pine section: the three roles as a
   definition-list ledger on 1px --line-dark rules (the homepage compliance
   pattern, not cards), each rule warming to amber on hover, plus a compact
   access-matrix strip of mono ✓ / — glyphs. */

import { Section, SectionEyebrow } from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";

const ROLES = [
  {
    index: "A.",
    name: "Administrator",
    label: "Full control",
    body: "Manages users, pitches, settings and full-site exports across the season.",
  },
  {
    index: "B.",
    name: "Power user",
    label: "Day-to-day",
    body: "Assigns pitches, flags special events, and pulls intermediate reports.",
  },
  {
    index: "C.",
    name: "Pitch holder",
    label: "Just their nights",
    body: "Sees only their own pitch calendar and enters their nightly counts.",
  },
];

const MATRIX_COLS = ["Admin", "Power user", "Pitch holder"];
const MATRIX_ROWS: { label: string; marks: boolean[] }[] = [
  { label: "Pitches", marks: [true, true, true] },
  { label: "Reports", marks: [true, true, false] },
  { label: "Settings", marks: [true, false, false] },
];

function AccessMatrix() {
  return (
    <div>
      <div className="font-spline text-[11px] font-medium uppercase tracking-[0.12em] text-cream-muted">
        Access matrix
      </div>
      <div className="mt-4">
        <div className="grid grid-cols-4 gap-x-4 pb-3">
          <span />
          {MATRIX_COLS.map((c) => (
            <span
              key={c}
              className="font-spline text-[11px] font-medium uppercase tracking-[0.12em] text-cream-muted"
            >
              {c}
            </span>
          ))}
        </div>
        {MATRIX_ROWS.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-4 gap-x-4 border-t border-line-dark py-3"
          >
            <span className="font-spline text-[12px] font-medium text-cream">
              {row.label}
            </span>
            {row.marks.map((ok, i) => (
              <span
                key={i}
                className={`font-spline text-[13px] font-medium ${
                  ok ? "text-cream" : "text-cream-muted"
                }`}
              >
                {ok ? "✓" : "—"}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Roles() {
  return (
    <Section bg="pine">
      <Reveal className="max-w-[40rem]">
        <SectionEyebrow number="03" label="Roles & access" dark />
        <h2 className="mt-7 font-familjen text-[clamp(1.9rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-cream">
          Everyone sees exactly their part.
        </h2>
        <p className="mt-5 text-[1rem] leading-[1.65] text-cream-muted">
          Access is set by role and{" "}
          <span className="text-amber-500">
            enforced at the database level
          </span>
          , so no one can reach another pitch&apos;s — or another
          campsite&apos;s — data.
        </p>
      </Reveal>

      <RevealGroup className="mt-14">
        {ROLES.map((r) => (
          <RevealItem
            key={r.name}
            className="grid gap-x-10 gap-y-2 border-t border-t-line-dark py-7 transition-colors duration-[250ms] hover:border-t-amber-500 last:border-b last:border-b-line-dark md:grid-cols-12"
          >
            <div className="font-spline text-[12px] font-medium text-amber-500 md:col-span-1 md:pt-1.5">
              {r.index}
            </div>
            <div className="md:col-span-4">
              <h3 className="font-familjen text-[1.25rem] font-semibold tracking-[-0.02em] text-cream">
                {r.name}
              </h3>
              <div className="mt-1.5 font-spline text-[12px] font-medium uppercase tracking-[0.12em] text-cream-muted">
                {r.label}
              </div>
            </div>
            <p className="text-[1rem] leading-[1.65] text-cream-muted md:col-span-7">
              {r.body}
            </p>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal delay={0.1} className="mt-16 max-w-[34rem]">
        <AccessMatrix />
      </Reveal>
    </Section>
  );
}
