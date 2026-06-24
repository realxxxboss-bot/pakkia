import Link from "next/link";
import {
  DataTable,
  PageHeader,
  StatCard,
  type Column,
} from "@/components/dashboard/primitives";
import { DownloadIcon } from "@/components/dashboard/icons";
import { monthHistory, seasonStats, weeklyTrend } from "../data";

type MonthRow = (typeof monthHistory)[number];

const columns: Column<MonthRow>[] = [
  {
    key: "month",
    header: "Month",
    render: (r) => (
      <span className="font-medium">
        {r.month}
        {r.note && (
          <span className="ml-2 text-[12.5px] font-normal text-muted">
            · {r.note}
          </span>
        )}
      </span>
    ),
  },
  {
    key: "nights",
    header: "Nights logged",
    align: "right",
    className: "nums font-mono text-secondary",
    render: (r) => r.nights,
  },
  {
    key: "pn",
    header: "Person-nights",
    align: "right",
    className: "nums font-mono font-semibold text-primary",
    render: (r) => r.personNights,
  },
];

export default function PitchHolderSummary() {
  const peak = Math.max(...weeklyTrend.map((w) => w.value));

  return (
    <>
      <PageHeader
        title="Summary"
        subtitle="A quick look at how your pitch is doing this season."
        actions={
          <Link
            href="#"
            className="group inline-flex items-center gap-2 rounded-[10px] bg-primary px-4 py-2.5 text-[14.5px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.98]"
          >
            <DownloadIcon size={17} />
            Export report
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
        {/* season hero */}
        <div className="relative overflow-hidden rounded-[16px] bg-dark p-7 text-white shadow-dark">
          <p className="font-eyebrow text-[10px] font-semibold tracking-[0.12em] text-amber uppercase">
            This season · 2026
          </p>
          <p className="nums mt-3 font-heading text-[52px] font-semibold leading-none tracking-[-0.02em]">
            {seasonStats.personNights}
          </p>
          <p className="mt-2.5 text-[14px] text-white/70">
            person-nights across {seasonStats.nightsLogged} nights logged
          </p>

          <div
            className="mt-7 flex h-[110px] items-end gap-2"
            aria-hidden
          >
            {weeklyTrend.map((w) => (
              <div
                key={w.label}
                className="relative flex-1 rounded-[5px] bg-white/10"
              >
                <span
                  className="absolute inset-x-0 bottom-0 rounded-[5px] bg-amber"
                  style={{ height: `${Math.round((w.value / peak) * 100)}%` }}
                />
              </div>
            ))}
          </div>
          <p className="mt-3 font-eyebrow text-[10px] font-semibold tracking-[0.1em] text-white/45 uppercase">
            Person-nights by week
          </p>
        </div>

        {/* key stats */}
        <div className="grid grid-cols-2 gap-4 self-stretch">
          <StatCard label="June nights" value={seasonStats.juneNights} />
          <StatCard label="Busiest night" value={seasonStats.busiestNight} unit="persons" />
          <StatCard label="Avg per night" value={seasonStats.avgPerNight} />
          <StatCard label="Occupancy" value={seasonStats.occupancy} unit="%" />
        </div>
      </div>

      <section className="mt-7">
        <h2 className="mb-3.5 text-[16px] font-semibold">By month</h2>
        <DataTable
          columns={columns}
          rows={monthHistory}
          getRowKey={(r) => r.month}
          caption="Person-nights logged by month this season"
        />
      </section>
    </>
  );
}
