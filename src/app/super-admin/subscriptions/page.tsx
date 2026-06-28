"use client";

import Link from "next/link";
import {
  Badge,
  Card,
  DataTable,
  PageHeader,
  StatCard,
  type Column,
} from "@/components/dashboard/primitives";
import { DownloadIcon } from "@/components/dashboard/icons";
import {
  invoices,
  planTone,
  statusTone,
  subscriptionKpis,
  tenants,
  type Invoice,
  type Tenant,
} from "../data";

const subscriptionColumns: Column<Tenant>[] = [
  {
    key: "tenant",
    header: "Campsite",
    render: (t) => (
      <Link
        href={`/super-admin/campsites/${t.slug}`}
        className="flex items-center gap-3"
      >
        <span
          className="grid h-8 w-8 flex-none place-items-center rounded-[9px] bg-subtle font-heading text-[11px] font-semibold text-primary"
          aria-hidden
        >
          {t.initials}
        </span>
        <span className="font-semibold text-ink transition-colors hover:text-primary">
          {t.name}
        </span>
      </Link>
    ),
  },
  {
    key: "plan",
    header: "Plan",
    render: (t) => <Badge tone={planTone(t.plan)}>{t.plan}</Badge>,
  },
  {
    key: "status",
    header: "Status",
    render: (t) => (
      <Badge tone={statusTone(t.status)} dot>
        {t.status}
      </Badge>
    ),
  },
  {
    key: "mrr",
    header: "MRR",
    align: "right",
    className: "nums font-mono font-semibold text-primary",
    render: (t) => t.mrr,
  },
  {
    key: "renewal",
    header: "Next invoice",
    className: "text-muted text-[13px] whitespace-nowrap",
    render: (t) => t.nextInvoice,
  },
];

const invoiceColumns: Column<Invoice>[] = [
  {
    key: "tenant",
    header: "Campsite",
    render: (r) => (
      <span className="flex items-center gap-3">
        <span
          className="grid h-8 w-8 flex-none place-items-center rounded-[9px] bg-subtle font-heading text-[11px] font-semibold text-primary"
          aria-hidden
        >
          {r.initials}
        </span>
        <span className="font-semibold text-ink">{r.tenant}</span>
      </span>
    ),
  },
  {
    key: "plan",
    header: "Plan",
    render: (r) => <Badge tone={planTone(r.plan)}>{r.plan}</Badge>,
  },
  {
    key: "amount",
    header: "Amount",
    align: "right",
    className: "nums font-mono font-semibold text-ink",
    render: (r) => r.amount,
  },
  {
    key: "date",
    header: "Date",
    className: "text-muted text-[13px]",
    render: (r) => r.date,
  },
  {
    key: "status",
    header: "Status",
    render: (r) => (
      <Badge tone={r.status === "Paid" ? "success" : "amber"} dot>
        {r.status}
      </Badge>
    ),
  },
  {
    key: "action",
    header: "",
    align: "right",
    render: () => (
      <button
        type="button"
        aria-label="Download invoice"
        className="grid h-8 w-8 place-items-center rounded-[9px] text-muted transition-colors duration-150 hover:bg-subtle hover:text-primary"
      >
        <DownloadIcon size={16} />
      </button>
    ),
  },
];

export default function SuperAdminSubscriptions() {
  return (
    <>
      <PageHeader
        title="Subscriptions"
        subtitle="The platform business layer — each tenant’s plan, billing status and invoices across Pakkia."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {subscriptionKpis.map((kpi) => (
          <StatCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            unit={kpi.unit}
            hint={kpi.hint}
          />
        ))}
      </div>

      <section className="mt-7">
        <h2 className="mb-3.5 text-[16px] font-semibold">Tenant subscriptions</h2>
        <DataTable
          columns={subscriptionColumns}
          rows={tenants}
          getRowKey={(t) => t.slug}
          caption="Subscription per campsite"
        />
      </section>

      <section className="mt-7">
        <div className="mb-3.5 flex items-center justify-between gap-3">
          <h2 className="text-[16px] font-semibold">Recent invoices</h2>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-[13.5px] font-semibold text-secondary ring-1 ring-border transition-colors duration-150 hover:bg-subtle hover:text-ink"
          >
            <DownloadIcon size={16} />
            Export all
          </button>
        </div>
        <DataTable
          columns={invoiceColumns}
          rows={invoices}
          getRowKey={(r) => r.id}
          caption="Recent invoices across all campsites"
        />
      </section>

      <Card className="mt-6 flex flex-wrap items-center gap-2.5 px-5 py-4">
        <Badge tone="primary">EU · Frankfurt</Badge>
        <Badge tone="primary">GDPR</Badge>
        <span className="text-[13.5px] text-secondary">
          Invoices are issued in EUR by Growth Nexus. Tenant data stays in the EU.
        </span>
      </Card>
    </>
  );
}
