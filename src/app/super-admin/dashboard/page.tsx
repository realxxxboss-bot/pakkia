"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, PageHeader, SectionTitle } from "@/components/dashboard/primitives";
import {
  AlertIcon,
  CardIcon,
  DownloadIcon,
  PlusIcon,
  ShieldIcon,
  TrendUpIcon,
} from "@/components/dashboard/icons";
import { Rise } from "@/components/motion";
import {
  Sheet,
  SheetCancel,
  SheetField,
  SheetSave,
  sheetControl,
} from "@/components/power-user/Sheet";
import {
  leads,
  mrrTrend,
  needsAttention,
  overviewKpis,
  planMix,
  planMixTotal,
  recentActivity,
  type ActivityKind,
  type AttentionTone,
  type Kpi,
} from "../data";

const DELTA_TONE: Record<Kpi["tone"], string> = {
  up: "text-primary",
  warn: "text-amber-ink",
  flat: "text-muted",
};

const FLAG_TONE: Record<AttentionTone, string> = {
  trial: "bg-amber/15 text-amber-ink",
  warn: "bg-amber/15 text-amber-ink",
  danger: "bg-error/12 text-error",
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

function MrrChart() {
  const peak = Math.max(...mrrTrend.map((m) => m.value));
  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="text-[15px] font-semibold">Recurring revenue (MRR)</h3>
        <span className="font-eyebrow text-[10px] font-semibold tracking-[0.1em] text-muted uppercase">
          2026
        </span>
      </div>
      <div className="px-5 py-5">
        <div className="flex h-[180px] items-end gap-2.5" aria-hidden>
          {mrrTrend.map((m, i) => {
            const last = i === mrrTrend.length - 1;
            return (
              <div
                key={m.label}
                className="relative flex-1 overflow-hidden rounded-[6px] bg-subtle"
              >
                <span
                  className={`absolute inset-x-0 bottom-0 rounded-[6px] transition-[height] duration-500 ease-[var(--ease-out)] motion-reduce:transition-none ${
                    last ? "bg-amber" : "bg-primary"
                  }`}
                  style={{ height: `${Math.round((m.value / peak) * 100)}%` }}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-2.5 flex justify-between font-eyebrow text-[10px] font-semibold tracking-[0.06em] text-muted uppercase">
          {mrrTrend.map((m) => (
            <span key={m.label}>{m.label}</span>
          ))}
        </div>
      </div>
    </Card>
  );
}

function PlanMixDonut() {
  const size = 128;
  const stroke = 16;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  // Precompute each slice's arc length and start offset (no render mutation).
  const arcs = planMix.map((slice, i) => {
    const len = (slice.count / planMixTotal) * c;
    const offset = planMix
      .slice(0, i)
      .reduce((sum, s) => sum + (s.count / planMixTotal) * c, 0);
    return { ...slice, len, offset };
  });

  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="text-[15px] font-semibold">Plan mix</h3>
        <span className="font-eyebrow text-[10px] font-semibold tracking-[0.1em] text-muted uppercase">
          Active
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
            {arcs.map((arc) => (
              <circle
                key={arc.label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={arc.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${arc.len} ${c - arc.len}`}
                strokeDashoffset={-arc.offset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="nums font-mono text-[27px] font-semibold tracking-[-0.02em] text-primary">
              {planMixTotal}
            </span>
            <span className="font-eyebrow text-[9px] font-semibold tracking-[0.1em] text-muted uppercase">
              Paid
            </span>
          </div>
        </div>
        <ul className="flex flex-col gap-3 text-[13.5px]">
          {planMix.map((slice) => (
            <li key={slice.label} className="flex items-center gap-2.5">
              <span
                className="h-3 w-3 flex-none rounded-[4px]"
                style={{ background: slice.color }}
              />
              <span className="text-secondary">{slice.label}</span>
              <span className="nums font-mono font-semibold text-ink">
                {slice.count}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

const ACTIVITY_ICON: Record<ActivityKind, React.ReactNode> = {
  upgrade: <TrendUpIcon size={15} />,
  provision: <PlusIcon size={15} />,
  export: <DownloadIcon size={15} />,
  invoice: <CardIcon size={15} />,
  admin: <ShieldIcon size={15} />,
};

export default function SuperAdminDashboard() {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Pakkia · Growth Nexus"
        title="Platform overview"
        subtitle="Every campsite on Pakkia at a glance. 2 trials end this week — worth a nudge."
        actions={
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-4 py-2.5 text-[14.5px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.98]"
          >
            <PlusIcon size={17} />
            Add campsite
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {overviewKpis.map((kpi, i) => (
          <Rise key={kpi.label} delay={i * 0.05} y={14}>
            <KpiCard kpi={kpi} />
          </Rise>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-stretch">
        <MrrChart />
        <PlanMixDonut />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        {/* needs attention */}
        <section>
          <SectionTitle
            title="Needs attention"
            action={
              <Link
                href="/super-admin/campsites"
                className="text-[13px] font-semibold text-primary transition-colors hover:text-primary-dark"
              >
                All campsites
              </Link>
            }
          />
          <Card className="overflow-hidden">
            <ul>
              {needsAttention.map((item) => (
                <li
                  key={item.slug}
                  className="flex items-center gap-3 border-b border-border px-4 py-3.5 last:border-0"
                >
                  <span
                    className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-subtle font-heading text-[12px] font-semibold text-primary"
                    aria-hidden
                  >
                    {item.initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <Link
                      href={`/super-admin/campsites/${item.slug}`}
                      className="block truncate text-[14px] font-semibold text-ink transition-colors hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    <span className="block truncate text-[12px] text-muted">
                      {item.slug}.pakkia.fi
                    </span>
                  </span>
                  <span
                    className={`hidden flex-none rounded-full px-2.5 py-1 text-[11.5px] font-semibold sm:inline-flex ${FLAG_TONE[item.flagTone]}`}
                  >
                    {item.flag}
                  </span>
                  <button
                    type="button"
                    className="flex-none rounded-[9px] px-3 py-1.5 text-[13px] font-semibold text-primary ring-1 ring-border transition-colors duration-150 hover:bg-subtle"
                  >
                    {item.action}
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* recent signups */}
        <section>
          <SectionTitle
            title="Recent signups"
            action={
              <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {leads.length} open
              </span>
            }
          />
          <Card className="overflow-hidden">
            <ul>
              {leads.map((lead) => (
                <li
                  key={lead.id}
                  className="flex items-start gap-3 border-b border-border px-4 py-3.5 last:border-0"
                >
                  <span
                    className="mt-0.5 grid h-8 w-8 flex-none place-items-center rounded-[10px] bg-primary-tint font-heading text-[11px] font-semibold text-primary-dark"
                    aria-hidden
                  >
                    {lead.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-semibold text-ink">
                      {lead.name}
                    </span>
                    <span className="block truncate text-[12px] text-muted">
                      {lead.contact} · {lead.received}
                    </span>
                  </span>
                  <button
                    type="button"
                    className="flex-none rounded-[9px] bg-primary px-2.5 py-1.5 text-[12px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.98]"
                  >
                    Provision
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      </div>

      {/* recent activity */}
      <section className="mt-6">
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
                  <span className="font-semibold text-ink">{item.highlight}</span>{" "}
                  {item.text}
                  {item.tail && (
                    <>
                      {" "}
                      <span className="font-semibold text-ink">{item.tail}</span>
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

      {/* Add campsite modal */}
      <Sheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add campsite"
        description="Provision a new tenant and invite its Administrator."
        footer={
          <>
            <SheetCancel onClick={() => setAddOpen(false)} />
            <SheetSave onClick={() => setAddOpen(false)}>Create campsite</SheetSave>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <SheetField label="Campsite name" htmlFor="sa-name">
            <input id="sa-name" className={sheetControl} placeholder="Saimaa Camping" />
          </SheetField>
          <SheetField label="Subdomain" htmlFor="sa-sub">
            <input id="sa-sub" className={sheetControl} placeholder="saimaa" />
            <span className="text-[12px] text-muted">→ saimaa.pakkia.fi</span>
          </SheetField>
          <SheetField label="Administrator email" htmlFor="sa-email">
            <input
              id="sa-email"
              type="email"
              className={sheetControl}
              placeholder="owner@site.fi"
            />
            <span className="text-[12px] text-muted">
              They&apos;ll receive an invite to set up the campsite.
            </span>
          </SheetField>
          <SheetField label="Plan" htmlFor="sa-plan">
            <select id="sa-plan" className={sheetControl} defaultValue="trial">
              <option value="trial">Trial (30 days)</option>
              <option value="starter">Starter · €19/mo</option>
              <option value="standard">Standard · €39/mo</option>
              <option value="multi">Multi-site · €79/mo</option>
            </select>
          </SheetField>
        </div>
      </Sheet>
    </>
  );
}
