import {
  Badge,
  DataTable,
  PageHeader,
  type Column,
} from "@/components/dashboard/primitives";
import { auditLog, type AuditEntry } from "../data";

const columns: Column<AuditEntry>[] = [
  {
    key: "time",
    header: "Timestamp",
    className: "nums text-muted text-[13px] whitespace-nowrap",
    render: (r) => r.time,
  },
  {
    key: "user",
    header: "User",
    render: (r) =>
      r.user === "System" ? (
        <Badge tone="neutral">System</Badge>
      ) : (
        <span className="font-semibold text-ink">{r.user}</span>
      ),
  },
  {
    key: "action",
    header: "Action",
    className: "font-medium text-ink",
    render: (r) => r.action,
  },
  {
    key: "entity",
    header: "Entity",
    className: "text-muted text-[13px]",
    render: (r) => r.entity,
  },
  {
    key: "detail",
    header: "Detail",
    className: "text-secondary text-[13px]",
    render: (r) => r.detail,
  },
];

export default function AdminAudit() {
  return (
    <>
      <PageHeader
        title="Audit log"
        subtitle="Every change to records, users and settings — who did it, and when. Nothing is silently editable."
      />

      <DataTable
        columns={columns}
        rows={auditLog}
        getRowKey={(r) => r.id}
        caption="Audit log for Rairanta"
      />
    </>
  );
}
