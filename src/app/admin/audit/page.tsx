"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ContentHeader,
  EntityCell,
  Field,
  FilterBar,
  FilterSearch,
  FilterSelect,
  Ledger,
  LedgerCount,
  LedgerPagination,
  Menu,
  MenuItem,
  RowMenuButton,
  StatusSquare,
  UnderlineInput,
  useAudit,
  useToast,
  type LedgerColumn,
} from "@/components/portal";
import type { AuditEvent } from "@/components/portal/audit-store";

const PAGE_SIZE = 8;

export default function AdminAudit() {
  const toast = useToast();
  const { events } = useAudit();
  const [action, setAction] = useState("all");
  const [user, setUser] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [action, user, query]);

  const actionOpts = useMemo(() => {
    const set = Array.from(new Set(events.map((e) => e.event)));
    return [{ value: "all", label: "All" }, ...set.map((a) => ({ value: a, label: a }))];
  }, [events]);
  const userOpts = useMemo(() => {
    const set = Array.from(new Set(events.map((e) => e.actor)));
    return [{ value: "all", label: "All" }, ...set.map((a) => ({ value: a, label: a }))];
  }, [events]);

  const filtered = useMemo(
    () =>
      events.filter((e) => {
        if (action !== "all" && e.event !== action) return false;
        if (user !== "all" && e.actor !== user) return false;
        if (
          query &&
          !`${e.actor} ${e.event} ${e.target ?? ""} ${e.detail ?? ""}`
            .toLowerCase()
            .includes(query.toLowerCase())
        )
          return false;
        return true;
      }),
    [events, action, user, query],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: LedgerColumn<AuditEvent>[] = [
    {
      key: "time",
      header: "Timestamp",
      cellClassName: "font-spline whitespace-nowrap text-ink-muted",
      render: (e) => e.time,
    },
    {
      key: "user",
      header: "User",
      render: (e) => <EntityCell initials={e.actorInitials} name={e.actor} />,
    },
    {
      key: "action",
      header: "Action",
      cellClassName: "font-medium text-ink-900",
      render: (e) => (
        <span className="inline-flex items-center gap-2">
          {/* Record edits are the compliance-critical rows (pine square);
              settings changes get an outline square; blocks are terracotta. */}
          <StatusSquare
            variant={
              e.tone === "danger" ? "danger" : e.tone === "settings" ? "pending" : "active"
            }
          />
          {e.event}
        </span>
      ),
    },
    {
      key: "entity",
      header: "Entity",
      cellClassName: "font-spline text-ink-900",
      render: (e) => e.target ?? "—",
    },
    {
      key: "detail",
      header: "Detail",
      cellClassName: "font-spline text-ink-muted",
      render: (e) => e.detail ?? "—",
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: () => (
        <Menu trigger={({ open, toggle }) => <RowMenuButton open={open} toggle={toggle} label="Audit row actions" />}>
          <MenuItem onClick={() => toast({ message: "Copied as JSON", variant: "info" })}>
            Copy as JSON
          </MenuItem>
        </Menu>
      ),
    },
  ];

  return (
    <>
      <ContentHeader
        title="Audit log"
        description="Every change to records, users and settings at Rairanta — who did it, and when. Nothing is silently editable."
      />

      <FilterBar>
        <FilterSelect label="Action" value={action} onChange={setAction} options={actionOpts} />
        <FilterSelect label="User" value={user} onChange={setUser} options={userOpts} />
        <Field label="From" htmlFor="ad-from" className="w-[130px]">
          <UnderlineInput id="ad-from" type="date" mono />
        </Field>
        <Field label="To" htmlFor="ad-to" className="w-[130px]">
          <UnderlineInput id="ad-to" type="date" mono />
        </Field>
        <FilterSearch value={query} onChange={setQuery} placeholder="Search the log…" width={220} />
      </FilterBar>

      <Ledger
        columns={columns}
        rows={rows}
        getKey={(e) => e.id}
        caption="Audit log for Rairanta"
        empty={{
          icon: null,
          title: "Nothing is silently editable.",
          guidance: "No audit entries match these filters.",
        }}
        footer={
          <>
            <LedgerCount shown={rows.length} total={filtered.length} unit="events" />
            {pageCount > 1 && <LedgerPagination page={page} pageCount={pageCount} onPage={setPage} />}
          </>
        }
      />
    </>
  );
}
