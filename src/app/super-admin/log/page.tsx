import {
  Badge,
  DataTable,
  PageHeader,
  type Column,
} from "@/components/dashboard/primitives";
import { systemLog, type LogEntry } from "../data";

const columns: Column<LogEntry>[] = [
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

export default function SuperAdminLog() {
  return (
    <>
      <PageHeader
        title="System log"
        subtitle="Platform-level events: provisioning, plan changes, suspensions, and super-admin actions like impersonation."
      />

      <DataTable
        columns={columns}
        rows={systemLog}
        getRowKey={(r) => r.id}
        caption="Platform-level audit log"
      />
    </>
  );
}
