"use client";

import { useMemo, useState } from "react";
import { Badge, Card, PageHeader } from "@/components/dashboard/primitives";
import { MoreIcon, PlusIcon } from "@/components/dashboard/icons";
import { EventSheet, type NewEvent } from "@/components/power-user/EventSheet";
import { events as seedEvents, type PortalEvent } from "../data";

const DOW = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTH_LABEL: Record<string, string> = {
  "06": "Jun",
};

function fmtRange(from: string, to: string): { range: string; days: number[] } {
  const [, m1, d1] = from.split("-");
  const [, , d2] = to.split("-");
  const start = Number(d1);
  const end = Number(d2);
  const mon = MONTH_LABEL[m1] ?? "Jun";
  const days: number[] = [];
  for (let d = start; d <= Math.max(start, end); d++) days.push(d);
  const range = end > start ? `${start}–${end} ${mon}` : `${start} ${mon}`;
  return { range, days };
}

export default function PowerUserEvents() {
  const [events, setEvents] = useState<PortalEvent[]>(seedEvents);
  const [open, setOpen] = useState(false);

  const highlighted = useMemo(
    () => new Set(events.flatMap((e) => e.days)),
    [events],
  );

  const addEvent = (e: NewEvent) => {
    const { range, days } = fmtRange(e.from, e.to);
    setEvents((prev) => [
      ...prev,
      {
        id: `e${Date.now()}`,
        range,
        days,
        name: e.title.trim() || "Untitled event",
        scope: e.scope as PortalEvent["scope"],
        visible: e.visible,
      },
    ]);
    setOpen(false);
  };

  return (
    <>
      <PageHeader
        title="Events"
        subtitle="Highlight special dates on the calendar — holders see the ones you mark visible when logging nights."
        actions={
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-4 py-2.5 text-[14.5px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.98]"
          >
            <PlusIcon size={18} />
            Add event
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        {/* list */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-[16px] font-semibold">Upcoming &amp; recent</h2>
            <span className="font-eyebrow text-[10px] font-semibold tracking-[0.1em] text-muted uppercase">
              June 2026
            </span>
          </div>
          <ul>
            {events.map((e) => (
              <li
                key={e.id}
                className="flex items-center gap-4 border-b border-border px-5 py-3.5 last:border-0"
              >
                <span className="w-[78px] flex-none border-r border-border pr-3 font-heading text-[13.5px] font-semibold text-primary">
                  {e.range}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14.5px] font-medium text-ink">
                    {e.name}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <Badge tone={e.scope === "Site-wide" ? "primary" : "neutral"}>
                      {e.scope}
                    </Badge>
                    <Badge tone={e.visible ? "success" : "neutral"}>
                      {e.visible ? "Visible" : "Internal"}
                    </Badge>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label={`Manage ${e.name}`}
                  className="grid h-8 w-8 flex-none place-items-center rounded-[9px] text-muted transition-colors duration-150 hover:bg-subtle hover:text-primary"
                >
                  <MoreIcon size={16} />
                </button>
              </li>
            ))}
          </ul>
        </Card>

        {/* mini calendar */}
        <Card className="p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-[17px] font-semibold">June 2026</h2>
            <span className="font-eyebrow text-[10px] font-semibold tracking-[0.1em] text-muted uppercase">
              Highlighted days
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {DOW.map((d) => (
              <div
                key={d}
                className="pb-1 text-center font-eyebrow text-[9.5px] font-semibold tracking-[0.04em] text-muted uppercase"
              >
                {d}
              </div>
            ))}
            {Array.from({ length: 30 }, (_, i) => {
              const day = i + 1;
              const hot = highlighted.has(day);
              return (
                <div
                  key={day}
                  className={`nums relative flex aspect-square items-start justify-end rounded-[9px] p-1.5 text-[12px] ${
                    hot
                      ? "bg-amber/15 font-semibold text-ink ring-1 ring-inset ring-amber/30"
                      : "bg-subtle text-secondary"
                  }`}
                >
                  {day}
                  {hot && (
                    <span
                      className="absolute bottom-1.5 left-1.5 h-1.5 w-1.5 rounded-full bg-amber"
                      aria-hidden
                    />
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-4 flex items-center gap-2 text-[12.5px] text-secondary">
            <span className="relative h-4 w-4 rounded-[5px] bg-amber/15 ring-1 ring-inset ring-amber/30">
              <span className="absolute bottom-0.5 left-0.5 h-1.5 w-1.5 rounded-full bg-amber" />
            </span>
            Event day
          </p>
        </Card>
      </div>

      <EventSheet open={open} onClose={() => setOpen(false)} onSave={addEvent} />
    </>
  );
}
