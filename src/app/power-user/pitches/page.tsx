"use client";

import { useMemo, useState } from "react";
import { Card, EmptyState, PageHeader } from "@/components/dashboard/primitives";
import { FilterIcon, GridIcon } from "@/components/dashboard/icons";
import {
  HEAT_DAYS,
  HEAT_RANGE,
  heatLevel,
  holders,
  pitchRecords,
  recordBusiest,
  recordLastLogged,
  recordNights,
  recordOccupancy,
  recordPersonNights,
  type HeatLevel,
  type PitchRecord,
} from "../data";

const LEVEL_CLASS: Record<HeatLevel, string> = {
  0: "bg-subtle text-muted",
  1: "bg-occ-1 text-primary-dark",
  2: "bg-occ-2 text-primary-dark",
  3: "bg-occ-3 text-white",
  4: "bg-dark text-white",
};

const LEGEND_SWATCHES = ["bg-subtle", "bg-occ-1", "bg-occ-2", "bg-occ-3", "bg-dark"];

const RANGES = [HEAT_RANGE, "Jun 1–8, 2026", "May 2026"] as const;

const filterSelect =
  "rounded-full border border-border bg-surface px-4 py-2 text-[13.5px] font-medium text-secondary shadow-xs";
const selectInner = "bg-transparent font-semibold text-ink focus:outline-none";

export default function PowerUserPitches() {
  const [range, setRange] = useState<string>(RANGES[0]);
  const [pitch, setPitch] = useState<string>("All");
  const [client, setClient] = useState<string>("All");

  const pitchCodes = pitchRecords.map((p) => p.code);

  const rows = useMemo<PitchRecord[]>(
    () =>
      pitchRecords.filter((p) => {
        if (pitch !== "All" && p.code !== pitch) return false;
        if (client !== "All" && p.holder !== client) return false;
        return true;
      }),
    [pitch, client],
  );

  const reset = () => {
    setPitch("All");
    setClient("All");
  };

  const anyFilter = pitch !== "All" || client !== "All";

  return (
    <>
      <PageHeader
        title="Pitches"
        subtitle="View overnight data across every pitch. Filter by date range, pitch number or client. Counts are logged by the holders — this is a read-only view."
      />

      {/* filters */}
      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-muted">
          <FilterIcon size={16} />
          Filters
        </span>
        <label className={filterSelect}>
          <span className="text-muted">Range</span>{" "}
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            aria-label="Filter by date range"
            className={selectInner}
          >
            {RANGES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label className={filterSelect}>
          <span className="text-muted">Pitch</span>{" "}
          <select
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            aria-label="Filter by pitch"
            className={selectInner}
          >
            <option value="All">All</option>
            {pitchCodes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className={filterSelect}>
          <span className="text-muted">Client</span>{" "}
          <select
            value={client}
            onChange={(e) => setClient(e.target.value)}
            aria-label="Filter by client"
            className={selectInner}
          >
            <option value="All">All</option>
            {holders.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </label>
        {anyFilter && (
          <button
            type="button"
            onClick={reset}
            className="text-[13px] font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            Clear
          </button>
        )}
        <span className="ml-auto font-eyebrow text-[10px] font-semibold tracking-[0.08em] text-muted uppercase">
          {rows.length} {rows.length === 1 ? "pitch" : "pitches"}
        </span>
      </div>

      {rows.length === 0 ? (
        <Card className="p-2">
          <EmptyState
            icon={<GridIcon size={22} />}
            title="No pitches match"
            description="Try a different pitch or client, or clear the filters."
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {/* table */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-[16px] font-semibold">Overnight summary</h2>
              <span className="font-eyebrow text-[10px] font-semibold tracking-[0.1em] text-muted uppercase">
                {range}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-[14.5px]">
                <caption className="sr-only">
                  Overnight data per pitch for {range}
                </caption>
                <thead>
                  <tr className="border-b border-border">
                    <Th>Pitch</Th>
                    <Th>Area</Th>
                    <Th>Client</Th>
                    <Th align="right">Nights</Th>
                    <Th align="right">Person-nights</Th>
                    <Th align="right">Busiest</Th>
                    <Th align="right">Last logged</Th>
                    <Th align="right">Occupancy</Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p) => (
                    <tr
                      key={p.code}
                      className="border-b border-border last:border-0 transition-colors duration-150 hover:bg-subtle/60"
                    >
                      <td className="px-5 py-3.5 font-heading font-semibold text-ink">
                        {p.code}
                      </td>
                      <td className="px-5 py-3.5 text-secondary">{p.area}</td>
                      <td className="px-5 py-3.5 text-secondary">
                        {p.holder ?? (
                          <span className="text-muted">Unassigned</span>
                        )}
                      </td>
                      <td className="nums px-5 py-3.5 text-right text-secondary">
                        {recordNights(p)}
                      </td>
                      <td className="nums px-5 py-3.5 text-right font-semibold text-primary">
                        {recordPersonNights(p)}
                      </td>
                      <td className="nums px-5 py-3.5 text-right text-secondary">
                        {recordBusiest(p)}
                      </td>
                      <td className="nums px-5 py-3.5 text-right text-muted">
                        {recordLastLogged(p)}
                      </td>
                      <td className="px-5 py-3.5">
                        <OccBar value={recordOccupancy(p)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* heat view */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-[16px] font-semibold">Nightly heat view</h2>
              <span className="font-eyebrow text-[10px] font-semibold tracking-[0.1em] text-muted uppercase">
                Persons per night
              </span>
            </div>
            <div className="overflow-x-auto p-4 sm:p-5">
              <table className="w-full min-w-[720px] border-separate border-spacing-[3px]">
                <caption className="sr-only">
                  Persons logged per pitch per night, {range}
                </caption>
                <thead>
                  <tr>
                    <th className="w-[140px] pb-2 pl-1 text-left font-eyebrow text-[10px] font-semibold tracking-[0.06em] text-muted uppercase">
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
                        <span className="block text-[11px] text-muted">
                          {p.holder ?? "Unassigned"}
                        </span>
                      </td>
                      {p.counts.map((v, d) => (
                        <td key={d} className="p-0 text-center align-middle">
                          <span
                            title={`${p.code} · ${d + 1} Jun — ${v} ${
                              v === 1 ? "person" : "persons"
                            }`}
                            className={`nums mx-auto grid h-7 w-7 place-items-center rounded-[7px] text-[11px] font-semibold ${LEVEL_CLASS[heatLevel(v)]}`}
                          >
                            {v}
                          </span>
                        </td>
                      ))}
                      <td className="nums py-1 pr-1 text-right align-middle font-heading text-[14px] font-semibold text-primary">
                        {recordPersonNights(p)}
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
              <span className="ml-1 text-muted">· hover a cell for the count</span>
            </div>
          </Card>
        </div>
      )}
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
