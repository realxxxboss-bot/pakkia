import Link from "next/link";
import { Card, SectionTitle } from "@/components/dashboard/primitives";
import {
  AlertIcon,
  CheckIcon,
  DownloadIcon,
  EditIcon,
  TrendUpIcon,
  UsersIcon,
} from "@/components/dashboard/icons";
import {
  dashboardKpis,
  nightsAxis,
  nightsTrend,
  occupancy,
  pendingEntries,
  recentActivity,
  today,
  type ActivityKind,
  type Kpi,
} from "../data";

const DELTA_TONE: Record<Kpi["tone"], string> = {
  up: "text-primary",
  warn: "text-amber-ink",
  flat: "text-muted",
};

function KpiCard({ kpi }: { kpi: Kpi }) {
  return (
    <div className="rounded-[14px] border border-border bg-surface p-5 shadow-xs transition-[transform,box-shadow] duration-200 ease-[var(--ease-out)] hover:-translate-y-0.5 hover:shadow-sm motion-reduce:hover:translate-y-0">
      <p className="font-eyebrow text-[10px] font-semibold tracking-[0.1em] text-muted uppercase">
        {kpi.label}
      </p>
      <p className="mt-3 flex items-baseline gap-1.5">
        <span className="nums font-mono text-[30px] font-semibold tracking-[-0.02em] text-primary">
          {kpi.value}
        </span>
        {kpi.unit && (
          <span className="text-[14px] font-medium text-muted">{kpi.unit}</span>
        )}
      </p>
      <p
        className={`mt-2 flex items-center gap-1.5 text-[12.5px] font-medium ${DELTA_TONE[kpi.tone]}`}
      >
        {kpi.tone === "warn" ? (
          <AlertIcon size={13} />
        ) : kpi.tone === "up" ? (
          <TrendUpIcon size={13} />
        ) : null}
        {kpi.hint}
      </p>
    </div>
  );
}

