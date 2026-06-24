"use client";

import { useState } from "react";
import { Card, PageHeader } from "@/components/dashboard/primitives";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@/components/dashboard/icons";
import { EntrySheet, type EntryTarget } from "@/components/pitch-holder/EntrySheet";
import {
  eventDays,
  heatLevel,
  juneDays,
  monthTotals,
  today,
  type DayEntry,
} from "../data";

const DOW = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const CELL_STYLES: Record<string, string> = {
  future: "bg-surface ring-1 ring-inset ring-border text-muted hover:ring-border-strong",
  empty: "bg-subtle text-muted hover:bg-container",
  "1": "bg-occ-1 text-primary-dark hover:brightness-[0.98]",
  "2": "bg-occ-2 text-primary-dark hover:brightness-[0.98]",
  "3": "bg-occ-3 text-white hover:brightness-[0.97]",
};

export default function PitchHolderCalendar() {
  const [target, setTarget] = useState<EntryTarget | null>(null);

  const openDay = (d: DayEntry) =>
    setTarget({
      key: `d-${d.day}`,
      title: `${d.day} June 2026`,
      persons: d.persons ?? 0,
    });

  return (
    <>
      <PageHeader
        title="Calendar"
        subtitle="Your pitch A-07. Tap any day to enter or edit the number of persons who stayed."
      />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <Card className="p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-heading text-[19px] font-semibold">June 2026</h2>
            <div className="flex gap-2">
              <NavButton label="Previous month">
                <ChevronLeftIcon size={18} />
              </NavButton>
              <NavButton label="Next month">
                <ChevronRightIcon size={18} />
              </NavButton>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {DOW.map((d) => (
              <div
                key={d}
                className="pb-1 text-center font-eyebrow text-[10px] font-semibold tracking-[0.05em] text-muted uppercase"
              >
                {d}
              </div>
            ))}
            {juneDays.map((d) => {
              const lvl = String(heatLevel(d.persons));
              const isToday = d.day === today.day;
              const hasEvent = eventDays.has(d.day);
              return (
                <button
                  key={d.day}
                  type="button"
                  onClick={() => openDay(d)}
                  aria-label={`${d.day} June, ${
                    d.persons === null
                      ? "no entry yet"
                      : `${d.persons} persons`
                  }`}
                  className={`nums relative flex aspect-square flex-col items-end justify-between rounded-[10px] p-2 transition-[box-shadow,background-color,filter] duration-150 ease-[var(--ease-out)] focus-visible:outline-2 ${
                    CELL_STYLES[lvl]
                  } ${
                    isToday ? "outline outline-2 outline-amber outline-offset-2" : ""
                  }`}
                >
                  <span className="absolute left-2 top-1.5 font-body text-[11px] font-medium opacity-70">
                    {d.day}
                  </span>
                  {hasEvent && (
                    <span
                      className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-amber"
                      aria-hidden
                    />
                  )}
                  <span className="mt-auto font-heading text-[18px] font-semibold leading-none">
                    {d.persons !== null && d.persons > 0 ? d.persons : ""}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <p className="font-eyebrow text-[10px] font-semibold tracking-[0.1em] text-muted uppercase">
            Person-nights · June
          </p>
          <p className="nums mt-1.5 font-mono text-[34px] font-semibold tracking-[-0.02em] text-primary">
            {monthTotals.personNights}
          </p>

          <button
            type="button"
            onClick={() =>
              setTarget({
                key: `d-${today.day}`,
                title: `Tonight · ${today.day} June`,
                persons: 0,
              })
            }
            className="group mt-5 flex w-full items-center justify-center gap-2.5 rounded-[12px] bg-primary px-5 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.99]"
          >
            <PlusIcon size={19} />
            Log tonight
          </button>

          <div className="mt-6 border-t border-border pt-5">
            <p className="mb-3 font-eyebrow text-[10px] font-semibold tracking-[0.1em] text-muted uppercase">
              Legend
            </p>
            <div className="flex items-center gap-2 text-[12.5px] text-secondary">
              <span>Fewer</span>
              <span className="h-4 w-4 rounded-[5px] bg-occ-1" />
              <span className="h-4 w-4 rounded-[5px] bg-occ-2" />
              <span className="h-4 w-4 rounded-[5px] bg-occ-3" />
              <span>More</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-secondary">
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-[5px] outline outline-2 outline-amber outline-offset-[-2px]" />
                Today
              </span>
              <span className="flex items-center gap-2">
                <span className="relative h-4 w-4 rounded-[5px] bg-subtle">
                  <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-amber" />
                </span>
                Event day
              </span>
            </div>
          </div>
        </Card>
      </div>

      <EntrySheet
        target={target}
        onClose={() => setTarget(null)}
        onSave={() => setTarget(null)}
      />
    </>
  );
}

function NavButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-[9px] text-secondary ring-1 ring-border transition-colors duration-150 hover:bg-subtle hover:text-primary"
    >
      {children}
    </button>
  );
}
