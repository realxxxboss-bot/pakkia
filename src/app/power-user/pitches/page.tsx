"use client";

import { useEffect, useMemo, useState } from "react";
import { Map } from "lucide-react";
import {
  ContentHeader,
  FilterBar,
  FilterSelect,
  HeatCell,
  HeatGrid,
  HeatLegend,
  Ledger,
  StatusSquare,
  UnderlineLink,
  type HeatGridRow,
  type LedgerColumn,
} from "@/components/portal";
import {
  HEAT_DAYS,
  HEAT_RANGE,
  eventDays,
  heatRanges,
  holders,
  pitchRecords,
  recordBusiest,
  recordLastLogged,
  recordNights,
  recordOccupancy,
  recordPersonNights,
  recordUnloggedRecently,
  type PitchRecord,
} from "../data";

const DAY_LABELS = Array.from({ length: HEAT_DAYS }, (_, i) => String(i + 1));

/* Event days that fall inside the 1–19 June window, as column indexes. */
const EVENT_INDEXES = new Set(
  [...eventDays].filter((d) => d <= HEAT_DAYS).map((d) => d - 1),
);

export default function PowerUserPitches() {
  const [range, setRange] = useState<string>(HEAT_RANGE);
  const [pitch, setPitch] = useState("all");
  const [client, setClient] = useState("all");
  const [unloggedOnly, setUnloggedOnly] = useState(false);

  /* Deep-links: the dashboard's "Logged tonight" hero cell sends
     ?filter=unlogged; the assignments row menu sends ?pitch=B-09. Read on
     mount, so the page still prerenders (no Suspense fallback). */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("filter") === "unlogged") setUnloggedOnly(true);
    const p = params.get("pitch");
    if (p && pitchRecords.some((r) => r.code === p)) setPitch(p);
  }, []);

  const rows = useMemo(
    () =>
      pitchRecords.filter((r) => {
        if (pitch !== "all" && r.code !== pitch) return false;
        if (client !== "all" && r.holder !== client) return false;
        if (unloggedOnly && !recordUnloggedRecently(r)) return false;
        return true;
      }),
    [pitch, client, unloggedOnly],
  );

  const columns: LedgerColumn<PitchRecord>[] = [
    {
      key: "code",
      header: "Pitch",
      render: (r) => (
        <span className="font-spline text-[0.9375rem] font-medium tabular-nums text-ink-900">
          {r.code}
        </span>
      ),
    },
    { key: "area", header: "Area", render: (r) => r.area },
    {
      key: "client",
      header: "Client",
      render: (r) => r.holder ?? <span className="text-ink-muted">— Unassigned</span>,
    },
    { key: "nights", header: "Nights", numeric: true, render: (r) => recordNights(r) },
    {
      key: "personNights",
      header: "Person-nights",
      numeric: true,
      render: (r) => recordPersonNights(r),
    },
    {
      key: "busiest",
      header: "Busiest",
      align: "right",
      render: (r) => (
        <span className="inline-flex items-center justify-end gap-2">
          <HeatCell
            value={recordBusiest(r)}
            display=""
            size={12}
            label={`busiest night, ${recordBusiest(r)} persons`}
          />
          <span className="font-spline tabular-nums text-ink-900">{recordBusiest(r)}</span>
        </span>
      ),
    },
    {
      key: "last",
      header: "Last logged",
      align: "right",
      render: (r) => (
        <span className="inline-flex items-center justify-end gap-2 font-spline text-[0.9375rem] tabular-nums text-ink-900">
          {recordUnloggedRecently(r) && <StatusSquare variant="anomaly" />}
          {recordLastLogged(r)}
        </span>
      ),
    },
    {
      key: "occupancy",
      header: "Occupancy",
      numeric: true,
      render: (r) => `${recordOccupancy(r)}%`,
    },
  ];

  const gridRows: HeatGridRow[] = rows.map((r) => ({
    key: r.code,
    label: r.code,
    secondary: r.holder ?? "— Unassigned",
    values: r.counts,
  }));

  return (
    <>
      <ContentHeader
        title="Pitches"
        description="View overnight data across every pitch. Filter by date range, pitch number or client."
      />

      <p className="-mt-4 mb-6 font-spline text-[12px] uppercase tracking-[0.12em] text-ink-muted">
        Read-only view · counts are logged by holders
      </p>

      <FilterBar>
        <FilterSelect
          label="Range"
          value={range}
          onChange={setRange}
          options={heatRanges.map((r) => ({ value: r, label: r }))}
        />
        <FilterSelect
          label="Pitch"
          value={pitch}
          onChange={setPitch}
          options={[
            { value: "all", label: "All" },
            ...pitchRecords.map((r) => ({ value: r.code, label: r.code })),
          ]}
        />
        <FilterSelect
          label="Client"
          value={client}
          onChange={setClient}
          options={[
            { value: "all", label: "All" },
            ...holders.map((h) => ({ value: h, label: h })),
          ]}
        />
        <FilterSelect
          label="Logging"
          value={unloggedOnly ? "unlogged" : "all"}
          onChange={(v) => setUnloggedOnly(v === "unlogged")}
          options={[
            { value: "all", label: "All" },
            { value: "unlogged", label: "Unlogged tonight" },
          ]}
        />
        <span className="ml-auto font-spline text-[11px] uppercase tracking-[0.12em] text-ink-muted">
          {rows.length} {rows.length === 1 ? "pitch" : "pitches"}
        </span>
      </FilterBar>

      <section>
        <h2 className="mb-3.5 font-familjen text-[1.0625rem] font-semibold tracking-[-0.02em] text-pine-900">
          Overnight summary
        </h2>
        <Ledger
          caption="Overnight summary by pitch"
          columns={columns}
          rows={rows}
          getKey={(r) => r.code}
          empty={{
            icon: <Map size={24} strokeWidth={1.5} />,
            title: "No pitches match.",
            guidance: "Try a different pitch or client, or clear the filters.",
            action: (
              <UnderlineLink
                onClick={() => {
                  setPitch("all");
                  setClient("all");
                  setUnloggedOnly(false);
                }}
              >
                Clear filters
              </UnderlineLink>
            ),
          }}
        />
      </section>

      {/* The signature screen: every night of the range, every pitch, at a glance. */}
      <section className="mt-8">
        <h2 className="mb-3.5 font-familjen text-[1.0625rem] font-semibold tracking-[-0.02em] text-pine-900">
          Nightly heat view
        </h2>
        <HeatGrid
          caption={`Persons logged per pitch per night, ${range}`}
          rows={gridRows}
          dayLabels={DAY_LABELS}
          monthLabel="Jun"
          todayIndex={HEAT_DAYS - 1}
          eventIndexes={EVENT_INDEXES}
          header={
            <>
              <span className="font-spline text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
                {range}
              </span>
              <span className="font-spline text-[11px] uppercase tracking-[0.1em] text-ink-muted">
                Persons per night
              </span>
            </>
          }
        />
        <div className="mt-4">
          <HeatLegend today={false} />
        </div>
      </section>
    </>
  );
}
