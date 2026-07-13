"use client";

import { useMemo, useState } from "react";
import {
  ContentHeader,
  FilterSelect,
  InstrumentRow,
  Ledger,
  OccupancyBar,
  RuledTabs,
  SplitButton,
  UnderlineLink,
  useAudit,
  useToast,
  type LedgerColumn,
} from "@/components/portal";
import {
  adminContact,
  areas,
  daySummaryFor,
  monthDays,
  monthlyAreaSummary,
  months,
  staff,
  type AreaSummary,
  type DaySummary,
  type MonthName,
} from "../data";

type View = "area" | "day";

const EXPORT_MAILTO = `mailto:${adminContact.email}?subject=${encodeURIComponent(
  "Statistics Finland export · Rairanta",
)}&body=${encodeURIComponent(
  "Hi Olli,\n\nCould you run the full Statistics Finland export for Rairanta?\n\nPeriod:\n\nThanks,\nMikko",
)}`;

function toCsv(rows: string[][]): string {
  return rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
}

export default function PowerUserReports() {
  const toast = useToast();
  const { log } = useAudit();

  const [view, setView] = useState<View>("area");
  const [month, setMonth] = useState<MonthName>("June 2026");
  const [area, setArea] = useState<string>("all");

  const areaRows = useMemo<AreaSummary[]>(() => {
    const rows = monthlyAreaSummary[month];
    return area === "all" ? rows : rows.filter((r) => r.area === area);
  }, [month, area]);

  const dayRows = useMemo<DaySummary[]>(() => daySummaryFor(month, area), [month, area]);

  const totals = useMemo(() => {
    const pitches = areaRows.reduce((s, r) => s + r.pitches, 0);
    const nights = areaRows.reduce((s, r) => s + r.nights, 0);
    const personNights = areaRows.reduce((s, r) => s + r.personNights, 0);
    const capacity = pitches * monthDays(month);
    return {
      pitches,
      nights,
      personNights,
      occupancy: capacity ? Math.round((nights / capacity) * 100) : 0,
    };
  }, [areaRows, month]);

  const exportCsv = () => {
    const header =
      view === "area"
        ? ["Area", "Pitches", "Nights", "Person-nights", "Occupancy %"]
        : ["Date", "Nights", "Person-nights", "Occupancy %"];
    const body =
      view === "area"
        ? areaRows.map((r) => [
            r.area,
            String(r.pitches),
            String(r.nights),
            String(r.personNights),
            String(r.occupancy),
          ])
        : dayRows.map((r) => [
            r.date,
            String(r.nights),
            String(r.personNights),
            String(r.occupancy),
          ]);

    const csv = toCsv([header, ...body]);
    const name = `rairanta-${view === "area" ? "by-area" : "by-day"}-${month
      .toLowerCase()
      .replace(" ", "-")}.csv`;

    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);

    log({
      actor: staff.name,
      actorInitials: staff.initials,
      event: "Exported report",
      target: `${month} · ${view === "area" ? "By area" : "By day"}`,
      detail: area === "all" ? "All areas · CSV" : `${area} · CSV`,
      tone: "record",
    });
    toast({ message: `${month} CSV exported.`, variant: "success" });
  };

  const areaColumns: LedgerColumn<AreaSummary>[] = [
    { key: "area", header: "Area", render: (r) => r.area },
    { key: "pitches", header: "Pitches", numeric: true, render: (r) => r.pitches },
    { key: "nights", header: "Nights", numeric: true, render: (r) => r.nights },
    {
      key: "personNights",
      header: "Person-nights",
      numeric: true,
      render: (r) => r.personNights.toLocaleString("en-US"),
    },
    {
      key: "occupancy",
      header: "Occupancy",
      align: "right",
      width: "w-[220px]",
      render: (r) => (
        <span className="flex items-center justify-end gap-3">
          <OccupancyBar pct={r.occupancy} className="w-[110px]" />
          <span className="w-10 text-right font-spline tabular-nums text-ink-900">
            {r.occupancy}%
          </span>
        </span>
      ),
    },
  ];

  const dayColumns: LedgerColumn<DaySummary>[] = [
    {
      key: "date",
      header: "Date",
      render: (r) => (
        <span
          className={`font-spline text-[0.9375rem] tabular-nums ${
            r.weekend ? "font-medium text-pine-700" : "text-ink-900"
          }`}
        >
          {r.date}
        </span>
      ),
    },
    { key: "nights", header: "Nights", numeric: true, render: (r) => r.nights },
    {
      key: "personNights",
      header: "Person-nights",
      numeric: true,
      render: (r) => r.personNights.toLocaleString("en-US"),
    },
    {
      key: "occupancy",
      header: "Occupancy",
      align: "right",
      width: "w-[220px]",
      render: (r) => (
        <span className="flex items-center justify-end gap-3">
          <OccupancyBar pct={r.occupancy} className="w-[110px]" />
          <span className="w-10 text-right font-spline tabular-nums text-ink-900">
            {r.occupancy}%
          </span>
        </span>
      ),
    },
  ];

  return (
    <>
      <ContentHeader
        title="Reports"
        description={
          <>
            Quick operational summaries by area or by day. For the full Statistics Finland
            export, <UnderlineLink href={EXPORT_MAILTO}>ask an administrator</UnderlineLink>.
          </>
        }
      />

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <RuledTabs
          label="Report view"
          value={view}
          onChange={setView}
          tabs={[
            { value: "area", label: "By area" },
            { value: "day", label: "By day" },
          ]}
        />
        <div className="flex flex-wrap items-center gap-2.5">
          <FilterSelect
            label="Month"
            value={month}
            onChange={(v) => setMonth(v as MonthName)}
            options={months.map((m) => ({ value: m, label: m }))}
          />
          <FilterSelect
            label="Area"
            value={area}
            onChange={setArea}
            options={[
              { value: "all", label: "All areas" },
              ...areas.map((a) => ({ value: a, label: a })),
            ]}
          />
          <SplitButton label="Export CSV" size="compact" onClick={exportCsv} />
        </div>
      </div>

      <InstrumentRow
        cells={[
          { label: "Pitches", value: String(totals.pitches), sub: area === "all" ? "All areas" : area },
          { label: "Nights", value: totals.nights.toLocaleString("en-US"), sub: month },
          {
            label: "Person-nights",
            value: totals.personNights.toLocaleString("en-US"),
            sub: `${(totals.personNights / (totals.nights || 1)).toFixed(1)} avg per night`,
          },
          {
            label: "Avg occupancy",
            value: `${totals.occupancy}%`,
            sub: `${monthDays(month)} nights in ${month.split(" ")[0]}`,
          },
        ]}
      />

      <section className="mt-8">
        <h2 className="mb-3.5 font-familjen text-[1.0625rem] font-semibold tracking-[-0.02em] text-pine-900">
          {view === "area" ? "Summary by area" : "Summary by day"}
        </h2>

        {view === "area" ? (
          <Ledger
            caption={`${month} summary by area`}
            columns={areaColumns}
            rows={areaRows}
            getKey={(r) => r.area}
            totalRow={[
              "All areas",
              totals.pitches,
              totals.nights.toLocaleString("en-US"),
              totals.personNights.toLocaleString("en-US"),
              <span key="occ" className="flex items-center justify-end gap-3">
                <OccupancyBar pct={totals.occupancy} className="w-[110px]" />
                <span className="w-10 text-right font-spline tabular-nums">
                  {totals.occupancy}%
                </span>
              </span>,
            ]}
          />
        ) : (
          <Ledger
            caption={`${month} summary by day`}
            columns={dayColumns}
            rows={dayRows}
            getKey={(r) => r.date}
            totalRow={[
              month,
              totals.nights.toLocaleString("en-US"),
              totals.personNights.toLocaleString("en-US"),
              <span key="occ" className="flex items-center justify-end gap-3">
                <OccupancyBar pct={totals.occupancy} className="w-[110px]" />
                <span className="w-10 text-right font-spline tabular-nums">
                  {totals.occupancy}%
                </span>
              </span>,
            ]}
          />
        )}
      </section>
    </>
  );
}
