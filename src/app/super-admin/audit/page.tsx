import {
  Badge,
  DataTable,
  PageHeader,
  type Column,
} from "@/components/dashboard/primitives";
import { DownloadIcon } from "@/components/dashboard/icons";
import { auditLog, type AuditEntry } from "../data";

const columns: Column<AuditEntry>[] = [
  {
    key: "time",
    header: "Timestamp",
    className: "nums text-muted text-[13px] whitespace-nowrap",
    render: (r) => r.time,
  },
  {
    key: "actor",
    header: "Actor",
    render: (r) =>
      r.actor === "System" ? (
        <Badge tone="neutral">System</Badge>
      ) : (
        <span className="font-semibold text-ink">{r.actor}</span>
      ),
  },
  {
    key: "event",
    header: "Event",
    className: "font-medium text-ink",
    render: (r) => r.event,
  },
  { key: "campsite", header: "Campsite", render: (r) => r.campsite },
  {
    key: "detail",
    header: "Detail",
    className: "text-muted text-[13px]",
    render: (r) => r.detail,
  },
];

export default function SuperAdminAudit() {
  return (
    <>
      <PageHeader
        title="Audit log"
        subtitle="A platform-wide record of who did what, when — provisioning, plan changes, suspensions, administrator appointments and super-admin sign-ins."
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2.5 text-[13.5px] font-semibold text-secondary ring-1 ring-border transition-colors duration-150 hover:bg-subtle hover:text-ink"
          >
            <DownloadIcon size={16} />
            Export
          </button>
        }
      />

      <DataTable
        columns={columns}
        rows={auditLog}
        getRowKey={(r) => r.id}
        caption="Platform-wide audit log"
      />
    </>
  );
}