function NightsChart() {
  const peak = Math.max(...nightsTrend);
  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="text-[15px] font-semibold">Nights logged — June 2026</h3>
        <span className="font-eyebrow text-[10px] font-semibold tracking-[0.1em] text-muted uppercase">
          Daily total
        </span>
      </div>
      <div className="px-5 py-5">
        <div className="flex h-[170px] items-end gap-[3px]" aria-hidden>
          {nightsTrend.map((v, i) => {
            const isPeak = v === peak;
            return (
              <div
                key={i}
                className="relative flex-1 overflow-hidden rounded-[4px] bg-subtle"
              >
                <span
                  className={`absolute inset-x-0 bottom-0 rounded-[4px] transition-[height] duration-500 ease-[var(--ease-out)] motion-reduce:transition-none ${
                    isPeak ? "bg-amber" : "bg-primary"
                  }`}
                  style={{ height: `${Math.round((v / peak) * 100)}%` }}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-2.5 flex justify-between font-eyebrow text-[10px] font-semibold tracking-[0.06em] text-muted uppercase">
          {nightsAxis.map((a) => (
            <span key={a}>{a}</span>
          ))}
        </div>
      </div>
    </Card>
  );
}

function OccupancyRing() {
  const size = 128;
  const stroke = 16;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const filled = (occupancy.pct / 100) * c;

  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="text-[15px] font-semibold">Occupancy</h3>
        <span className="font-eyebrow text-[10px] font-semibold tracking-[0.1em] text-muted uppercase">
          Season to date
        </span>
      </div>
      <div className="flex flex-1 items-center gap-6 px-5 py-5">
        <div className="relative h-[128px] w-[128px] flex-none" aria-hidden>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="var(--color-subtle)"
              strokeWidth={stroke}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${filled} ${c - filled}`}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="nums font-mono text-[26px] font-semibold tracking-[-0.02em] text-primary">
              {occupancy.pct}%
            </span>
            <span className="font-eyebrow text-[9px] font-semibold tracking-[0.1em] text-muted uppercase">
              Booked
            </span>
          </div>
        </div>
        <ul className="flex flex-col gap-3 text-[13px]">
          <li className="flex items-center gap-2.5">
            <span className="h-3 w-3 flex-none rounded-[4px] bg-primary" />
            <span className="text-secondary">Occupied</span>
            <span className="nums font-mono font-semibold text-ink">
              {occupancy.pct}%
            </span>
          </li>
          <li className="flex items-center gap-2.5">
            <span className="h-3 w-3 flex-none rounded-[4px] bg-subtle ring-1 ring-inset ring-border" />
            <span className="text-secondary">Vacant</span>
            <span className="nums font-mono font-semibold text-ink">
              {100 - occupancy.pct}%
            </span>
          </li>
          <li className="mt-1 text-[12px] text-muted">Peak: {occupancy.peak}</li>
        </ul>
      </div>
    </Card>
  );
}

const ACTIVITY_ICON: Record<ActivityKind, React.ReactNode> = {
  logged: <CheckIcon size={15} />,
  edited: <EditIcon size={15} />,
  invited: <UsersIcon size={15} />,
  exported: <DownloadIcon size={15} />,
};

export default function AdminDashboard() {
  return (
    <>
      <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[clamp(26px,3.4vw,34px)] leading-[1.05]">
            {today.label}
          </h1>
          <p className="mt-1.5 max-w-[60ch] text-[15px] text-secondary">
            Here&apos;s how Rairanta is tracking this month. 3 pitches still need
            today&apos;s entry.
          </p>
        </div>
        <Link
          href="/admin/reports"
          className="inline-flex flex-none items-center gap-2 rounded-[10px] bg-primary px-4 py-2.5 text-[14.5px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.98]"
        >
          <DownloadIcon size={17} />
          Export report
        </Link>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {dashboardKpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-stretch">
        <NightsChart />
        <OccupancyRing />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        {/* pitches needing entry */}
        <section>
          <SectionTitle
            title="Pitches needing today's entry"
            action={
              <span className="rounded-full bg-amber/15 px-2.5 py-1 text-[11.5px] font-semibold text-amber-ink">
                3 pending
              </span>
            }
          />
          <Card className="overflow-hidden">
            <ul>
              {pendingEntries.map((p) => (
                <li
                  key={p.code}
                  className="flex items-center gap-3 border-b border-border px-4 py-3.5 last:border-0"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14.5px] font-semibold text-ink">
                      {p.code}{" "}
                      <span className="font-normal text-muted">· {p.area}</span>
                    </span>
                    <span className="block truncate text-[12.5px] text-muted">
                      {p.holder}
                    </span>
                  </span>
                  <span className="hidden flex-none rounded-full bg-amber/15 px-2.5 py-1 text-[11.5px] font-semibold text-amber-ink sm:inline-flex">
                    Missing
                  </span>
                  <button
                    type="button"
                    className="flex-none rounded-[9px] px-3 py-1.5 text-[13px] font-semibold text-primary ring-1 ring-border transition-colors duration-150 hover:bg-subtle"
                  >
                    Remind
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* recent activity */}
        <section>
          <SectionTitle
            title="Recent activity"
            action={
              <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Live
              </span>
            }
          />
          <Card className="px-5 py-2">
            <ul>
              {recentActivity.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3 border-b border-border py-3.5 last:border-0"
                >
                  <span
                    className="mt-0.5 grid h-8 w-8 flex-none place-items-center rounded-[10px] bg-subtle text-primary"
                    aria-hidden
                  >
                    {ACTIVITY_ICON[item.kind]}
                  </span>
                  <p className="flex-1 text-[13.5px] leading-snug text-secondary">
                    <span className="font-semibold text-ink">
                      {item.highlight}
                    </span>{" "}
                    {item.text}
                    {item.tail && (
                      <>
                        {" "}
                        <span className="font-semibold text-ink">
                          {item.tail}
                        </span>
                      </>
                    )}
                  </p>
                  <span className="flex-none font-eyebrow text-[10px] font-semibold tracking-[0.06em] text-muted uppercase">
                    {item.time}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      </div>
    </>
  );
}
