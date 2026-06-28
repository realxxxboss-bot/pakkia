"use client";

import { useMemo, useState } from "react";
import { Card, PageHeader, StatCard } from "@/components/dashboard/primitives";
import { DownloadIcon } from "@/components/dashboard/icons";
import { areaSummary, areas, type AreaSummary } from "../data";

export default function PowerUserReports() {
  const [area, setArea] = useState<string>("All");

  const rows = useMemo<AreaSummary[]>(
    () =>
      area === "All"
        ? areaSummary
        : areaSummary.filter((a) => a.area === area),
    [area],
  );

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, a) => ({
          pitches: acc.pitches + a.pitches,
          nights: acc.nights + a.nights,
          personNights: acc.personNights + a.personNights,
        }),
        { pitches: 0, nights: 0, personNights: 0 },
      ),
    [rows],
  );

  const avgOcc = rows.length
    ? Math.round(rows.reduce((s, a) => s + a.occupancy, 0) / rows.length)
    : 0;

  const exportCsv = () => {
    const header = ["Area", "Pitches", "Nights", "Person-nights", "Occupancy %"];
    const lines = rows.map((r) =>
      [r.area, r.pitches, r.nights, r.personNights, r.occupancy].join(","),
    );
    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rairanta-june-2026-summary.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Quick per-area and date-range summaries. For the full Statistics Finland export, ask an admin."
      />

      {/* toolbar */}
      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <label className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-[13.5px] font-medium text-secondary shadow-xs">
          <span className="text-muted">Month</span>
          <select
            defaultValue="June 2026"
            aria-label="Select month"
            className="bg-transparent font-semibold text-ink focus:outline-none"
          >
            <option>June 2026</option>
            <option>May 2026</option>
            <option>April 2026</option>
          </select>
        </label>
        <label className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-[13.5px] font-medium text-secondary shadow-xs">
          <span className="text-muted">Area</span>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            aria-label="Filter by area"
            className="bg-transparent font-semibold text-ink focus:outline-none"
          >
            <option value="All">All</option>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={exportCsv}
          className="ml-auto inline-flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-[14px] font-semibold text-primary ring-1 ring-border transition-colors duration-150 ease-[var(--ease-out)] hover:bg-subtle hover:text-primary-dark active:scale-[0.98]"
        >
          <DownloadIcon size={17} />
          Export CSV
        </button>
      </div>

      {/* headline stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Pitches" value={totals.pitches} />
        <StatCard label="Nights" value={totals.nights.toLocaleString("en")} />
        <StatCard
          label="Person-nights"
          value={totals.personNights.toLocaleString("en")}
          emphasis
        />
        <StatCard label="Avg occupancy" value={avgOcc} unit="%" />
      </div>

      {/* table */}
      <Card className="mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-[16px] font-semibold">Summary by area — June 2026</h2>
          <span className="font-eyebrow text-[10px] font-semibold tracking-[0.1em] text-muted uppercase">
            Totals
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-[14.5px]">
            <thead>
              <tr className="border-b border-border">
                <Th>Area</Th>
                <Th align="right">Pitches</Th>
                <Th align="right">Nights</Th>
                <Th align="right">Person-nights</Th>
                <Th align="right">Occupancy</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.area}
                  className="border-b border-border transition-colors duration-150 hover:bg-subtle/60"
                >
                  <td className="px-5 py-3.5 font-heading font-semibold text-ink">
                    {r.area}
                  </td>
                  <td className="nums px-5 py-3.5 text-right text-secondary">
                    {r.pitches}
                  </td>
                  <td className="nums px-5 py-3.5 text-right text-secondary">
                    {r.nights}
                  </td>
                  <td className="nums px-5 py-3.5 text-right font-semibold text-primary">
                    {r.personNights.toLocaleString("en")}
                  </td>
                  <td className="px-5 py-3.5">
                    <OccBar value={r.occupancy} />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-sky/50">
                <td className="px-5 py-3.5 font-heading font-semibold text-ink">
                  {area === "All" ? "All areas" : area}
                </td>
                <td className="nums px-5 py-3.5 text-right font-semibold text-ink">
                  {totals.pitches}
                </td>
                <td className="nums px-5 py-3.5 text-right font-semibold text-ink">
                  {totals.nights.toLocaleString("en")}
                </td>
                <td className="nums px-5 py-3.5 text-right font-semibold text-primary">
                  {totals.personNights.toLocaleString("en")}
                </td>
                <td className="px-5 py-3.5">
                  <OccBar value={avgOcc} />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      scope="col"
      className={`px-5 py-3.5 font-eyebrow text-[10.5px] font-semibold tracking-[0.08em] text-muted uppercase ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function OccBar({ value }: { value: number }) {
  return (
    <div className="flex items-center justify-end gap-2.5">
      <span className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-subtle sm:block">
        <span
          className="block h-full rounded-full bg-occ-3"
          style={{ width: `${value}%` }}
        />
      </span>
      <span className="nums w-9 text-right font-semibold text-ink">{value}%</span>
    </div>
  );
}
