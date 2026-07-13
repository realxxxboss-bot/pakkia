"use client";

/* ------------------------------------------------------------------
   HeatGrid (PORTAL_SPEC B3.4 "Nightly heat view" — the signature screen).
   A ledger-framed grid: sticky first column (entity + secondary line), one
   column per day, cells = the shared HeatCell, a --paper-deep row-total
   column, and a hover tooltip (--pine-900, mono). Horizontal scroll keeps the
   pitch column pinned on small screens.

   Values are (number | null)[]: null = the holder never logged that night, so
   the cell renders the hatched UNLOGGED state — the state this product exists
   to make visible.
------------------------------------------------------------------ */

import type { ReactNode } from "react";
import { HeatCell } from "./HeatCell";

export type HeatGridRow = {
  key: string;
  label: string;
  secondary?: ReactNode;
  values: (number | null)[];
};

export function HeatGrid({
  rows,
  dayLabels,
  monthLabel,
  header,
  todayIndex,
  eventIndexes,
  caption,
}: {
  rows: HeatGridRow[];
  /** One label per column, e.g. ["1","2",…,"19"]. */
  dayLabels: string[];
  /** Spoken month for tooltips + aria-labels, e.g. "Jun". */
  monthLabel: string;
  header?: ReactNode;
  todayIndex?: number;
  eventIndexes?: ReadonlySet<number>;
  caption: string;
}) {
  const total = (v: (number | null)[]) => v.reduce<number>((s, x) => s + (x ?? 0), 0);

  return (
    <div className="overflow-hidden rounded-[12px] border border-line bg-paper">
      {header && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper-deep px-5 py-3">
          {header}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-line bg-paper-deep">
              <th
                scope="col"
                className="sticky left-0 z-10 border-r border-line bg-paper-deep px-5 py-3 text-left font-spline text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted"
              >
                Pitch
              </th>
              {dayLabels.map((d, i) => (
                <th
                  key={d}
                  scope="col"
                  className={`px-1 py-3 text-center font-spline text-[11px] font-medium tabular-nums ${
                    i === todayIndex ? "text-amber-deep" : "text-ink-muted"
                  }`}
                >
                  {d}
                </th>
              ))}
              <th
                scope="col"
                className="border-l border-line px-4 py-3 text-right font-spline text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted"
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-line last:border-0">
                <th
                  scope="row"
                  className="sticky left-0 z-10 border-r border-line bg-paper px-5 py-2 text-left align-middle"
                >
                  <span className="block font-spline text-[0.9375rem] font-medium text-ink-900">
                    {row.label}
                  </span>
                  {row.secondary && (
                    <span className="block truncate font-spline text-[12px] text-ink-muted">
                      {row.secondary}
                    </span>
                  )}
                </th>

                {row.values.map((v, i) => (
                  <td key={i} className="px-1 py-2 align-middle">
                    <span className="group relative grid place-items-center">
                      <HeatCell
                        value={v}
                        unlogged={v == null}
                        event={eventIndexes?.has(i)}
                        label={`${row.label}, ${dayLabels[i]} ${monthLabel}, ${
                          v == null ? "not logged" : `${v} persons`
                        }`}
                        className="transition-[outline-color] group-hover:outline group-hover:outline-1 group-hover:outline-pine-900 group-hover:outline-offset-[-1px]"
                      />
                      <span
                        role="tooltip"
                        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-[6px] bg-pine-900 px-2 py-1 font-spline text-[12px] text-cream group-hover:block"
                      >
                        {row.label} · {dayLabels[i]} {monthLabel} ·{" "}
                        {v == null ? "unlogged" : `${v} persons`}
                      </span>
                    </span>
                  </td>
                ))}

                <td className="border-l border-line bg-paper-deep px-4 py-2 text-right font-spline font-medium tabular-nums text-ink-900">
                  {total(row.values)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
