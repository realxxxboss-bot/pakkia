import {
  Badge,
  Card,
  DataTable,
  PageHeader,
  StatCard,
  type Column,
} from "@/components/dashboard/primitives";
import { DownloadIcon } from "@/components/dashboard/icons";
import { billingKpis, invoices, planTone, type Invoice } from "../data";

const columns: Column<Invoice>[] = [
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

export default function SuperAdminBilling() {
  return (
    <>
      <PageHeader
        title="Billing"
        subtitle="Subscriptions, revenue and invoices across the platform."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {billingKpis.map((kpi) => (
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
          columns={columns}
          rows={invoices}
          getRowKey={(r) => r.id}
          caption="Recent invoices across all campsites"
        />
      </section>

      <Card className="mt-6 flex flex-wrap items-center gap-2.5 px-5 py-4">
        <Badge tone="primary">EU · Frankfurt</Badge>
        <Badge tone="primary">GDPR</Badge>
        <span className="text-[13.5px] text-secondary">
          Invoices are issued in EUR. Tenant data stays in the EU.
        </span>
      </Card>
    </>
  );
}
