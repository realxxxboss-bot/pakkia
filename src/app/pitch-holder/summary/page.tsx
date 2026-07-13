"use client";

/* PITCH HOLDER — Summary (PORTAL_SPEC B4.3). The season, read back to the
   holder. Every figure here is derived from the same entries the calendar
   writes, so the summary can never disagree with the grid. */

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChartMini,
  ContentHeader,
  Ledger,
  LedgerFrame,
  InstrumentRow,
  SplitButton,
  type LedgerColumn,
} from "@/components/portal";
import { ExportDrawer } from "../_components/ExportDrawer";
import { useHolder } from "../_components/holder-store";
import {
  monthHistory,
  monthTotals,
  season,
  seasonTotals,
  today,
  weeklyPersonNights,
  type MonthRow,
} from "../data";

export default function PitchHolderSummary() {
  const router = useRouter();
  const { entries, setMonth } = useHolder();
  const [exporting, setExporting] = useState(false);

  const totals = seasonTotals(entries);
  const june = monthTotals(entries, today.month);
  const weeks = weeklyPersonNights(entries);
  const history = monthHistory(entries);

  // A month row goes to that month's calendar — the summary is a way in, not
  // a dead end.
  const openMonth = (row: MonthRow) => {
    setMonth(row.month);
    router.push("/pitch-holder/calendar");
  };

  const columns: LedgerColumn<MonthRow>[] = [
    {
      key: "month",
      header: "Month",
      render: (r) => (
        <span className="flex flex-wrap items-baseline gap-2">
          <span className="font-medium text-ink-900">{r.name}</span>
          {r.inProgress && (
            <span className="font-spline text-[11px] uppercase tracking-[0.12em] text-ink-muted">
              In progress
            </span>
          )}
        </span>
      ),
    },
    {
      key: "nights",
      header: "Nights logged",
      numeric: true,
      render: (r) => r.nightsLogged,
    },
    {
      key: "pn",
      header: "Person-nights",
      numeric: true,
      cellClassName: "font-medium",
      render: (r) => r.personNights,
    },
  ];

  return (
    <>
      <ContentHeader
        title="Summary"
        description="A quick look at how your pitch is doing this season."
        action={
          <SplitButton
            size="compact"
            label="Export report"
            onClick={() => setExporting(true)}
          />
        }
      />

      {/* Season hero. */}
      <LedgerFrame bodyClassName="px-5 py-6 sm:px-6">
        <p className="font-spline text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
          This season · {season.year}
        </p>
        <p className="mt-3 font-spline text-[2.5rem] font-medium leading-none tabular-nums text-pine-900">
          {totals.personNights.toLocaleString("en-US")}
        </p>
        <p className="mt-2.5 text-[0.9375rem] text-ink-muted">
          person-nights across {totals.nightsLogged} nights logged
        </p>
      </LedgerFrame>

      <div className="mt-6">
        <LedgerFrame
          header={
            <>
              <span className="font-spline text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
                Person-nights by week
              </span>
              <span className="font-spline text-[11px] uppercase tracking-[0.12em] text-ink-muted">
                {weeks.length} weeks
              </span>
            </>
          }
        >
          <BarChartMini data={weeks} height={180} currentIndex={weeks.length - 1} />
        </LedgerFrame>
      </div>

      <div className="mt-8">
        <InstrumentRow
          cells={[
            { label: "June nights", value: String(june.personNights) },
            { label: "Busiest night", value: String(totals.busiest), sub: "persons" },
            { label: "Avg per night", value: totals.avgPerNight.toFixed(1) },
            { label: "Occupancy", value: `${totals.occupancy}%`, sub: "of pitch capacity" },
          ]}
        />
      </div>

      <section className="mt-10">
        <h2 className="mb-4 font-familjen text-[1.125rem] font-semibold tracking-[-0.02em] text-pine-900">
          By month
        </h2>
        <Ledger
          columns={columns}
          rows={history}
          getKey={(r) => r.name}
          caption="Person-nights logged by month this season"
          onRowClick={openMonth}
          totalRow={[
            "Season total",
            totals.nightsLogged,
            totals.personNights.toLocaleString("en-US"),
          ]}
        />
      </section>

      <ExportDrawer
        open={exporting}
        onClose={() => setExporting(false)}
        entries={entries}
      />
    </>
  );
}
