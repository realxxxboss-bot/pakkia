"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ContentHeader,
  Drawer,
  Field,
  InstrumentRow,
  Ledger,
  LedgerFrame,
  LineChartMini,
  RuledRadioGroup,
  SplitButton,
  StatusMark,
  UnderlineInput,
  UnderlineLink,
  useAudit,
  useToast,
  type LedgerColumn,
} from "@/components/portal";
import { ConfirmModal } from "@/components/portal/ConfirmModal";
import {
  admin,
  adminStatusTone,
  getTenantBySlug,
  getTenantDetail,
  type PlanName,
  type TeamMember,
  type TenantStatus,
} from "../../data";

const STATUS_MARK: Record<TenantStatus, { variant: "active" | "trial" | "danger"; label: string }> = {
  Active: { variant: "active", label: "Active" },
  Trial: { variant: "trial", label: "Trial" },
  Suspended: { variant: "danger", label: "Suspended" },
};

const TEAM_STATUS = (s: TeamMember["status"]) =>
  adminStatusTone(s) === "success"
    ? { variant: "active" as const, label: s }
    : adminStatusTone(s) === "amber"
      ? { variant: "trial" as const, label: s }
      : { variant: "danger" as const, label: s };

const TABS = ["Overview", "Team", "Usage", "Billing", "Danger zone"] as const;
type Tab = (typeof TABS)[number];

