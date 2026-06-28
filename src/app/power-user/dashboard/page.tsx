"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Card } from "@/components/dashboard/primitives";
import {
  CalendarIcon,
  ChartIcon,
  CheckIcon,
  ChevronRightIcon,
  LinkIcon,
  TentIcon,
  TrendUpIcon,
  UserPlusIcon,
} from "@/components/dashboard/icons";
import {
  assignments,
  dashboardKpis,
  events,
  holderEntries,
  staff,
  today,
  weekTotal,
  weekTrend,
  type Kpi,
} from "../data";

const DELTA_TONE: Record<Kpi["tone"], string> = {
  up: "text-primary",
  warn: "text-amber-ink",
  flat: "text-muted",
};

const KPI_ICON: Record<Kpi["icon"], React.ReactNode> = {
  tent: <TentIcon size={18} />,
  check: <CheckIcon size={18} />,
  link: <LinkIcon size={18} />,
  chart: <ChartIcon size={18} />,
};

function KpiCard({ kpi }: { kpi: Kpi }) {
  return (
    <div className="rounded-[14px] border border-border bg-surface p-5 shadow-xs transition-[transform,box-shadow] duration-200 ease-[var(--ease-out)] hover:-translate-y-0.5 hover:shadow-sm motion-reduce:hover:translate-y-0">
      <div className="flex items-start justify-between gap-3">
        <p className="font-eyebrow text-[10px] font-semibold tracking-[0.1em] text-muted uppercase">
          {kpi.label}
        </p>
        <span className="text-muted" aria-hidden>
          {KPI_ICON[kpi.icon]}
        </span>
      </div>
      <p className="mt-3 flex items-baseline gap-1.5">
        <span className="nums font-mono text-[30px] font-semibold tracking-[-0.02em] text-primary">
          {kpi.value}
        </span>
        {kpi.unit && (
          <span className="text-[14px] font-medium text-muted">{kpi.unit}</span>
        )}
      </p>
      <p
        className={`mt-2 flex items-center gap-1.5 text-[12.5px] font-medium ${DELTA_TONE[kpi.tone]}`}
      >
        {kpi.tone === "up" && <TrendUpIcon size={13} />}
        {kpi.hint}
      </p>
    </div>
  );
}

