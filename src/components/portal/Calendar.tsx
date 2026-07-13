"use client";

/* ------------------------------------------------------------------
   MonthCalendar (PORTAL_SPEC A2 "Heat cells" + B3.3 / B4.2) — the one month
   grid, shared by the staff Events screen (read-only variant) and, later, the
   holder logging calendar (interactive variant). Cells are the shared HeatCell,
   so the heat scale, the event underline, the today outline and the unlogged
   hatch are identical everywhere.

   `highlight` paints an amber outline on a set of days — the staff Events list
   uses it to link a hovered event row to its days in the calendar.
------------------------------------------------------------------ */

import type { ReactNode } from "react";
import { HeatCell } from "./HeatCell";

export type CalendarDay = {
  day: number;
  /** Persons logged that night; null = nothing logged. */
  value?: number | null;
  event?: boolean;
  unlogged?: boolean;
  future?: boolean;
  /** Just saved — the 800ms amber-outline flash (B4.2). */
  flash?: boolean;
  /** Saved on this phone, not yet synced — dashed amber outline (B4.2). */
  pending?: boolean;
  /** Extra state for the aria-label, where the cell says it with colour alone
      (Part C.8) — e.g. tonight's cell, which is marked only by the amber
      "today" outline until it's been logged. */
  note?: string;
};

export type CalendarNumerals = "value" | "date";

export function MonthCalendar({
  monthLabel,
  days,
  startOffset,
  dow,
  today,
  highlight,
  onDayClick,
  onPrevMonth,
  onNextMonth,
  cellClassName = "aspect-square w-full",
  numerals = "value",
  footer,
  monthName,
  className = "",
  bodyClassName = "p-4 sm:p-5",
  gapClassName = "gap-1.5",
}: {
  /** Mono month switcher label, e.g. "JUNE 2026". */
  monthLabel: string;
  days: CalendarDay[];
  /** Leading blank cells before day 1 (Monday-first grid). */
  startOffset: number;
  dow: readonly string[];
  today?: number;
  highlight?: ReadonlySet<number>;
  onDayClick?: (day: CalendarDay) => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  cellClassName?: string;
  /** "value" shows the persons logged (holder calendar); "date" shows the day
      number (the staff events calendar, which carries no counts). */
  numerals?: CalendarNumerals;
  footer?: ReactNode;
  /** Spoken month for aria-labels, e.g. "June 2026". */
  monthName?: string;
  /** Frame overrides — the holder calendar bleeds edge-to-edge on phones so
      its touch cells clear 44px on a 375px screen (B4.2). */
  className?: string;
  bodyClassName?: string;
  gapClassName?: string;
}) {
  const arrow =
    "grid size-7 place-items-center rounded-[6px] border border-line font-spline text-[13px] text-ink-muted transition-colors duration-150 hover:bg-paper-deep hover:text-ink-900 disabled:opacity-40 disabled:hover:bg-transparent";

  return (
    <div className={`overflow-hidden rounded-[12px] border border-line bg-paper ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-line bg-paper-deep px-5 py-3">
        <button
          type="button"
          onClick={onPrevMonth}
          disabled={!onPrevMonth}
          aria-label="Previous month"
          className={arrow}
        >
          ‹
        </button>
        <span className="font-spline text-[12px] font-medium uppercase tracking-[0.12em] text-ink-900">
          {monthLabel}
        </span>
        <button
          type="button"
          onClick={onNextMonth}
          disabled={!onNextMonth}
          aria-label="Next month"
          className={arrow}
        >
          ›
        </button>
      </div>

      <div className={bodyClassName}>
        <div className={`grid grid-cols-7 ${gapClassName}`}>
          {dow.map((d) => (
            <div
              key={d}
              className="pb-1 text-center font-spline text-[11px] uppercase tracking-[0.08em] text-ink-muted"
            >
              {d}
            </div>
          ))}

          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`blank-${i}`} aria-hidden />
          ))}

          {days.map((d) => (
            <HeatCell
              key={d.day}
              value={d.value ?? null}
              size={null}
              className={cellClassName}
              today={today === d.day}
              event={d.event}
              unlogged={d.unlogged}
              future={d.future}
              highlighted={highlight?.has(d.day)}
              flash={d.flash}
              pending={d.pending}
              display={numerals === "date" ? d.day : undefined}
              onClick={onDayClick ? () => onDayClick(d) : undefined}
              label={[
                `${d.day} ${monthName ?? monthLabel}`,
                today === d.day ? "today" : null,
                d.unlogged
                  ? "not logged"
                  : d.value != null
                    ? `${d.value} persons`
                    : null,
                d.note,
                d.event ? "event day" : null,
                d.pending ? "saved on this phone, not yet synced" : null,
              ]
                .filter(Boolean)
                .join(", ")}
            />
          ))}
        </div>

        {footer && <div className="mt-4 border-t border-line pt-4">{footer}</div>}
      </div>
    </div>
  );
}