export default function CampsiteDetail() {
  const params = useParams<{ id: string }>();
  const tenant = getTenantBySlug(params.id);
  const toast = useToast();
  const { log } = useAudit();

  const [tab, setTab] = useState<Tab>("Overview");
  const [impersonateConfirm, setImpersonateConfirm] = useState(false);
  const [session, setSession] = useState<number | null>(null); // seconds remaining
  const [suspendConfirm, setSuspendConfirm] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [plan, setPlan] = useState<PlanName>(tenant?.plan ?? "Standard");

  // Time-boxed support session countdown.
  useEffect(() => {
    if (session == null) return;
    if (session <= 0) {
      setSession(null);
      return;
    }
    const t = setTimeout(() => setSession((s) => (s == null ? null : s - 1)), 1000);
    return () => clearTimeout(t);
  }, [session]);

  if (!tenant) {
    return (
      <div className="rounded-[12px] border border-line bg-paper px-6 py-16 text-center">
        <p className="text-[0.9375rem] text-ink-900">Campsite not found.</p>
        <p className="mt-1 text-[0.875rem] text-ink-muted">
          This tenant doesn&apos;t exist or has been removed.
        </p>
        <div className="mt-4 flex justify-center">
          <UnderlineLink href="/super-admin/campsites" arrow>
            Back to campsites
          </UnderlineLink>
        </div>
      </div>
    );
  }

  const detail = getTenantDetail(tenant);
  const suspended = tenant.status === "Suspended";
  const mm = session != null ? String(Math.ceil(session / 60)) : "";

  const teamCols: LedgerColumn<TeamMember>[] = [
    { key: "name", header: "Name", cellClassName: "font-medium text-ink-900", render: (m) => m.name },
    { key: "email", header: "Email", cellClassName: "font-spline text-ink-muted", render: (m) => m.email },
    { key: "role", header: "Role", cellClassName: "font-spline text-ink-900", render: (m) => m.role },
    { key: "status", header: "Status", render: (m) => <StatusMark {...TEAM_STATUS(m.status)} /> },
  ];

  const areaCols: LedgerColumn<(typeof detail.areas)[number]>[] = [
    { key: "area", header: "Area", cellClassName: "font-medium text-ink-900", render: (a) => a.name },
    { key: "pitches", header: "Pitches", numeric: true, render: (a) => a.pitches },
    {
      key: "occ",
      header: "Occupancy",
      align: "right",
      render: (a) => {
        const pct = a.pitches ? Math.round((a.occupied / a.pitches) * 100) : 0;
        return (
          <span className="flex items-center justify-end gap-3">
            <span className="hidden h-2 w-28 overflow-hidden rounded-full border border-line bg-paper-deep sm:block" aria-hidden>
              <span className="block h-full bg-pine-700" style={{ width: `${pct}%` }} />
            </span>
            <span className="font-spline tabular-nums text-ink-900">{pct}%</span>
          </span>
        );
      },
    },
  ];

  return (
    <>
      {/* Impersonation session banner — loud + time-boxed (B1.2c). */}
      {session != null && (
        <div className="mb-6 flex h-10 items-center justify-between gap-3 rounded-[6px] bg-amber-500 px-4 font-spline text-[12px] text-pine-900">
          <span className="uppercase tracking-[0.08em]">
            Support session · {tenant.name} · {mm} min
          </span>
          <button
            type="button"
            onClick={() => {
              setSession(null);
              log({
                actor: admin.name,
                actorInitials: admin.initials,
                event: "Ended support session",
                target: tenant.name,
                tone: "support",
              });
            }}
            className="underline decoration-1 underline-offset-2 hover:opacity-80"
          >
            End session
          </button>
        </div>
      )}

      <div className="mb-6">
        <UnderlineLink href="/super-admin/campsites">← All campsites</UnderlineLink>
      </div>

      <ContentHeader
        title={tenant.name}
        description={`${tenant.slug}.pakkia.fi · ${tenant.region}`}
        eyebrow={
          <span className="flex items-center gap-3">
            <StatusMark {...STATUS_MARK[tenant.status]} />
            <span>Tenant since {tenant.joined}</span>
          </span>
        }
        action={
          <SplitButton
            size="compact"
            variant="amber"
            label="Sign in as admin"
            onClick={() => setImpersonateConfirm(true)}
          />
        }
        secondary={<UnderlineLink onClick={() => setPlanOpen(true)}>Change plan</UnderlineLink>}
      />

      <InstrumentRow
        cells={[
          { label: "Pitches", value: String(tenant.pitches) },
          { label: "Users", value: String(tenant.users) },
          { label: "Nights · MTD", value: tenant.nightsMTD },
          { label: "MRR", value: tenant.mrr, valueTone: tenant.mrr === "€0" ? undefined : "ink" },
        ]}
      />

      {/* Ruled tabs */}
      <div className="mt-8 mb-6 flex gap-6 border-b border-line" role="tablist">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 pb-3 text-[0.9375rem] transition-colors ${
              tab === t
                ? "border-pine-700 font-medium text-pine-900"
                : "border-transparent text-ink-muted hover:text-ink-900"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="mb-3.5 font-familjen text-[1.0625rem] font-semibold tracking-[-0.02em] text-pine-900">
              Pitches by area
            </h2>
            <Ledger columns={areaCols} rows={detail.areas} getKey={(a) => a.name} caption={`Areas at ${tenant.name}`} />
          </section>
          <LedgerFrame header={<span className="font-spline text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">Account administrator</span>}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.9375rem] font-medium text-ink-900">{tenant.admin}</p>
                <p className="font-spline text-[12px] text-ink-muted">{tenant.email}</p>
              </div>
              <UnderlineLink href="/super-admin/administrators" arrow>
                Manage
              </UnderlineLink>
            </div>
          </LedgerFrame>
        </div>
      )}

      {tab === "Team" && (
        <Ledger columns={teamCols} rows={detail.team} getKey={(m) => m.email} caption={`Team at ${tenant.name}`} />
      )}

      {tab === "Usage" && (
        <LedgerFrame
          header={
            <>
              <span className="font-spline text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">Nights logged · last 6 weeks</span>
              <span className="font-spline text-[12px] tabular-nums text-ink-muted">{detail.summary.nightsAllTime} all-time</span>
            </>
          }
        >
          {suspended ? (
            <p className="py-10 text-center text-[0.9375rem] text-ink-muted">No usage — this campsite is suspended.</p>
          ) : (
            <LineChartMini data={detail.usageTrend} />
          )}
        </LedgerFrame>
      )}

      {tab === "Billing" && (
        <LedgerFrame header={<span className="font-spline text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">Subscription</span>}>
          <dl className="flex flex-col">
            {[
              ["Plan", `${tenant.plan}${tenant.mrr !== "€0" ? ` · ${tenant.mrr}/mo` : " · free"}`],
              ["Next invoice", tenant.nextInvoice],
              ["Last entry", detail.summary.lastEntry],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border-b border-line py-2.5 last:border-0 text-[0.9375rem]">
                <dt className="text-ink-muted">{k}</dt>
                <dd className="font-spline text-ink-900">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex gap-5">
            <UnderlineLink onClick={() => setPlanOpen(true)}>Change plan</UnderlineLink>
            <UnderlineLink href="/super-admin/subscriptions" arrow>
              View invoices
            </UnderlineLink>
          </div>
        </LedgerFrame>
      )}

      {tab === "Danger zone" && (
        <div className="rounded-[12px] border border-terracotta bg-paper p-5">
          <h2 className="font-familjen text-[1.0625rem] font-semibold tracking-[-0.02em] text-terracotta">
            {suspended ? "Reactivate campsite" : "Suspend campsite"}
          </h2>
          <p className="mt-1.5 max-w-[60ch] text-[0.9375rem] text-ink-muted">
            {suspended
              ? "Reactivating restores access for the administrator and staff; billing resumes on the next cycle."
              : "Suspending signs out the administrator and any power users immediately. No data is deleted and the campsite can be reactivated later."}
          </p>
          <div className="mt-4">
            {suspended ? (
              <SplitButton
                size="compact"
                label="Reactivate"
                onClick={() => {
                  log({ actor: admin.name, actorInitials: admin.initials, event: "Reactivated tenant", target: tenant.name, tone: "record" });
                  toast({ message: `${tenant.name} reactivated`, variant: "success" });
                }}
              />
            ) : (
              <SplitButton size="compact" variant="danger" label="Suspend campsite" onClick={() => setSuspendConfirm(true)} />
            )}
          </div>
        </div>
      )}

      {/* Impersonation confirm */}
      <ConfirmModal
        open={impersonateConfirm}
        onClose={() => setImpersonateConfirm(false)}
        title="Sign in as administrator?"
        consequence={`You'll enter ${tenant.name}'s portal as a support session. It is time-boxed and recorded in the audit trail — everyone can see when support was here.`}
        confirmLabel="Start session"
        onConfirm={() => {
          setSession(12 * 60);
          log({
            actor: admin.name,
            actorInitials: admin.initials,
            event: "Signed in as admin",
            target: tenant.name,
            detail: "support session · 12 min",
            tone: "support",
          });
          toast({ message: `Support session started · ${tenant.name}`, variant: "info" });
        }}
      />

      {/* Suspend confirm */}
      <ConfirmModal
        open={suspendConfirm}
        onClose={() => setSuspendConfirm(false)}
        title="Suspend campsite"
        consequence={`${tenant.name} loses access immediately. Its data is retained and the campsite can be reactivated later.`}
        confirmLabel="Suspend campsite"
        onConfirm={() => {
          log({ actor: admin.name, actorInitials: admin.initials, event: "Suspended tenant", target: tenant.name, detail: "reason: manual", tone: "danger" });
          toast({ message: `${tenant.name} suspended`, variant: "danger" });
        }}
      />

      {/* Change plan drawer */}
      <Drawer
        open={planOpen}
        onClose={() => setPlanOpen(false)}
        title="Change plan"
        description={`${tenant.name} · currently ${tenant.plan}`}
        footer={
          <>
            <button
              type="button"
              onClick={() => setPlanOpen(false)}
              className="text-[0.9375rem] font-medium text-ink-900 underline decoration-line decoration-1 underline-offset-[6px] hover:text-pine-700 hover:decoration-amber-500"
            >
              Cancel
            </button>
            <SplitButton
              size="compact"
              label="Save plan"
              disabled={plan === tenant.plan}
              onClick={() => {
                log({
                  actor: admin.name,
                  actorInitials: admin.initials,
                  event: "Plan changed",
                  target: tenant.name,
                  detail: `${tenant.plan} → ${plan}`,
                  tone: "settings",
                });
                toast({ message: `${tenant.name} moved to ${plan}`, variant: "success" });
                setPlanOpen(false);
              }}
            />
          </>
        }
      >
        <Field label="Plan">
          <RuledRadioGroup
            name="detail-plan"
            legend="Plan"
            value={plan}
            onChange={setPlan}
            options={[
              { value: "Starter", label: "Starter", hint: "€19 / mo" },
              { value: "Standard", label: "Standard", hint: "€39 / mo" },
              { value: "Multi-site", label: "Multi-site", hint: "€79 / mo" },
              { value: "Trial", label: "Trial", hint: "30 days" },
            ]}
          />
        </Field>
        <div className="mt-4">
          <Field label="Reason (optional)" htmlFor="plan-reason">
            <UnderlineInput id="plan-reason" placeholder="e.g. upgraded after trial" />
          </Field>
        </div>
      </Drawer>
    </>
  );
}
