"use client";

import { useState } from "react";
import { Card, PageHeader } from "@/components/dashboard/primitives";
import { ChevronDownIcon, DownloadIcon } from "@/components/dashboard/icons";
import { inputClass, labelClass } from "@/components/auth/fields";
import { reportRows, reportTotals, reportTypes } from "../data";

const FORMATS = ["CSV", "PDF"] as const;

export default function AdminReports() {
  const [type, setType] = useState<(typeof reportTypes)[number]>(reportTypes[0]);
  const [format, setFormat] = useState<(typeof FORMATS)[number]>("CSV");

  return (
    <>
      <PageHeader
        title="Reports & export"
        subtitle="Build a report, preview the totals, and export in the format Statistics Finland accepts."
      />

      <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
        {/* options */}
        <Card>
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-[15px] font-semibold">Options</h3>
          </div>
          <div className="flex flex-col gap-5 p-5">
            <fieldset>
              <legend className={labelClass}>Report type</legend>
              <div className="mt-3 flex flex-col gap-2.5">
                {reportTypes.map((t) => {
                  const on = type === t;
                  return (
                    <label
                      key={t}
                      className="flex cursor-pointer items-center gap-2.5 text-[14px] text-ink"
                    >
                      <input
                        type="radio"
                        name="report-type"
                        checked={on}
                        onChange={() => setType(t)}
                        className="peer sr-only"
                      />
                      <span
                        className={`grid h-[18px] w-[18px] flex-none place-items-center rounded-full border-2 transition-colors duration-150 ${
                          on ? "border-primary" : "border-border-strong"
                        }`}
                        aria-hidden
                      >
                        {on && (
                          <span className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </span>
                      {t}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Period</span>
              <input className={inputClass} defaultValue="June 2026" />
            </label>

            <div className="flex flex-col gap-1.5">
              <span className={labelClass}>Pitches</span>
              <span className="flex items-center justify-between gap-2 rounded-[10px] border border-border bg-surface px-4 py-3 text-[14px] text-ink">
                All pitches (60)
                <ChevronDownIcon size={16} className="text-muted" />
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className={labelClass}>Format</span>
              <div
                role="radiogroup"
                aria-label="Format"
                className="flex gap-1.5 rounded-[12px] bg-subtle p-1.5"
              >
                {FORMATS.map((f) => {
                  const on = format === f;
                  return (
                    <button
                      key={f}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setFormat(f)}
                      className={`flex-1 rounded-[9px] px-3 py-2 text-[13.5px] font-semibold transition-colors duration-150 ${
                        on
                          ? "bg-primary text-white shadow-sm"
                          : "text-secondary hover:text-ink"
                      }`}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-primary px-5 py-3 text-[15px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.99]"
            >
              <DownloadIcon size={18} />
              Export report
            </button>
          </div>
        </Card>

        {/* preview */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <h3 className="text-[15px] font-semibold">
              Preview — {type} · June 2026
            </h3>
            <span className="font-eyebrow text-[10px] font-semibold tracking-[0.1em] text-muted uppercase">
              Totals
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[14px]">
              <caption className="sr-only">
                June 2026 monthly summary preview
              </caption>
              <thead>
                <tr className="border-b border-border">
                  {["Pitch", "Area", "Nights", "Person-nights", "Occupancy"].map(
                    (h, i) => (
                      <th
                        key={h}
                        scope="col"
                        className={`px-5 py-3.5 font-eyebrow text-[10.5px] font-semibold tracking-[0.08em] text-muted uppercase ${
                          i >= 2 ? "text-right" : "text-left"
                        }`}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {reportRows.map((r) => (
                  <tr
                    key={r.code}
                    className="border-b border-border transition-colors duration-150 hover:bg-subtle/60"
                  >
                    <td className="px-5 py-3.5 font-semibold text-ink">
                      {r.code}
                    </td>
                    <td className="px-5 py-3.5 text-secondary">{r.area}</td>
                    <td className="nums px-5 py-3.5 text-right font-mono text-secondary">
                      {r.nights}
                    </td>
                    <td className="nums px-5 py-3.5 text-right font-mono font-semibold text-ink">
                      {r.personNights}
                    </td>
                    <td className="nums px-5 py-3.5 text-right font-mono text-secondary">
                      {r.occupancy}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-subtle/70">
                  <td
                    className="px-5 py-3.5 font-semibold text-ink"
                    colSpan={2}
                  >
                    Total · 60 pitches
                  </td>
                  <td className="px-5 py-3.5 text-right text-muted">—</td>
                  <td className="nums px-5 py-3.5 text-right font-mono font-semibold text-primary">
                    {reportTotals.personNights.toLocaleString()}
                  </td>
                  <td className="nums px-5 py-3.5 text-right font-mono font-semibold text-primary">
                    {reportTotals.occupancy}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
