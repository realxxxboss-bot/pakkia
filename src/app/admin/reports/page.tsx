"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AppliedTag,
  ContentHeader,
  Field,
  Ledger,
  LedgerFrame,
  RuledRadioGroup,
  SplitButton,
  UnderlineSelect,
  useAudit,
  useToast,
  type LedgerColumn,
} from "@/components/portal";
import {
  admin,
  areas,
  dailyReportRows,
  pitchTotal,
  reportRows,
  reportTypes,
  seasonalReportRows,
  type DailyReportRow,
  type ReportRow,
  type ReportType,
  type SeasonalReportRow,
} from "../data";

const FORMATS = ["CSV", "PDF"] as const;
type Format = (typeof FORMATS)[number];

const MONTHS = ["June 2026", "May 2026", "April 2026"];

export default function AdminReports() {
  const toast = useToast();
  const { log } = useAudit();

  const [type, setType] = useState<ReportType>("Monthly summary");
  const [format, setFormat] = useState<Format>("CSV");
  const [month, setMonth] = useState(MONTHS[0]);
  const [areaFilter, setAreaFilter] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  /* Deep-link from the dashboard's "Occupancy by area" rows (?area=Lakeside).
     Read on mount rather than via useSearchParams, so the whole page still
     prerenders instead of hiding behind a Suspense fallback. */
  useEffect(() => {
    const a = new URLSearchParams(window.location.search).get("area");
    if (a) setAreaFilter(a);
  }, []);

  // 150ms opacity cross-fade whenever the options change the preview.
  const [fade, setFade] = useState(false);
  useEffect(() => {
    setFade(true);
    const t = setTimeout(() => setFade(false), 150);
    return () => clearTimeout(t);
  }, [type, month, areaFilter]);

  const monthlyRows = useMemo(
    () => (areaFilter ? reportRows.filter((r) => r.area === areaFilter) : reportRows),
    [areaFilter],
  );
  const seasonalRows = useMemo(
    () => (areaFilter ? seasonalReportRows.filter((r) => r.area === areaFilter) : seasonalReportRows),
    [areaFilter],
  );

  const runExport = () => {
    if (exporting) return;
    setExporting(true);
    timer.current = setTimeout(() => {
      setExporting(false);
      log({
        actor: admin.name,
        actorInitials: admin.initials,
        event: "Exported report",
        target: month,
        detail: `${type} · format = ${format}`,
        tone: "info",
      });
      toast({ message: `${month} ${format} exported`, variant: "success" });
    }, 1100);
  };

  /* ---- preview tables, one per report type ---- */

  const monthlyCols: LedgerColumn<ReportRow>[] = [
    { key: "code", header: "Pitch", cellClassName: "font-spline font-medium text-ink-900", render: (r) => r.code },
    { key: "area", header: "Area", render: (r) => r.area },
    { key: "nights", header: "Nights", numeric: true, render: (r) => r.nights },
    { key: "pn", header: "Person-nights", numeric: true, render: (r) => r.personNights },
    { key: "occ", header: "Occupancy", numeric: true, render: (r) => `${r.occupancy}%` },
  ];

  const dailyCols: LedgerColumn<DailyReportRow>[] = [
    { key: "date", header: "Date", cellClassName: "font-spline text-ink-900", render: (r) => r.date },
    { key: "nights", header: "Nights", numeric: true, render: (r) => r.nights },
    { key: "pn", header: "Person-nights", numeric: true, render: (r) => r.personNights },
    { key: "occ", header: "Occupancy", numeric: true, render: (r) => `${r.occupancy}%` },
  ];

  const seasonalCols: LedgerColumn<SeasonalReportRow>[] = [
    { key: "area", header: "Area", cellClassName: "font-medium text-ink-900", render: (r) => r.area },
    { key: "pitches", header: "Pitches", numeric: true, render: (r) => r.pitches },
    { key: "nights", header: "Nights", numeric: true, render: (r) => r.nights },
    { key: "pn", header: "Person-nights", numeric: true, render: (r) => r.personNights },
    { key: "occ", header: "Occupancy", numeric: true, render: (r) => `${r.occupancy}%` },
  ];

  const sum = <T,>(rows: T[], pick: (r: T) => number) => rows.reduce((s, r) => s + pick(r), 0);
  const avg = <T,>(rows: T[], pick: (r: T) => number) =>
    rows.length ? Math.round(sum(rows, pick) / rows.length) : 0;

  const previewTitle = `PREVIEW — ${type.toUpperCase()} · ${month.toUpperCase()}${
    areaFilter ? ` · ${areaFilter.toUpperCase()}` : ""
  }`;

  const preview =
    type === "Daily breakdown" ? (
      <Ledger
        columns={dailyCols}
        rows={dailyReportRows}
        getKey={(r) => r.date}
        caption={`Daily breakdown for ${month}`}
        bare
        totalRow={[
          "Total",
          sum(dailyReportRows, (r) => r.nights),
          sum(dailyReportRows, (r) => r.personNights),
          `${avg(dailyReportRows, (r) => r.occupancy)}%`,
        ]}
      />
    ) : type === "Seasonal total" ? (
      <Ledger
        columns={seasonalCols}
        rows={seasonalRows}
        getKey={(r) => r.area}
        caption="Seasonal total by area"
        bare
        totalRow={[
          "All areas",
          sum(seasonalRows, (r) => r.pitches),
          sum(seasonalRows, (r) => r.nights),
          sum(seasonalRows, (r) => r.personNights),
          `${avg(seasonalRows, (r) => r.occupancy)}%`,
        ]}
      />
    ) : (
      <Ledger
        columns={monthlyCols}
        rows={monthlyRows}
        getKey={(r) => r.code}
        caption={`Monthly summary for ${month}`}
        bare
        totalRow={[
          "Total",
          "",
          sum(monthlyRows, (r) => r.nights),
          sum(monthlyRows, (r) => r.personNights),
          `${avg(monthlyRows, (r) => r.occupancy)}%`,
        ]}
      />
    );

  return (
    <>
      <ContentHeader
        title="Reports & export"
        description="Build a campsite report, preview the totals, and export it as CSV or PDF."
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:items-start [&>*]:min-w-0">
        {/* options rail */}
        <div className="lg:sticky lg:top-[76px]">
          <LedgerFrame
            header={
              <span className="font-spline text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
                Options
              </span>
            }
          >
            <div className="flex flex-col gap-6">
              <Field label="Report type">
                <RuledRadioGroup
                  name="report-type"
                  legend="Report type"
                  value={type}
                  onChange={(v) => setType(v as ReportType)}
                  options={reportTypes.map((t) => ({ value: t, label: t }))}
                />
              </Field>

              <Field label="Period" htmlFor="r-period">
                <UnderlineSelect id="r-period" value={month} onChange={(e) => setMonth(e.target.value)}>
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </UnderlineSelect>
              </Field>

              <Field label="Pitches" htmlFor="r-area" hint={`All pitches (${pitchTotal}) unless an area is chosen.`}>
                <UnderlineSelect
                  id="r-area"
                  value={areaFilter ?? ""}
                  onChange={(e) => setAreaFilter(e.target.value || null)}
                >
                  <option value="">All pitches ({pitchTotal})</option>
                  {areas.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </UnderlineSelect>
                {areaFilter && (
                  <div className="mt-2.5">
                    <AppliedTag onRemove={() => setAreaFilter(null)}>{areaFilter}</AppliedTag>
                  </div>
                )}
              </Field>

              <Field label="Format">
                <RuledRadioGroup
                  name="report-format"
                  legend="Format"
                  value={format}
                  onChange={(v) => setFormat(v as Format)}
                  options={FORMATS.map((f) => ({ value: f, label: f }))}
                />
              </Field>

              <div>
                <SplitButton
                  label={exporting ? "Preparing…" : `Export ${format}`}
                  loading={exporting}
                  onClick={runExport}
                  className="w-full"
                />
                <p className="mt-3 font-spline text-[12px] leading-snug text-ink-muted">
                  Maps to Statistics Finland figures · logged to audit trail
                </p>
              </div>
            </div>
          </LedgerFrame>
        </div>

        {/* preview document frame */}
        <LedgerFrame
          shadow
          bodyClassName="p-0"
          header={
            <span className="font-spline text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
              {previewTitle}
            </span>
          }
        >
          <div
            className={`transition-opacity duration-150 motion-reduce:transition-none ${
              fade ? "opacity-0" : "opacity-100"
            }`}
          >
            {preview}
          </div>
        </LedgerFrame>
      </div>
    </>
  );
}
