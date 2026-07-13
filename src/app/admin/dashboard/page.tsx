"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ActivityFeed,
  BarChartMini,
  ContentHeader,
  InstrumentRow,
  LedgerFrame,
  SegmentedBar,
  StatusSquare,
  UnderlineLink,
  useAudit,
} from "@/components/portal";
import {
  activePitchCount,
  admin,
  areaOccupancy,
  nightsChart,
  nightsThisMonth,
  occupancy,
  occupancySegments,
  pitchTotal,
  teamCounts,
  today,
  todayIndex,
} from "../data";

/* Time-of-day greeting. Seeded with the static label so server and client
   render identically, then corrected on mount (no hydration mismatch). */
function useGreeting() {
  const [greeting, setGreeting] = useState(today.label);
  useEffect(() => {
    const h = new Date().getHours();
    const part = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
    setGreeting(`${part}, ${admin.firstName}.`);
  }, []);
  return greeting;
}

export default function AdminDashboard() {
  const greeting = useGreeting();
  const { events } = useAudit();
  const sortedAreas = [...areaOccupancy].sort((a, b) => b.pct - a.pct);

  return (
    <>
      <ContentHeader
        title={greeting}
        description={`${activePitchCount} of ${pitchTotal} pitches are active this season, and ${nightsThisMonth.toLocaleString("en-US")} nights have been logged in June.`}
        action={
          <UnderlineLink href="/admin/reports" arrow>
            Export report
          </UnderlineLink>
        }
      />

      <InstrumentRow
        cells={[
          {
            label: "Active pitches",
            value: String(activePitchCount),
            divisor: `/ ${pitchTotal}`,
            sub: "6 inactive this season",
            subTone: "flat",
          },
          {
            label: "Power users",
            value: String(teamCounts.powerUsers),
            sub: "Front-desk staff · 1 invite pending",
            subTone: "flat",
          },
          {
            label: "Pitch holders",
            value: String(teamCounts.pitchHolders),
            sub: "38 active · 3 invited",
            subTone: "flat",
          },
          {
            label: "Nights this season",
            value: "6,120",
            sub: "+12% vs 2025",
            subTone: "up",
          },
        ]}
      />

      {/* Nights + occupancy */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start [&>*]:min-w-0">
        <LedgerFrame
          header={
            <>
              <span className="font-spline text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
                Nights logged · June
              </span>
              <span className="font-spline text-[1.25rem] tabular-nums text-pine-900">
                {nightsThisMonth.toLocaleString("en-US")}
              </span>
            </>
          }
        >
          <BarChartMini data={nightsChart} currentIndex={todayIndex} tickInterval={4} />
        </LedgerFrame>

        <LedgerFrame
          header={
            <span className="font-spline text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
              Occupancy
            </span>
          }
        >
          <p className="font-spline text-[2.5rem] font-medium leading-none tabular-nums text-pine-900">
            {occupancy.pct}%
          </p>
          <div className="mt-5">
            <SegmentedBar segments={occupancySegments} />
          </div>
          <p className="mt-4 flex items-center gap-2 border-t border-line pt-3 font-spline text-[12px] text-ink-muted">
            <StatusSquare variant="trial" />
            Peak: {occupancy.peak}
          </p>
        </LedgerFrame>
      </div>

      {/* Occupancy by area — a ruled bar-list, not a chart. */}
      <section className="mt-8">
        <h2 className="mb-3.5 font-familjen text-[1.0625rem] font-semibold tracking-[-0.02em] text-pine-900">
          Occupancy by area
        </h2>
        <div className="overflow-hidden rounded-[12px] border border-line bg-paper">
          <ul>
            {sortedAreas.map((a) => (
              <li key={a.area} className="border-b border-line last:border-0">
                <Link
                  href={`/admin/reports?area=${encodeURIComponent(a.area)}`}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors duration-150 hover:bg-paper-deep"
                >
                  <span className="w-[150px] flex-none">
                    <span className="block text-[0.9375rem] font-medium text-ink-900">{a.area}</span>
                    <span className="block font-spline text-[12px] text-ink-muted">
                      {a.pitches} pitches
                    </span>
                  </span>
                  <span
                    className="h-2 flex-1 overflow-hidden rounded-[2px] border border-line bg-paper-deep"
                    aria-hidden
                  >
                    <span className="block h-full bg-pine-700" style={{ width: `${a.pct}%` }} />
                  </span>
                  <span className="w-12 flex-none text-right font-spline text-[0.9375rem] tabular-nums text-ink-900">
                    {a.pct}%
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Recent activity */}
      <section className="mt-8">
        <h2 className="mb-3.5 font-familjen text-[1.0625rem] font-semibold tracking-[-0.02em] text-pine-900">
          Recent activity
        </h2>
        <ActivityFeed
          events={events}
          limit={5}
          title="Campsite activity"
          live
          footer={<UnderlineLink href="/admin/audit">View audit log</UnderlineLink>}
        />
      </section>
    </>
  );
}
