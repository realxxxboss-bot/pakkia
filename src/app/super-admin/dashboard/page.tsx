"use client";

import { useState } from "react";
import {
  ActivityFeed,
  ContentHeader,
  EntityCell,
  InstrumentRow,
  Ledger,
  LedgerFrame,
  LineChartMini,
  SegmentedBar,
  SplitButton,
  StatusMark,
  UnderlineLink,
  useAudit,
  useToast,
  type LedgerColumn,
} from "@/components/portal";
import { ConfirmModal } from "@/components/portal/ConfirmModal";
import { Drawer } from "@/components/portal/Drawer";
import { AddCampsiteDrawer } from "../_components/AddCampsiteDrawer";
import {
  admin,
  leads,
  mrrTrend,
  needsAttention,
  planMixPaid,
  planMixPaidTotal,
  planMixTrial,
  type AttentionItem,
  type Lead,
} from "../data";

const ATTENTION_STATUS: Record<
  AttentionItem["flagTone"],
  { variant: "trial" | "danger"; label: string }
> = {
  trial: { variant: "trial", label: "Trial" },
  warn: { variant: "trial", label: "Attention" },
  danger: { variant: "danger", label: "Failed" },
};

export default function SuperAdminDashboard() {
  const toast = useToast();
  const { events, log } = useAudit();
  const [addOpen, setAddOpen] = useState(false);
  const [prefill, setPrefill] = useState<{ name?: string; email?: string } | undefined>();
  const [review, setReview] = useState<AttentionItem | null>(null);
  const [nudge, setNudge] = useState<AttentionItem | null>(null);

  const trialsEnding = needsAttention.filter((i) => i.flagTone === "trial").length;

  const openAdd = (p?: { name?: string; email?: string }) => {
    setPrefill(p);
    setAddOpen(true);
  };

  const provision = (lead: Lead) => openAdd({ name: lead.name, email: lead.email });

  const attentionCols: LedgerColumn<AttentionItem>[] = [
    {
      key: "campsite",
      header: "Campsite",
      render: (i) => (
        <EntityCell initials={i.initials} name={i.name} secondary={`${i.slug}.pakkia.fi`} />
      ),
    },
    {
      key: "issue",
      header: "Issue",
      render: (i) => {
        const s = ATTENTION_STATUS[i.flagTone];
        return (
          <span className="flex items-center gap-3">
            <StatusMark variant={s.variant} label={s.label} />
            <span className="text-[0.875rem] text-ink-muted">{i.flag}</span>
          </span>
        );
      },
    },
    {
      key: "action",
      header: "",
      align: "right",
      render: (i) =>
        i.action === "Convert" ? (
          <UnderlineLink href="/super-admin/subscriptions" arrow>
            Convert
          </UnderlineLink>
        ) : i.action === "Review" ? (
          <UnderlineLink onClick={() => setReview(i)}>Review</UnderlineLink>
        ) : (
          <UnderlineLink onClick={() => setNudge(i)}>Nudge</UnderlineLink>
        ),
    },
  ];

  const leadCols: LedgerColumn<Lead>[] = [
    {
      key: "lead",
      header: "Campsite",
      render: (l) => (
        <EntityCell
          initials={l.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
          name={l.name}
          secondary={`${l.contact} · ${l.received}`}
        />
      ),
    },
    {
      key: "action",
      header: "",
      align: "right",
      render: (l) => (
        <SplitButton size="compact" label="Provision" onClick={() => provision(l)} />
      ),
    },
  ];

  return (
    <>
      <ContentHeader
        title="Platform overview"
        description={
          <>
            Every campsite on Pakkia at a glance.{" "}
            <UnderlineLink href="/super-admin/subscriptions">
              {trialsEnding} trials
            </UnderlineLink>{" "}
            end this week — worth a nudge.
          </>
        }
        action={<SplitButton size="compact" label="Add campsite" onClick={() => openAdd()} />}
      />

      <InstrumentRow
        cells={[
          { label: "Campsites", value: "11", divisor: "/ 14", sub: "+2 onboarded this month", subTone: "up" },
          { label: "Total pitches", value: "1,240", sub: "across 14 tenants", subTone: "flat" },
          { label: "Nights logged", value: "18,420", sub: "+1,284 this month", subTone: "up" },
          { label: "Active users", value: "182", sub: "+9 this week", subTone: "up" },
        ]}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <LedgerFrame
          header={
            <>
              <span className="font-spline text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
                Recurring revenue (MRR)
              </span>
              <span className="font-spline text-[1.25rem] tabular-nums text-pine-900">€512</span>
            </>
          }
        >
          <LineChartMini data={mrrTrend} prefix="€" />
        </LedgerFrame>

        <LedgerFrame
          header={
            <>
              <span className="font-spline text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
                Plan mix
              </span>
              <span className="font-spline text-[11px] uppercase tracking-[0.1em] text-pine-700">
                {planMixPaidTotal} paid
              </span>
            </>
          }
        >
          <SegmentedBar segments={planMixPaid} />
          <div className="mt-2 flex items-center gap-2.5 border-t border-line pt-2 text-[0.875rem]">
            <StatusMark variant="trial" label="Trial" />
            <span className="flex-1 text-ink-muted">(not billed)</span>
            <span className="font-spline tabular-nums text-ink-muted">{planMixTrial}</span>
          </div>
        </LedgerFrame>
      </div>

      {/* Needs attention — the console's most valuable block, promoted. */}
      <section className="mt-8">
        <div className="mb-3.5 flex items-center justify-between">
          <h2 className="font-familjen text-[1.0625rem] font-semibold tracking-[-0.02em] text-pine-900">
            Needs attention
          </h2>
          <UnderlineLink href="/super-admin/campsites">All campsites</UnderlineLink>
        </div>
        <Ledger
          columns={attentionCols}
          rows={needsAttention}
          getKey={(i) => i.slug}
          caption="Campsites needing attention"
        />
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start">
        <section>
          <div className="mb-3.5 flex items-center justify-between">
            <h2 className="font-familjen text-[1.0625rem] font-semibold tracking-[-0.02em] text-pine-900">
              Recent signups
            </h2>
            <span className="font-spline text-[12px] text-ink-muted">{leads.length} open</span>
          </div>
          <Ledger
            columns={leadCols}
            rows={leads}
            getKey={(l) => l.id}
            caption="Recent signups from pakkia.fi"
          />
        </section>

        <section>
          <div className="mb-3.5 flex items-center justify-between">
            <h2 className="font-familjen text-[1.0625rem] font-semibold tracking-[-0.02em] text-pine-900">
              Recent activity
            </h2>
          </div>
          <ActivityFeed
            events={events}
            limit={6}
            title="Platform activity"
            live
            footer={<UnderlineLink href="/super-admin/audit">View audit log</UnderlineLink>}
          />
        </section>
      </div>

      <AddCampsiteDrawer open={addOpen} onClose={() => setAddOpen(false)} prefill={prefill} />

      {/* Review payment detail (drawer) */}
      <Drawer
        open={review !== null}
        onClose={() => setReview(null)}
        title="Payment detail"
        description={review ? `${review.name} · ${review.flag}` : ""}
        footer={
          <>
            <button
              type="button"
              onClick={() => setReview(null)}
              className="text-[0.9375rem] font-medium text-ink-900 underline decoration-line decoration-1 underline-offset-[6px] hover:text-pine-700 hover:decoration-amber-500"
            >
              Close
            </button>
            <UnderlineLink href="/super-admin/subscriptions" arrow>
              Open subscriptions
            </UnderlineLink>
          </>
        }
      >
        <dl className="flex flex-col gap-3 font-spline text-[0.875rem]">
          {[
            ["Last invoice", "€19.00 · Starter"],
            ["Attempted", "18 Jun · 11:20"],
            ["Result", "card_declined"],
            ["Retry", "scheduled · 21 Jun"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between border-b border-line pb-2">
              <dt className="text-ink-muted">{k}</dt>
              <dd className="text-ink-900">{v}</dd>
            </div>
          ))}
        </dl>
      </Drawer>

      {/* Nudge confirm modal — queues a reminder email */}
      <ConfirmModal
        open={nudge !== null}
        onClose={() => setNudge(null)}
        title="Send a reminder?"
        consequence={
          nudge
            ? `A gentle reminder email will be queued to ${nudge.name}'s administrator.`
            : ""
        }
        confirmLabel="Queue reminder"
        onConfirm={() => {
          if (!nudge) return;
          log({
            actor: admin.name,
            actorInitials: admin.initials,
            event: "Queued reminder",
            target: nudge.name,
            detail: "nudge · no recent entries",
            tone: "info",
          });
          toast({ message: `Reminder queued for ${nudge.name}`, variant: "info" });
        }}
      />
    </>
  );
}
