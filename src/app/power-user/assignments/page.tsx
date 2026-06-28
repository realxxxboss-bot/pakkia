"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  DataTable,
  EmptyState,
  PageHeader,
  type Column,
} from "@/components/dashboard/primitives";
import { LinkIcon, SearchIcon } from "@/components/dashboard/icons";
import { AssignSheet, type AssignDraft } from "@/components/power-user/AssignSheet";
import {
  areas,
  assignments as seedAssignments,
  type Assignment,
  type AssignmentStatus,
} from "../data";

const STATUS_OPTIONS = ["All", "Active", "Unassigned", "Ending soon"] as const;

const STATUS_TONE: Record<AssignmentStatus, "success" | "amber" | "neutral"> = {
  Active: "success",
  "Ending soon": "amber",
  Unassigned: "neutral",
};

export default function PowerUserAssignments() {
  const [rows, setRows] = useState<Assignment[]>(seedAssignments);
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<string>("All");
  const [status, setStatus] = useState<string>("All");
  const [editing, setEditing] = useState<Assignment | null>(null);

  const counts = useMemo(
    () => ({
      assigned: rows.filter((r) => r.holder).length,
      unassigned: rows.filter((r) => !r.holder).length,
    }),
    [rows],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (area !== "All" && r.area !== area) return false;
      if (status !== "All" && r.status !== status) return false;
      if (
        q &&
        !r.code.toLowerCase().includes(q) &&
        !(r.holder ?? "").toLowerCase().includes(q) &&
        !r.area.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [rows, query, area, status]);

  const save = (code: string, draft: AssignDraft) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.code !== code) return r;
        const holder = draft.holder || null;
        return {
          ...r,
          holder,
          agreement: holder ? draft.agreement : null,
          since: holder ? (r.since ?? "Today") : null,
          status: holder ? "Active" : "Unassigned",
        };
      }),
    );
    setEditing(null);
  };

  const columns: Column<Assignment>[] = [
    {
      key: "code",
      header: "Pitch",
      render: (r) => (
        <span className="font-heading font-semibold text-ink">{r.code}</span>
      ),
    },
    { key: "area", header: "Area", className: "text-secondary", render: (r) => r.area },
    {
      key: "holder",
      header: "Holder (client)",
      render: (r) =>
        r.holder ? (
          <span className="text-ink">{r.holder}</span>
        ) : (
          <span className="text-muted">— Unassigned</span>
        ),
    },
    {
      key: "agreement",
      header: "Agreement",
      className: "text-secondary text-[13.5px]",
      render: (r) =>
        r.agreement ? (
          <>
            {r.agreement}
            {r.since && <span className="text-muted"> · since {r.since}</span>}
          </>
        ) : (
          <span className="text-muted">—</span>
        ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <Badge tone={STATUS_TONE[r.status]} dot>
          {r.status}
        </Badge>
      ),
    },
    {
      key: "action",
      header: "",
      align: "right",
      render: (r) => (
        <button
          type="button"
          onClick={() => setEditing(r)}
          className={
            r.holder
              ? "rounded-[9px] px-3.5 py-1.5 text-[13.5px] font-semibold text-secondary ring-1 ring-border transition-colors duration-150 hover:bg-subtle hover:text-ink"
              : "rounded-[9px] bg-primary px-3.5 py-1.5 text-[13.5px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-150 hover:bg-primary-dark active:scale-[0.97]"
          }
        >
          {r.holder ? "Reassign" : "Assign"}
        </button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Assignments"
        subtitle="Link a pitch holder to each pitch for the season. You can reassign or release holders — only an administrator creates new users."
      />

      {/* summary */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:max-w-[420px]">
        <div className="flex items-center gap-3 rounded-[12px] border border-border bg-surface px-4 py-3 shadow-xs">
          <span className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-primary-tint text-primary-dark" aria-hidden>
            <LinkIcon size={17} />
          </span>
          <span className="leading-tight">
            <span className="nums block font-mono text-[18px] font-semibold text-ink">
              {counts.assigned}
            </span>
            <span className="text-[12.5px] text-muted">Assigned</span>
          </span>
        </div>
        <div className="flex items-center gap-3 rounded-[12px] border border-border bg-surface px-4 py-3 shadow-xs">
          <span className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-amber/15 text-amber-ink" aria-hidden>
            <LinkIcon size={17} />
          </span>
          <span className="leading-tight">
            <span className="nums block font-mono text-[18px] font-semibold text-ink">
              {counts.unassigned}
            </span>
            <span className="text-[12.5px] text-muted">Unassigned</span>
          </span>
        </div>
      </div>

      {/* toolbar */}
      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <div className="flex min-w-[200px] flex-1 items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-2.5 shadow-xs sm:max-w-[340px]">
          <SearchIcon size={16} className="flex-none text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pitch, area or holder…"
            aria-label="Search assignments"
            className="w-full bg-transparent text-[14px] text-ink placeholder:text-muted focus:outline-none"
          />
        </div>
        <label className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-[13.5px] font-medium text-secondary shadow-xs">
          <span className="text-muted">Area</span>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            aria-label="Filter by area"
            className="bg-transparent font-semibold text-ink focus:outline-none"
          >
            <option value="All">All</option>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-[13.5px] font-medium text-secondary shadow-xs">
          <span className="text-muted">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter by status"
            className="bg-transparent font-semibold text-ink focus:outline-none"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        getRowKey={(r) => r.code}
        caption="Pitch to holder assignments"
        empty={
          <EmptyState
            icon={<LinkIcon size={22} />}
            title="No pitches match"
            description="Try clearing the search or changing the area and status filters."
          />
        }
      />

      <AssignSheet
        pitch={editing}
        onClose={() => setEditing(null)}
        onSave={save}
      />
    </>
  );
}
