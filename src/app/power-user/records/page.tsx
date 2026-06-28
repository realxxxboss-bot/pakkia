"use client";

import { useState } from "react";
import { Card, PageHeader } from "@/components/dashboard/primitives";
import { PlusIcon } from "@/components/dashboard/icons";
import {
  QuickEntry,
  type QuickEntryTarget,
} from "@/components/power-user/QuickEntry";
import {
  HEAT_DAYS,
  areas,
  heatLevel,
  heatPitches,
  rowTotal,
  today,
  type HeatLevel,
} from "../data";

const LEVEL_CLASS: Record<HeatLevel, string> = {
  0: "bg-subtle text-muted hover:bg-container",
  1: "bg-occ-1 text-primary-dark hover:brightness-[0.98]",
  2: "bg-occ-2 text-primary-dark hover:brightness-[0.98]",
  3: "bg-occ-3 text-white hover:brightness-[0.97]",
  4: "bg-dark text-white hover:brightness-[1.1]",
};

const LEGEND_SWATCHES = ["bg-subtle", "bg-occ-1", "bg-occ-2", "bg-occ-3", "bg-dark"];

export default function PowerUserRecords() {
  const [area, setArea] = useState<string>("All");
  const [entry, setEntry] = useState<QuickEntryTarget | null>(null);

  const rows =
    area === "All" ? heatPitches : heatPitches.filter((p) => p.area === area);

  const openCell = (code: string, areaName: string, day: number, value: number) =>
    setEntry({
      title: `${code} · ${day} Jun`,
      pitch: `${code} · ${areaName}`,
      dateISO: `2026-06-${String(day).padStart(2, "0")}`,
      persons: value,
    });

  return (
    <>
      <PageHeader
        title="Records"
        subtitle="Nightly counts across pitches. Tap any cell to set or edit a number."
      />

      {/* toolbar */}
      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <FilterSelect label="Range" value="Jun 1–16, 2026" options={["Jun 1–16, 2026"]} />
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
          onClick={() =>
            setEntry({
              title: "Log a night",
              pitch: "",
              dateISO: today.dateISO,
              persons: 0,
            })
          }
          className="ml-auto inline-flex items-center gap-2 rounded-[10px] bg-primary px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.98]"
        >
          <PlusIcon size={17} />
          Quick entry
        </button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto p-4 sm:p-5">
          <table className="w-full min-w-[720px] border-separate border-spacing-[3px]">
            <thead>
              <tr>
                <th className="w-[130px] pb-2 pl-1 text-left font-eyebrow text-[10px] font-semibold tracking-[0.06em] text-muted uppercase">
                  Pitch
                </th>
                {Array.from({ length: HEAT_DAYS }, (_, i) => (
                  <th
                    key={i}
                    className="nums pb-2 text-center font-eyebrow text-[10.5px] font-semibold text-muted"
                  >
                    {i + 1}
                  </th>
                ))}
                <th className="w-[64px] pb-2 pr-1 text-right font-eyebrow text-[10px] font-semibold tracking-[0.06em] text-muted uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.code}>
                  <td className="py-1 pl-1 pr-2 align-middle">
                    <span className="font-heading text-[13.5px] font-semibold text-ink">
                      {p.code}
                    </span>
                    <span className="block text-[11px] text-muted">{p.area}</span>
                  </td>
                  {p.counts.map((v, d) => {
                    const day = d + 1;
                    return (
                      <td key={day} className="p-0 text-center align-middle">
                        <button
                          type="button"
                          onClick={() => openCell(p.code, p.area, day, v)}
                          aria-label={`${p.code}, ${day} June — ${v} persons`}
                          className={`nums grid h-7 w-7 place-items-center rounded-[7px] text-[11px] font-semibold transition-transform duration-150 ease-[var(--ease-out)] hover:scale-[1.14] focus-visible:outline-2 motion-reduce:hover:scale-100 ${LEVEL_CLASS[heatLevel(v)]}`}
                        >
                          {v}
                        </button>
                      </td>
                    );
                  })}
                  <td className="nums py-1 pr-1 text-right align-middle font-heading text-[14px] font-semibold text-primary">
                    {rowTotal(p)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-border px-5 py-3.5 text-[12.5px] text-secondary">
          <span>Fewer</span>
          {LEGEND_SWATCHES.map((c) => (
            <span key={c} className={`h-4 w-4 rounded-[5px] ${c}`} />
          ))}
          <span>More</span>
          <span className="ml-1 text-muted">· tap a cell to edit</span>
        </div>
      </Card>

      <QuickEntry
        target={entry}
        onClose={() => setEntry(null)}
        onSave={() => setEntry(null)}
      />
    </>
  );
}

function FilterSelect({
  label,
  value,
  options,
}: {
  label: string;
  value: string;
  options: string[];
}) {
  return (
    <label className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-[13.5px] font-medium text-secondary shadow-xs">
      <span className="text-muted">{label}</span>
      <select
        defaultValue={value}
        aria-label={label}
        className="bg-transparent font-semibold text-ink focus:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
