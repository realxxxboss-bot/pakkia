"use client";

/* ------------------------------------------------------------------
   Heat cells (PORTAL_SPEC A2 "Heat cells") — the ONE heat scale shared by
   the marketing mockup, the holder calendar, and the staff heat view.
   0 = --paper + 1px --line; 1–3 = --pine-100; 4–6 = #9DBFB0 (heat-mid);
   7+ = --pine-700 with --cream numeral. Event days get a 2px --amber
   bottom rule; today a 1px --amber outline; unlogged past days a hatch.
   Numerals always mono; every cell carries an aria-label (Part C.8).
------------------------------------------------------------------ */

import type { ReactNode } from "react";

export function heatTier(n: number): 0 | 1 | 2 | 3 {
  if (n <= 0) return 0;
  if (n <= 3) return 1;
  if (n <= 6) return 2;
  return 3;
}

const TIER_BG = [
  "bg-paper border border-line text-ink-900",
  "bg-pine-100 text-pine-900",
  "bg-[var(--color-heat-mid)] text-pine-900",
  "bg-pine-700 text-cream",
];

export function HeatCell({
  value,
  label,
  size = 28,
  today = false,
  event = false,
  unlogged = false,
  future = false,
  highlighted = false,
  display,
  onClick,
  className = "",
}: {
  /** null renders an empty/unlogged shell (use with `unlogged` or `future`). */
  value: number | null;
  label: string;
  /** Fixed square size in px. Pass null to size the cell from `className`
      instead (the month calendar stretches its cells to the grid column). */
  size?: number | null;
  today?: boolean;
  event?: boolean;
  unlogged?: boolean;
  future?: boolean;
  /** Transient amber outline — e.g. the day cells of the event row being
      hovered in the staff Events list (B3.3). Same mark as `today`. */
  highlighted?: boolean;
  /** Overrides the numeral shown, while `value` still drives the heat tier —
      the events calendar shows date numbers on cells that carry no counts. */
  display?: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const tier = value == null ? 0 : heatTier(value);
  const base = unlogged
    ? "heat-hatch border border-line text-ink-muted"
    : future
      ? "bg-paper border border-line text-ink-muted opacity-60"
      : TIER_BG[tier];

  const cls = `relative grid place-items-center rounded-[6px] font-spline tabular-nums text-[13px] ${base} ${
    today || highlighted ? "outline outline-1 outline-amber-500 outline-offset-[-1px]" : ""
  } ${onClick && !future ? "cursor-pointer transition-transform hover:scale-[1.04] motion-reduce:hover:scale-100" : ""} ${className}`;

  const style = size == null ? undefined : { width: size, height: size };
  const content = (
    <>
      {display ?? (value != null && !unlogged ? value : "")}
      {event && (
        <span
          className="absolute inset-x-1 bottom-[3px] h-[2px] rounded-full bg-amber-500"
          aria-hidden
        />
      )}
    </>
  );

  if (onClick && !future) {
    return (
      <button type="button" onClick={onClick} aria-label={label} style={style} className={cls}>
        {content}
      </button>
    );
  }
  return (
    <div role="img" aria-label={label} style={style} className={cls}>
      {content}
    </div>
  );
}

export function HeatLegend({
  today = true,
  event = true,
  children,
}: {
  /** Drop the marks the surface doesn't actually use — the staff heat view has
      no today outline, so advertising one would be a lie. */
  today?: boolean;
  event?: boolean;
  children?: ReactNode;
}) {
  const Swatch = ({ cls }: { cls: string }) => (
    <span className={`size-3.5 rounded-[3px] ${cls}`} aria-hidden />
  );
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-spline text-[11px] text-ink-muted">
      <span className="flex items-center gap-1.5">
        FEWER
        <Swatch cls="bg-paper border border-line" />
        <Swatch cls="bg-pine-100" />
        <Swatch cls="bg-[var(--color-heat-mid)]" />
        <Swatch cls="bg-pine-700" />
        MORE
      </span>
      {today && (
        <span className="flex items-center gap-1.5">
          <span className="size-3.5 rounded-[3px] outline outline-1 outline-amber-500 outline-offset-[-1px]" aria-hidden />
          TODAY
        </span>
      )}
      {event && (
        <span className="flex items-center gap-1.5">
          <span className="relative size-3.5 rounded-[3px] border border-line" aria-hidden>
            <span className="absolute inset-x-0.5 bottom-[2px] h-[2px] rounded-full bg-amber-500" />
          </span>
          EVENT
        </span>
      )}
      <span className="flex items-center gap-1.5">
        <Swatch cls="heat-hatch border border-line" />
        UNLOGGED
      </span>
      {children}
    </div>
  );
}

/* Horizontal segmented bar — replaces donut/plan-mix charts (A2 "Charts").
   One 8px bar of pine-700 / pine-100 / amber segments + a ruled legend. */
export type Segment = { label: string; count: number; tone: "pine" | "tint" | "amber" };

const SEG_BG: Record<Segment["tone"], string> = {
  pine: "bg-pine-700",
  tint: "bg-pine-100",
  amber: "bg-amber-500",
};

export function SegmentedBar({
  segments,
  legendTag,
}: {
  segments: Segment[];
  legendTag?: string;
}) {
  const total = segments.reduce((s, x) => s + x.count, 0) || 1;
  return (
    <div>
      <div className="flex h-2 overflow-hidden rounded-[4px]" role="img" aria-label="Plan mix">
        {segments.map((s) => (
          <span
            key={s.label}
            className={SEG_BG[s.tone]}
            style={{ width: `${(s.count / total) * 100}%` }}
          />
        ))}
      </div>
      <ul className="mt-4 flex flex-col">
        {segments.map((s) => (
          <li
            key={s.label}
            className="flex items-center gap-2.5 border-b border-line py-2 text-[0.875rem] last:border-0"
          >
            <span className={`size-2.5 flex-none rounded-[3px] ${SEG_BG[s.tone]}`} aria-hidden />
            <span className="flex-1 text-ink-900">{s.label}</span>
            <span className="font-spline tabular-nums text-ink-muted">{s.count}</span>
          </li>
        ))}
      </ul>
      {legendTag && (
        <p className="mt-3 font-spline text-[11px] uppercase tracking-[0.1em] text-ink-muted">
          {legendTag}
        </p>
      )}
    </div>
  );
}

/* Inline occupancy bar (PORTAL_SPEC B2.1 §4, reused by the staff report's
   Occupancy cell in B3.5) — an 8px track in --paper-deep with a 1px --line
   border, filled --pine-700 to the percentage. Never a chart. */
export function OccupancyBar({
  pct,
  className = "",
}: {
  pct: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-block h-2 overflow-hidden rounded-[2px] border border-line bg-paper-deep align-middle ${className}`}
      aria-hidden
    >
      <span
        className="block h-full bg-pine-700"
        style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
      />
    </span>
  );
}
