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
  SplitButton,
  StatusSquare,
  UnderlineInput,
  UnderlineLink,
  useAudit,
  useToast,
  type LedgerColumn,
} from "@/components/portal";
import { admin, tenants } from "../data";
import type { AuditEvent } from "@/components/portal/audit-store";

const PAGE_SIZE = 8;

export default function SuperAdminAudit() {
  const toast = useToast();
  const { events, log } = useAudit();
  const [actor, setActor] = useState("all");
  const [type, setType] = useState("all");
  const [campsite, setCampsite] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const actorOpts = useMemo(() => {
    const set = Array.from(new Set(events.map((e) => e.actor)));
    return [{ value: "all", label: "All" }, ...set.map((a) => ({ value: a, label: a }))];
  }, [events]);
  const typeOpts = useMemo(() => {
    const set = Array.from(new Set(events.map((e) => e.event)));
    return [{ value: "all", label: "All" }, ...set.map((a) => ({ value: a, label: a }))];
  }, [events]);
  const campsiteOpts = [
    { value: "all", label: "All" },
    ...tenants.map((t) => ({ value: t.name, label: t.name })),
  ];

  useEffect(() => setPage(1), [actor, type, campsite, query]);

  const filtered = useMemo(
    () =>
      events.filter((e) => {
        if (actor !== "all" && e.actor !== actor) return false;
        if (type !== "all" && e.event !== type) return false;
        if (campsite !== "all" && e.target !== campsite) return false;
        if (
          query &&
          !`${e.actor} ${e.event} ${e.target ?? ""} ${e.detail ?? ""}`
            .toLowerCase()
            .includes(query.toLowerCase())
        )
          return false;
        return true;
      }),
    [events, actor, type, campsite, query],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: LedgerColumn<AuditEvent>[] = [
    { key: "time", header: "Timestamp", cellClassName: "font-spline text-ink-muted whitespace-nowrap", render: (e) => e.time },
    {
      key: "actor",
      header: "Actor",
      render: (e) =>
        e.actor === "System" ? (
          <EntityCell initials="SY" name="System" avatarTone="system" />
        ) : (
          <EntityCell initials={e.actorInitials} name={e.actor} />
        ),
    },
    {
      key: "event",
      header: "Event",
      cellClassName: "font-medium text-ink-900",
      render: (e) => (
        <span className="inline-flex items-center gap-2">
          {e.tone === "support" && <StatusSquare variant="trial" />}
          {e.event}
        </span>
      ),
    },
    {
      key: "campsite",
      header: "Campsite",
      render: (e) =>
        e.targetHref ? (
          <UnderlineLink href={e.targetHref}>{e.target}</UnderlineLink>
        ) : (
          <span className="text-ink-muted">{e.target ?? "—"}</span>
        ),
    },
    { key: "detail", header: "Detail", cellClassName: "font-spline text-ink-muted", render: (e) => e.detail ?? "—" },
    {
      key: "actions",
      header: "",
      align: "right",
      render: () => (
        <Menu trigger={({ open, toggle }) => <RowMenuButton open={open} toggle={toggle} label="Audit row actions" />}>
          <MenuItem onClick={() => toast({ message: "Copied as JSON", variant: "info" })}>Copy as JSON</MenuItem>
        </Menu>
      ),
    },
  ];

  return (
    <>
      <ContentHeader
        title="Audit log"
        description="A platform-wide record of who did what, when — provisioning, plan changes, suspensions, administrator appointments and super-admin sign-ins. Nothing is silently editable."
        action={
          <SplitButton
            size="compact"
            label="Export"
            onClick={() => {
              log({ actor: admin.name, actorInitials: admin.initials, event: "Exported audit log", detail: "CSV", tone: "info" });
              toast({ message: "Audit log exported (CSV)", variant: "info" });
            }}
          />
        }
      />

      <FilterBar>
        <FilterSelect label="Actor" value={actor} onChange={setActor} options={actorOpts} />
        <FilterSelect label="Event" value={type} onChange={setType} options={typeOpts} />
        <FilterSelect label="Campsite" value={campsite} onChange={setCampsite} options={campsiteOpts} />
        <Field label="From" htmlFor="au-from" className="w-[130px]">
          <UnderlineInput id="au-from" type="date" mono />
        </Field>
        <Field label="To" htmlFor="au-to" className="w-[130px]">
          <UnderlineInput id="au-to" type="date" mono />
        </Field>
        <FilterSearch value={query} onChange={setQuery} placeholder="Search the log…" width={220} />
      </FilterBar>

      <Ledger
        columns={columns}
        rows={rows}
        getKey={(e) => e.id}
        caption="Platform-wide audit log"
        empty={{ icon: null, title: "Nothing is silently editable.", guidance: "No audit entries match these filters." }}
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
