"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, StatCard } from "@/components/dashboard/primitives";
import {
  AlertIcon,
  CalendarIcon,
  CheckIcon,
  EditIcon,
  PlusIcon,
  TrendUpIcon,
} from "@/components/dashboard/icons";
import { Rise } from "@/components/motion";
import {
  QuickEntry,
  type QuickEntryTarget,
} from "@/components/power-user/QuickEntry";
import {
  completionPct,
  kpis,
  pendingPitches,
  recentActivity,
  today,
  type FeedKind,
} from "../data";

const FEED_ICON: Record<FeedKind, React.ReactNode> = {
  logged: <CheckIcon size={15} />,
  edited: <EditIcon size={15} />,
  event: <CalendarIcon size={15} />,
};

export default function PowerUserToday() {
  const [entry, setEntry] = useState<QuickEntryTarget | null>(null);

  const openEntry = (target?: Partial<QuickEntryTarget>) =>
    setEntry({
      title: "Log a night",
      pitch: "",
      dateISO: today.dateISO,
      persons: 0,
      ...target,
    });

  return (
    <>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 font-eyebrow text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
            {today.label}
          </p>
          <h1 className="text-[clamp(24px,3vw,30px)] leading-[1.1]">
            Hei, Mikko.
          </h1>
          <p className="mt-2 max-w-[60ch] text-[15px] leading-[1.5] text-secondary">
            {kpis.loggedToday} of {kpis.activePitches} active pitches are logged.{" "}
            {kpis.pendingToday} still need today&apos;s count before reporting
            closes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openEntry()}
          className="inline-flex flex-none items-center gap-2 rounded-[10px] bg-primary px-4 py-2.5 text-[14.5px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.98]"
        >
          <PlusIcon size={18} />
          Quick entry
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          <StatCard
            key="logged"
            label="Logged today"
            value={kpis.loggedToday}
            unit={`/ ${kpis.activePitches}`}
            hint={`${completionPct}% complete`}
          />,
          <StatCard
            key="pending"
            label="Pending today"
            value={kpis.pendingToday}
            icon={<AlertIcon size={18} />}
            hint="Needs entry tonight"
          />,
          <StatCard
            key="persons"
            label="Persons tonight"
            value={kpis.personsTonight}
            hint="Across all pitches"
          />,
          <StatCard
            key="week"
            label="Nights this week"
            value={kpis.weekNights.toLocaleString("en")}
            icon={<TrendUpIcon size={18} />}
            hint={`+${kpis.weekDeltaPct}% vs last week`}
          />,
        ].map((card, i) => (
          <Rise key={i} delay={i * 0.05} y={14}>
            {card}
          </Rise>
        ))}
      </div>

      {/* panels */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        {/* pending */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-[16px] font-semibold">
              Pitches needing today&apos;s entry
            </h2>
            <span className="font-eyebrow text-[10px] font-semibold tracking-[0.1em] text-amber-ink uppercase">
              {pendingPitches.length} pending
            </span>
          </div>
          <ul>
            {pendingPitches.map((p) => (
              <li
                key={p.code}
                className="flex items-center gap-3 border-b border-border px-5 py-3.5 last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-[14.5px] font-semibold text-ink">
                    {p.code}{" "}
                    <span className="font-body text-[13px] font-normal text-muted">
                      · {p.area}
                    </span>
                  </p>
                  <p className="text-[13px] text-secondary">{p.holder}</p>
                </div>
                <span className="hidden rounded-full bg-amber/15 px-2.5 py-1 font-eyebrow text-[10px] font-semibold tracking-[0.06em] text-amber-ink uppercase sm:inline">
                  Missing
                </span>
                <button
                  type="button"
                  onClick={() =>
                    openEntry({
                      title: `Log ${p.code}`,
                      pitch: `${p.code} · ${p.area}`,
                    })
                  }
                  className="rounded-[9px] bg-primary px-3.5 py-2 text-[13.5px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.97]"
                >
                  Enter
                </button>
              </li>
            ))}
          </ul>
        </Card>

        {/* recent activity */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-[16px] font-semibold">Recent entries</h2>
            <span className="inline-flex items-center gap-1.5 font-eyebrow text-[10px] font-semibold tracking-[0.1em] text-primary uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Live
            </span>
          </div>
          <ul className="px-5 py-1.5">
            {recentActivity.map((f) => (
              <li
                key={f.id}
                className="flex items-center gap-3 border-b border-border py-3 last:border-0"
              >
                <span className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-primary-tint text-primary-dark">
                  {FEED_ICON[f.kind]}
                </span>
                <p className="min-w-0 flex-1 text-[13.5px] leading-snug text-ink">
                  <span className="font-semibold">{f.highlight}</span> {f.text}
                </p>
                <span className="flex-none font-eyebrow text-[10px] font-semibold tracking-[0.06em] text-muted uppercase">
                  {f.time}
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t border-border px-5 py-3">
            <Link
              href="/power-user/records"
              className="text-[13px] font-semibold text-primary transition-colors hover:text-primary-dark"
            >
              View all records
            </Link>
          </div>
        </Card>
      </div>

      <QuickEntry
        target={entry}
        onClose={() => setEntry(null)}
        onSave={() => setEntry(null)}
      />
    </>
  );
}
