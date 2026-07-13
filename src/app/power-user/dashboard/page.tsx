"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarPlus, Map, UserPlus } from "lucide-react";
import {
  BarChartMini,
  ContentHeader,
  HeatCell,
  InstrumentRow,
  LedgerFrame,
  QuickActions,
  SplitButton,
  StatusMark,
  UnderlineLink,
  useAudit,
  useToast,
} from "@/components/portal";
import { AssignDrawer, type AssignResult } from "../_components/AssignDrawer";
import {
  assignments as seedAssignments,
  events,
  holderEntries,
  loggedTonight,
  occupancyTonight,
  pitchesManaged,
  staff,
  stillToLog,
  today,
  todayIndex,
  weekTotal,
  weekTrend,
  type Assignment,
} from "../data";

/* The 20:00 rule (PORTAL_SPEC B3.1 §2): after 20:00, any pitch that hasn't
   logged tonight is an attention state, not a statistic. Server and first
   client render agree (false), then the real hour corrects it on mount — no
   hydration mismatch. Real deployments compute this in Europe/Helsinki
   server-side (Part C.7); this demo has no backend. */
function useAfterEight() {
  const [after, setAfter] = useState(false);
  useEffect(() => setAfter(new Date().getHours() >= 20), []);
  return after;
}

export default function PowerUserDashboard() {
  const toast = useToast();
  const { log } = useAudit();
  const afterEight = useAfterEight();

  const [list, setList] = useState<Assignment[]>(seedAssignments);
  const [assigning, setAssigning] = useState<Assignment | null>(null);

  const pending = useMemo(() => list.filter((a) => a.holder === null), [list]);
  const upcoming = useMemo(
    () => [...events].sort((a, b) => a.days[0] - b.days[0]).filter((e) => e.days[0] >= today.day).slice(0, 4),
    [],
  );

  const overdue = afterEight && stillToLog > 0;

  const onSave = (pitch: Assignment, r: AssignResult) => {
    setList((prev) =>
      prev.map((a) =>
        a.code === pitch.code
          ? { ...a, holder: r.holder, agreement: r.agreement, since: r.since, status: "Active" }
          : a,
      ),
    );
    log({
      actor: staff.name,
      actorInitials: staff.initials,
      event: "Assigned holder",
      target: `${pitch.code} · ${pitch.area}`,
      detail: `${r.holder} · ${r.agreement}`,
      tone: "settings",
    });
    toast({ message: `${r.holder} assigned to ${pitch.code}.`, variant: "success" });
  };

  return (
    <>
      <ContentHeader
        eyebrow={today.mono}
        title={today.greeting}
        description={`${loggedTonight} of ${pitchesManaged} pitches you manage have logged tonight, and ${pending.length} still need a holder. Here’s where Rairanta stands right now.`}
        secondary={
          <UnderlineLink href="/power-user/assignments" arrow>
            Assign a holder
          </UnderlineLink>
        }
      />

      <InstrumentRow
        cells={[
          {
            label: "Pitches managed",
            value: String(pitchesManaged),
            sub: "Across 5 areas",
          },
          {
            // The hero cell: the whole job is "did everyone log?".
            label: "Logged tonight",
            value: String(loggedTonight),
            divisor: `/ ${pitchesManaged}`,
            valueTone: overdue ? "amber" : "ink",
            sub: overdue ? (
              <span className="font-spline uppercase tracking-[0.1em]">
                {stillToLog} still to log
              </span>
            ) : (
              `${stillToLog} holders still to log`
            ),
            subTone: overdue ? "warn" : "flat",
            href: "/power-user/pitches?filter=unlogged",
          },
          {
            label: "Pending assignments",
            value: String(pending.length),
            sub: "Pitches without a holder",
            subTone: pending.length > 0 ? "warn" : "flat",
            href: "/power-user/assignments?status=Unassigned",
          },
          {
            label: "Occupancy tonight",
            value: `${occupancyTonight}%`,
            sub: "+6% vs last Tuesday",
            subTone: "up",
          },
        ]}
      />

      <div className="mt-8">
        <QuickActions
          actions={[
            {
              label: "Assign a holder",
              description: `${pending.length} pitches waiting`,
              href: "/power-user/assignments",
              icon: UserPlus,
            },
            {
              label: "Add an event",
              description: "Midsummer, market days",
              href: "/power-user/events",
              icon: CalendarPlus,
            },
            {
              label: "View pitches",
              description: "Read-only overnight data",
              href: "/power-user/pitches",
              icon: Map,
            },
          ]}
        />
      </div>

      {/* Recent entries + this week */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start [&>*]:min-w-0">
        <LedgerFrame
          header={
            <>
              <span className="font-spline text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
                Recent entries by holders
              </span>
              <StatusMark variant="live" label="LIVE" />
            </>
          }
          bodyClassName="p-0"
        >
          <ul>
            {holderEntries.map((e) => (
              <li
                key={e.id}
                className="flex items-center gap-3 border-b border-line px-5 py-3 last:border-0"
              >
                <HeatCell
                  value={e.persons}
                  display=""
                  size={12}
                  label={`${e.persons} persons`}
                  className="flex-none"
                />
                <p className="min-w-0 flex-1 text-[0.875rem] leading-snug text-ink-muted">
                  <span className="font-medium text-ink-900">{e.holder}</span> logged{" "}
                  <span className="font-spline tabular-nums text-ink-900">{e.persons}</span>{" "}
                  persons on <span className="font-spline text-ink-900">{e.pitch}</span>
                  <span className="font-spline text-ink-muted"> · {e.area}</span>
                </p>
                <span className="flex-none font-spline text-[11px] text-ink-muted">{e.time}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-line px-5 py-3">
            <UnderlineLink href="/power-user/pitches">View all pitches</UnderlineLink>
          </div>
        </LedgerFrame>

        <LedgerFrame
          header={
            <>
              <span className="font-spline text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
                This week
              </span>
              <span className="font-spline text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                <span className="text-[1rem] tabular-nums text-pine-900">
                  {weekTotal.toLocaleString("en-US")}
                </span>{" "}
                this week so far
              </span>
            </>
          }
        >
          <BarChartMini data={weekTrend} currentIndex={todayIndex} suffix=" person-nights" />
        </LedgerFrame>
      </div>

      {/* Pending assignments + upcoming events */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start [&>*]:min-w-0">
        <LedgerFrame
          header={
            <span className="font-spline text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
              Pending assignments
            </span>
          }
          bodyClassName="p-0"
        >
          {pending.length === 0 ? (
            <p className="px-5 py-8 text-center text-[0.9375rem] text-ink-muted">
              Every pitch has a holder.
            </p>
          ) : (
            <ul>
              {pending.map((a) => (
                <li
                  key={a.code}
                  className="flex items-center gap-3 border-b border-line px-5 py-3 last:border-0"
                >
                  <p className="min-w-0 flex-1 font-spline text-[0.875rem] text-ink-muted">
                    <span className="font-medium text-ink-900">{a.code}</span> · {a.area} · No
                    holder · {a.season}
                  </p>
                  <SplitButton
                    label="Assign"
                    size="compact"
                    onClick={() => setAssigning(a)}
                    className="flex-none"
                  />
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-line px-5 py-3">
            <UnderlineLink href="/power-user/assignments">All assignments</UnderlineLink>
          </div>
        </LedgerFrame>

        <LedgerFrame
          header={
            <span className="font-spline text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
              Upcoming events
            </span>
          }
          bodyClassName="p-0"
        >
          <ul>
            {upcoming.map((e) => (
              <li
                key={e.id}
                className="flex items-center gap-3 border-b border-line px-5 py-3 last:border-0"
              >
                <span className="w-[74px] flex-none font-spline text-[12px] tabular-nums text-ink-muted">
                  {e.range}
                </span>
                <span className="min-w-0 flex-1 truncate text-[0.9375rem] font-medium text-ink-900">
                  {e.name}
                </span>
                <span className="hidden flex-none font-spline text-[11px] uppercase tracking-[0.1em] text-ink-muted sm:block">
                  {e.scope}
                </span>
                <StatusMark
                  variant={e.visible ? "active" : "pending"}
                  label={e.visible ? "Visible" : "Internal"}
                  className="flex-none"
                />
              </li>
            ))}
          </ul>
          <div className="border-t border-line px-5 py-3">
            <UnderlineLink href="/power-user/events">Manage events</UnderlineLink>
          </div>
        </LedgerFrame>
      </div>

      <AssignDrawer pitch={assigning} onClose={() => setAssigning(null)} onSave={onSave} />
    </>
  );
}
