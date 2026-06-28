"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  Badge,
  Card,
  EmptyState,
  SectionTitle,
  StatCard,
} from "@/components/dashboard/primitives";
import {
  BuildingIcon,
  ChevronLeftIcon,
  ExternalLinkIcon,
  ShieldIcon,
} from "@/components/dashboard/icons";
import { Rise } from "@/components/motion";
import { Sheet, SheetCancel, SheetSave } from "@/components/power-user/Sheet";
import {
  adminStatusTone,
  getTenantBySlug,
  getTenantDetail,
  planTone,
  ROLE_TONE,
  statusTone,
} from "../../data";

export default function CampsiteDetail() {
  const params = useParams<{ id: string }>();
  const tenant = getTenantBySlug(params.id);
  const [confirm, setConfirm] = useState<null | "suspend" | "activate">(null);

  if (!tenant) {
    return (
      <Card className="p-2">
        <EmptyState
          icon={<BuildingIcon size={24} />}
          title="Campsite not found"
          description="This tenant doesn’t exist or has been removed from the platform."
          action={
            <Link
              href="/super-admin/campsites"
              className="rounded-[10px] bg-primary px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
            >
              Back to campsites
            </Link>
          }
        />
      </Card>
    );
  }

  const detail = getTenantDetail(tenant);
  const suspended = tenant.status === "Suspended";
  const peak = Math.max(...detail.usageTrend.map((w) => w.value), 1);

  return (
    <>
      <Link
        href="/super-admin/campsites"
        className="mb-5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-secondary transition-colors hover:text-primary"
      >
        <ChevronLeftIcon size={16} />
        All campsites
      </Link>

      {/* header */}
      <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span
            className="grid h-14 w-14 flex-none place-items-center rounded-[14px] bg-dark font-heading text-[18px] font-semibold text-white shadow-dark"
            aria-hidden
          >
            {tenant.initials}
          </span>
          <div className="min-w-0">
            <h1 className="text-[clamp(24px,3vw,30px)] leading-[1.1]">
              {tenant.name}
            </h1>
            <p className="mt-1 text-[13.5px] text-muted">
              {tenant.slug}.pakkia.fi · {tenant.region}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <Badge tone={planTone(tenant.plan)}>{tenant.plan}</Badge>
              <Badge tone={statusTone(tenant.status)} dot>
                {tenant.status}
              </Badge>
              <Badge tone="neutral">Tenant since {tenant.joined}</Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-none flex-wrap items-center gap-2.5">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-[10px] bg-amber px-4 py-2.5 text-[14px] font-semibold text-dark shadow-sm transition-[transform,background-color] duration-150 ease-[var(--ease-out)] hover:bg-amber/90 active:scale-[0.98]"
          >
            <ExternalLinkIcon size={16} />
            Sign in as admin
          </button>
          {suspended ? (
            <button
              type="button"
              onClick={() => setConfirm("activate")}
              className="rounded-[10px] px-4 py-2.5 text-[14px] font-semibold text-primary ring-1 ring-border transition-colors duration-150 hover:bg-subtle"
            >
              Reactivate
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setConfirm("suspend")}
              className="rounded-[10px] px-4 py-2.5 text-[14px] font-semibold text-error ring-1 ring-border transition-colors duration-150 hover:bg-error hover:text-white"
            >
              Suspend
            </button>
          )}
        </div>
      </div>

      {/* usage stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Rise delay={0} y={14}>
          <StatCard label="Pitches" value={tenant.pitches} />
        </Rise>
        <Rise delay={0.05} y={14}>
          <StatCard label="Users" value={tenant.users} />
        </Rise>
        <Rise delay={0.1} y={14}>
          <StatCard label="Nights · MTD" value={tenant.nightsMTD} />
        </Rise>
        <Rise delay={0.15} y={14}>
          <StatCard
            label="Occupancy"
            value={`${detail.summary.occupancy}`}
            unit="%"
          />
        </Rise>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        {/* usage trend */}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="text-[15px] font-semibold">Nights logged · last 6 weeks</h3>
            <span className="font-eyebrow text-[10px] font-semibold tracking-[0.1em] text-muted uppercase">
              {detail.summary.nightsAllTime} all-time
            </span>
          </div>
          <div className="px-5 py-5">
            {suspended ? (
              <p className="py-10 text-center text-[14px] text-muted">
                No usage — this campsite is suspended.
              </p>
            ) : (
              <>
                <div className="flex h-[160px] items-end gap-3" aria-hidden>
                  {detail.usageTrend.map((w, i) => {
                    const last = i === detail.usageTrend.length - 1;
                    return (
                      <div
                        key={w.label}
                        className="relative flex-1 overflow-hidden rounded-[6px] bg-subtle"
                      >
                        <span
                          className={`absolute inset-x-0 bottom-0 rounded-[6px] transition-[height] duration-500 ease-[var(--ease-out)] motion-reduce:transition-none ${
                            last ? "bg-amber" : "bg-primary"
                          }`}
                          style={{ height: `${Math.round((w.value / peak) * 100)}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2.5 flex justify-between font-eyebrow text-[10px] font-semibold tracking-[0.06em] text-muted uppercase">
                  {detail.usageTrend.map((w) => (
                    <span key={w.label}>{w.label}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </Card>

        {/* account admin + subscription */}
        <Card className="px-5 py-5">
          <p className="mb-3 font-eyebrow text-[10px] font-semibold tracking-[0.12em] text-secondary uppercase">
            Account administrator
          </p>
          <div className="flex items-center gap-3">
            <span
              className="grid h-11 w-11 flex-none place-items-center rounded-[12px] bg-primary-tint text-primary-dark"
              aria-hidden
            >
              <ShieldIcon size={20} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold text-ink">
                {tenant.admin}
              </p>
              <p className="truncate text-[13px] text-muted">{tenant.email}</p>
            </div>
          </div>
          <Link
            href="/super-admin/administrators"
            className="mt-3 inline-block text-[13px] font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            Manage administrator →
          </Link>

          <div className="my-5 h-px bg-border" />

          <p className="mb-3 font-eyebrow text-[10px] font-semibold tracking-[0.12em] text-secondary uppercase">
            Subscription
          </p>
          <dl className="flex flex-col gap-2.5 text-[14px]">
            <div className="flex items-center justify-between">
              <dt className="text-muted">Plan</dt>
              <dd className="font-medium text-ink">
                {tenant.plan}
                {tenant.mrr !== "€0" ? ` · ${tenant.mrr}/mo` : " · free"}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted">Next invoice</dt>
              <dd className="font-medium text-ink">{tenant.nextInvoice}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted">Last entry</dt>
              <dd className="font-medium text-ink">{detail.summary.lastEntry}</dd>
            </div>
          </dl>
          <Link
            href="/super-admin/subscriptions"
            className="mt-3 inline-block text-[13px] font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            Change plan →
          </Link>
        </Card>
      </div>

      {/* pitches by area */}
      <section className="mt-7">
        <SectionTitle title="Pitches by area" />
        <Card className="overflow-hidden">
          <ul>
            {detail.areas.map((area) => {
              const pct = area.pitches
                ? Math.round((area.occupied / area.pitches) * 100)
                : 0;
              return (
                <li
                  key={area.name}
                  className="flex items-center gap-4 border-b border-border px-5 py-4 last:border-0"
                >
                  <span className="w-[140px] flex-none truncate text-[14px] font-semibold text-ink">
                    {area.name}
                  </span>
                  <div className="flex-1">
                    <div
                      className="h-2 overflow-hidden rounded-full bg-subtle"
                      aria-hidden
                    >
                      <span
                        className="block h-full rounded-full bg-primary transition-[width] duration-500 ease-[var(--ease-out)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="nums w-[96px] flex-none text-right font-mono text-[13.5px] text-secondary">
                    {area.occupied}/{area.pitches}
                  </span>
                  <span className="nums w-[44px] flex-none text-right font-mono text-[13.5px] font-semibold text-primary">
                    {pct}%
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
      </section>

      {/* team */}
      <section className="mt-7">
        <SectionTitle
          title="Team"
          action={
            <span className="text-[12.5px] text-muted">
              {detail.roleBreakdown.admins} admin · {detail.roleBreakdown.power} power
              user · {detail.roleBreakdown.holders} pitch holders
            </span>
          }
        />
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[14.5px]">
              <caption className="sr-only">Team at {tenant.name}</caption>
              <thead>
                <tr className="border-b border-border">
                  {["Name", "Email", "Role", "Status"].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-5 py-3.5 text-left font-eyebrow text-[10.5px] font-semibold tracking-[0.08em] text-muted uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {detail.team.map((m) => (
                  <tr
                    key={m.email}
                    className="border-b border-border last:border-0 transition-colors duration-150 hover:bg-subtle/60"
                  >
                    <td className="px-5 py-3.5 font-semibold text-ink">{m.name}</td>
                    <td className="px-5 py-3.5 text-[13px] text-muted">{m.email}</td>
                    <td className="px-5 py-3.5">
                      <Badge tone={ROLE_TONE[m.role]}>{m.role}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge tone={adminStatusTone(m.status)} dot>
                        {m.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* suspend / activate confirm */}
      <Sheet
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        title={confirm === "activate" ? "Reactivate campsite" : "Suspend campsite"}
        description={
          confirm === "activate"
            ? `${tenant.name} will regain access and its team can log nights again.`
            : `${tenant.name} loses access immediately. Its data is retained and the campsite can be reactivated later.`
        }
        footer={
          <>
            <SheetCancel onClick={() => setConfirm(null)} />
            <SheetSave onClick={() => setConfirm(null)}>
              {confirm === "activate" ? "Reactivate" : "Suspend campsite"}
            </SheetSave>
          </>
        }
      >
        <p className="text-[14px] leading-relaxed text-secondary">
          {confirm === "activate"
            ? "Billing resumes on the next cycle. The Administrator is notified by email."
            : "The Administrator and any power users are signed out and notified by email. No data is deleted."}
        </p>
      </Sheet>
    </>
  );
}