function WeekChart() {
  const peak = Math.max(...weekTrend.map((d) => d.value));
  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-[15px] font-semibold">This week</h2>
        <span className="font-eyebrow text-[10px] font-semibold tracking-[0.1em] text-muted uppercase">
          Person-nights
        </span>
      </div>
      <div className="px-5 py-5">
        <p className="mb-4 flex items-baseline gap-1.5">
          <span className="nums font-mono text-[26px] font-semibold tracking-[-0.02em] text-primary">
            {weekTotal.toLocaleString("en")}
          </span>
          <span className="text-[13px] text-muted">this week so far</span>
        </p>
        <div className="flex h-[132px] items-end gap-2" aria-hidden>
          {weekTrend.map((d) => (
            <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full flex-1 items-end overflow-hidden rounded-[5px] bg-subtle">
                <span
                  className={`block w-full rounded-[5px] transition-[height] duration-500 ease-[var(--ease-out)] motion-reduce:transition-none ${
                    d.today ? "bg-amber" : "bg-primary"
                  }`}
                  style={{ height: `${Math.round((d.value / peak) * 100)}%` }}
                />
              </div>
              <span
                className={`nums font-eyebrow text-[10px] font-semibold ${
                  d.today ? "text-amber-ink" : "text-muted"
                }`}
              >
                {d.label}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[12.5px] text-muted">
          Bars show nights logged by holders. Today (
          <span className="font-semibold text-amber-ink">19</span>) is still
          filling in.
        </p>
      </div>
    </Card>
  );
}

const QUICK_ACTIONS = [
  {
    href: "/power-user/assignments",
    label: "Assign a holder",
    hint: "Link a pitch holder to a pitch",
    icon: <UserPlusIcon size={18} />,
  },
  {
    href: "/power-user/events",
    label: "Add an event",
    hint: "Highlight a date on the calendar",
    icon: <CalendarIcon size={18} />,
  },
  {
    href: "/power-user/pitches",
    label: "View pitches",
    hint: "Filter overnight data across pitches",
    icon: <ChartIcon size={18} />,
  },
];

export default function PowerUserDashboard() {
  const reduce = useReducedMotion();

  const pending = assignments.filter((a) => !a.holder);

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.06, delayChildren: 0.04 },
    },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <>
      <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 font-eyebrow text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
            {today.label}
          </p>
          <h1 className="text-[clamp(24px,3vw,30px)] leading-[1.1]">
            {today.greeting}
          </h1>
          <p className="mt-2 max-w-[60ch] text-[15px] leading-[1.5] text-secondary">
            19 of 24 pitches you manage have logged tonight, and 3 still need a
            holder. Here&apos;s where Rairanta stands right now.
          </p>
        </div>
        <Link
          href="/power-user/assignments"
          className="inline-flex flex-none items-center gap-2 rounded-[10px] bg-primary px-4 py-2.5 text-[14.5px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.98]"
        >
          <UserPlusIcon size={18} />
          Assign a holder
        </Link>
      </header>

      {/* KPIs */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        {dashboardKpis.map((kpi) => (
          <motion.div key={kpi.label} variants={item}>
            <KpiCard kpi={kpi} />
          </motion.div>
        ))}
      </motion.div>

      {/* quick actions */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-6 grid gap-4 sm:grid-cols-3"
      >
        {QUICK_ACTIONS.map((a) => (
          <motion.div key={a.href} variants={item}>
            <Link
              href={a.href}
              className="group flex items-center gap-3.5 rounded-[14px] border border-border bg-surface p-4 shadow-xs transition-[transform,box-shadow] duration-200 ease-[var(--ease-out)] hover:-translate-y-0.5 hover:shadow-sm motion-reduce:hover:translate-y-0"
            >
              <span className="grid h-11 w-11 flex-none place-items-center rounded-[12px] bg-primary-tint text-primary-dark">
                {a.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14.5px] font-semibold text-ink">
                  {a.label}
                </span>
                <span className="block text-[12.5px] text-muted">{a.hint}</span>
              </span>
              <ChevronRightIcon
                size={18}
                className="flex-none text-muted transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5"
              />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* entries + week */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-[16px] font-semibold">
              Recent entries by holders
            </h2>
            <span className="inline-flex items-center gap-1.5 font-eyebrow text-[10px] font-semibold tracking-[0.1em] text-primary uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Live
            </span>
          </div>
          <ul>
            {holderEntries.map((e) => (
              <li
                key={e.id}
                className="flex items-center gap-3 border-b border-border px-5 py-3.5 last:border-0"
              >
                <span className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-primary-tint text-primary-dark">
                  <CheckIcon size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] leading-snug text-ink">
                    <span className="font-semibold">{e.holder}</span> logged{" "}
                    <span className="nums font-semibold">{e.persons}</span>{" "}
                    {e.persons === 1 ? "person" : "persons"} on{" "}
                    <span className="font-heading font-semibold">{e.pitch}</span>
                  </p>
                  <p className="text-[12.5px] text-muted">{e.area}</p>
                </div>
                <span className="flex-none font-eyebrow text-[10px] font-semibold tracking-[0.06em] text-muted uppercase">
                  {e.time}
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t border-border px-5 py-3">
            <Link
              href="/power-user/pitches"
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary transition-colors hover:text-primary-dark"
            >
              View all pitches
              <ChevronRightIcon size={15} />
            </Link>
          </div>
        </Card>

        <WeekChart />
      </div>

      {/* pending assignments + events */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-start">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-[16px] font-semibold">Pending assignments</h2>
            <span className="font-eyebrow text-[10px] font-semibold tracking-[0.1em] text-amber-ink uppercase">
              {pending.length} unassigned
            </span>
          </div>
          <ul>
            {pending.map((a) => (
              <li
                key={a.code}
                className="flex items-center gap-3 border-b border-border px-5 py-3.5 last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-[14.5px] font-semibold text-ink">
                    {a.code}{" "}
                    <span className="font-body text-[13px] font-normal text-muted">
                      · {a.area}
                    </span>
                  </p>
                  <p className="text-[13px] text-secondary">No holder · {a.season}</p>
                </div>
                <Link
                  href="/power-user/assignments"
                  className="rounded-[9px] bg-primary px-3.5 py-2 text-[13.5px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.97]"
                >
                  Assign
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-[16px] font-semibold">Upcoming events</h2>
            <Link
              href="/power-user/events"
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary transition-colors hover:text-primary-dark"
            >
              Manage
              <ChevronRightIcon size={15} />
            </Link>
          </div>
          <ul>
            {events.map((e) => (
              <li
                key={e.id}
                className="flex items-center gap-4 border-b border-border px-5 py-3.5 last:border-0"
              >
                <span className="w-[72px] flex-none border-r border-border pr-3 font-heading text-[13px] font-semibold text-primary">
                  {e.range}
                </span>
                <p className="min-w-0 flex-1 truncate text-[14px] font-medium text-ink">
                  {e.name}
                </p>
                <span
                  className={`hidden rounded-full px-2.5 py-1 font-eyebrow text-[9.5px] font-semibold tracking-[0.06em] uppercase sm:inline ${
                    e.visible
                      ? "bg-occ-1 text-primary-dark"
                      : "bg-subtle text-muted"
                  }`}
                >
                  {e.visible ? "Visible" : "Internal"}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
