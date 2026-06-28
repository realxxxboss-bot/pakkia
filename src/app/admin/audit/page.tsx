"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  DataTable,
  PageHeader,
  type Column,
} from "@/components/dashboard/primitives";
import { ChevronDownIcon, SearchIcon } from "@/components/dashboard/icons";
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
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return auditLog;
    return auditLog.filter((e) =>
      [e.user, e.action, e.entity, e.detail].some((v) =>
        v.toLowerCase().includes(q),
      ),
    );
  }, [query]);

  return (
    <>
      <PageHeader
        title="Audit log"
        subtitle="Every change to records, users and settings at Rairanta — who did it, and when. Nothing is silently editable."
      />

      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <label className="flex min-w-[200px] flex-1 items-center gap-2.5 rounded-[10px] bg-surface px-3.5 py-2.5 ring-1 ring-border focus-within:ring-2 focus-within:ring-primary/40 sm:max-w-[320px]">
          <SearchIcon size={16} className="flex-none text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search user, action or entity…"
            className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-muted"
          />
        </label>
        <span className="inline-flex items-center gap-2 rounded-[10px] bg-surface px-3.5 py-2.5 text-[13.5px] font-medium text-secondary ring-1 ring-border">
          Action: All
          <ChevronDownIcon size={15} className="text-muted" />
        </span>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        getRowKey={(r) => r.id}
        caption="Audit log for Rairanta"
        empty={
          <p className="px-4 py-10 text-center text-[14px] text-muted">
            No entries match “{query}”.
          </p>
        }
      />
    </>
  );
}
