"use client";

import {
  ContentHeader,
  EntityCell,
  InstrumentRow,
  Ledger,
  Menu,
  MenuItem,
  MenuRule,
  RowMenuButton,
  StatusMark,
  StatusSquare,
  UnderlineLink,
  useToast,
  type LedgerColumn,
} from "@/components/portal";
import {
  invoices,
  tenants,
  type Invoice,
  type Tenant,
  type TenantStatus,
} from "../data";

const STATUS_MARK: Record<TenantStatus, { variant: "active" | "trial" | "danger"; label: string }> = {
  Active: { variant: "active", label: "Active" },
  Trial: { variant: "trial", label: "Trial" },
  Suspended: { variant: "danger", label: "Suspended" },
};

function NextInvoice({ value }: { value: string }) {
  const trialDays = value.match(/(\d+)d left/);
  if (value.startsWith("Overdue")) {
    return <span className="font-spline text-terracotta">Overdue</span>;
  }
  if (trialDays && Number(trialDays[1]) <= 3) {
    return (
      <span className="inline-flex items-center justify-end gap-2 font-spline text-ink-900">
        <StatusSquare variant="trial" />
        {value}
      </span>
    );
  }
  return <span className="font-spline text-ink-900">{value}</span>;
}

export default function SuperAdminSubscriptions() {
  const toast = useToast();

  const subCols: LedgerColumn<Tenant>[] = [
    {
      key: "campsite",
      header: "Campsite",
      render: (t) => <EntityCell initials={t.initials} name={t.name} secondary={`${t.slug}.pakkia.fi`} />,
    },
    { key: "plan", header: "Plan", cellClassName: "font-spline text-ink-900", render: (t) => t.plan },
    { key: "status", header: "Status", render: (t) => <StatusMark {...STATUS_MARK[t.status]} /> },
    { key: "mrr", header: "MRR", numeric: true, render: (t) => t.mrr },
    {
      key: "next",
      header: "Next invoice",
      align: "right",
      render: (t) => <NextInvoice value={t.nextInvoice} />,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (t) => (
        <Menu trigger={({ open, toggle }) => <RowMenuButton open={open} toggle={toggle} label={`Actions for ${t.name}`} />}>
          <MenuItem href={`/super-admin/campsites/${t.slug}`}>Change plan</MenuItem>
          <MenuItem href={`/super-admin/campsites/${t.slug}`}>View invoices</MenuItem>
          <MenuRule />
          <MenuItem href={`/super-admin/campsites/${t.slug}`}>Open campsite</MenuItem>
        </Menu>
      ),
    },
  ];

  const invCols: LedgerColumn<Invoice>[] = [
    {
      key: "campsite",
      header: "Campsite",
      render: (r) => <EntityCell initials={r.initials} name={r.tenant} />,
    },
    { key: "plan", header: "Plan", cellClassName: "font-spline text-ink-900", render: (r) => r.plan },
    { key: "amount", header: "Amount", numeric: true, render: (r) => r.amount },
    { key: "date", header: "Date", cellClassName: "font-spline text-ink-muted", render: (r) => r.date },
    {
      key: "status",
      header: "Status",
      render: (r) =>
        r.status === "Paid" ? (
          <StatusMark variant="active" label="Paid" />
        ) : (
          <StatusMark variant="danger" label="Payment due" />
        ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (r) => (
        <Menu trigger={({ open, toggle }) => <RowMenuButton open={open} toggle={toggle} label={`Actions for ${r.tenant}`} />}>
          <MenuItem onClick={() => toast({ message: `${r.tenant} invoice downloaded`, variant: "info" })}>
            Download PDF
          </MenuItem>
        </Menu>
      ),
    },
  ];

  return (
    <>
      <ContentHeader
        title="Subscriptions"
        description="The platform business layer — each tenant's plan, billing status and invoices across Pakkia."
      />

      <InstrumentRow
        cells={[
          { label: "MRR", value: "€512", sub: "+18% MoM", subTone: "up" },
          { label: "ARR (run-rate)", value: "€6,144", sub: "projected", subTone: "flat" },
          { label: "Paid subscriptions", value: "11", sub: "+2 this quarter", subTone: "up" },
          { label: "Trial → paid", value: "64%", sub: "last 90 days", subTone: "up" },
        ]}
      />

      <section className="mt-8">
        <h2 className="mb-3.5 font-familjen text-[1.0625rem] font-semibold tracking-[-0.02em] text-pine-900">
          Tenant subscriptions
        </h2>
        <Ledger columns={subCols} rows={tenants} getKey={(t) => t.slug} caption="Subscription per campsite" />
      </section>

      <section className="mt-8">
        <div className="mb-3.5 flex items-center justify-between">
          <h2 className="font-familjen text-[1.0625rem] font-semibold tracking-[-0.02em] text-pine-900">
            Recent invoices
          </h2>
          <UnderlineLink onClick={() => toast({ message: "All invoices exported", variant: "info" })}>
            Export all
          </UnderlineLink>
        </div>
        <Ledger columns={invCols} rows={invoices} getKey={(r) => r.id} caption="Recent invoices across all campsites" />
      </section>

      <div className="mt-6 rounded-[6px] border border-line bg-paper px-4 py-3 font-spline text-[12px] text-ink-muted">
        EU · Frankfurt · GDPR · Invoices issued in EUR by Growth Nexus. Tenant data stays in the EU.
      </div>
    </>
  );
}
