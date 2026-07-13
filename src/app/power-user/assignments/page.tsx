"use client";

import { useEffect, useMemo, useState } from "react";
import { Link2 } from "lucide-react";
import {
  ConfirmModal,
  ContentHeader,
  EntityCell,
  FilterBar,
  FilterSearch,
  FilterSelect,
  InstrumentRow,
  Ledger,
  LedgerCount,
  LedgerPagination,
  Menu,
  MenuItem,
  MenuRule,
  RowMenuButton,
  SplitButton,
  StatusMark,
  StatusSquare,
  UnderlineLink,
  useAudit,
  useToast,
  type LedgerColumn,
  type StatusVariant,
} from "@/components/portal";
import { AssignDrawer, type AssignResult } from "../_components/AssignDrawer";
import {
  adminContact,
  areas,
  assignments as seedAssignments,
  initialsOf,
  staff,
  type Assignment,
  type AssignmentStatus,
} from "../data";

const PAGE_SIZE = 10;

const STATUS_MARK: Record<AssignmentStatus, { variant: StatusVariant; label: string }> = {
  Active: { variant: "active", label: "Active" },
  "Ending soon": { variant: "trial", label: "Ending soon" },
  Unassigned: { variant: "pending", label: "Unassigned" },
};

/* Unassigned pitches sort to the top: they are the only rows here that need an
   action, and burying them on page 2 defeats the screen. */
const STATUS_ORDER: Record<AssignmentStatus, number> = {
  Unassigned: 0,
  "Ending soon": 1,
  Active: 2,
};

/* The role boundary is a real product rule, so it gets a real affordance: a
   prefilled mail to the campsite's administrator rather than a dead sentence. */
const REQUEST_MAILTO = `mailto:${adminContact.email}?subject=${encodeURIComponent(
  "New pitch holder for Rairanta",
)}&body=${encodeURIComponent(
  "Hi Olli,\n\nCould you create a new pitch holder account? I'll assign them to a pitch once the invite is accepted.\n\nName:\nEmail:\nPitch:\n\nThanks,\nMikko",
)}`;

export default function PowerUserAssignments() {
  const toast = useToast();
  const { log } = useAudit();

  const [list, setList] = useState<Assignment[]>(seedAssignments);
  const [area, setArea] = useState("all");
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const [assigning, setAssigning] = useState<Assignment | null>(null);
  const [releasing, setReleasing] = useState<Assignment | null>(null);

  useEffect(() => setPage(1), [area, status, query]);

  /* Deep-link from the dashboard KPI and the notifications panel
     (?status=Unassigned). Read on mount rather than via useSearchParams, so
     the page still prerenders instead of hiding behind a Suspense fallback. */
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("status");
    if (s) setStatus(s);
  }, []);

  const assignedCount = list.filter((a) => a.holder !== null).length;
  const unassignedCount = list.length - assignedCount;

  const filtered = useMemo(
    () =>
      list
        .filter((a) => {
          if (area !== "all" && a.area !== area) return false;
          if (status !== "all" && a.status !== status) return false;
          if (query) {
            const q = query.toLowerCase();
            const hit =
              a.code.toLowerCase().includes(q) ||
              (a.holder?.toLowerCase().includes(q) ?? false);
            if (!hit) return false;
          }
          return true;
        })
        .sort(
          (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || a.code.localeCompare(b.code),
        ),
    [list, area, status, query],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const onSave = (pitch: Assignment, r: AssignResult) => {
    const reassign = Boolean(pitch.holder);
    setList((prev) =>
      prev.map((a) =>
        a.code === pitch.code
          ? { ...a, holder: r.holder, agreement: r.agreement, since: r.since, status: "Active" }
          : a,
      ),
    );
    log({
      actor: staff.name,
      actorInitials: staff.initials,
      event: reassign ? "Reassigned holder" : "Assigned holder",
      target: `${pitch.code} · ${pitch.area}`,
      detail: reassign ? `${pitch.holder} → ${r.holder}` : `${r.holder} · ${r.agreement}`,
      tone: "settings",
    });
    toast({ message: `${r.holder} assigned to ${pitch.code}.`, variant: "success" });
  };

  const release = (pitch: Assignment) => {
    const previous = pitch.holder;
    setList((prev) =>
      prev.map((a) =>
        a.code === pitch.code
          ? { ...a, holder: null, agreement: null, since: null, status: "Unassigned" }
          : a,
      ),
    );
    log({
      actor: staff.name,
      actorInitials: staff.initials,
      event: "Released holder",
      target: `${pitch.code} · ${pitch.area}`,
      detail: `${previous} · record history kept`,
      tone: "settings",
    });
    toast({
      message: `${previous} released from ${pitch.code}.`,
      variant: "info",
      onUndo: () => setList((prev) => prev.map((a) => (a.code === pitch.code ? pitch : a))),
    });
  };

  const columns: LedgerColumn<Assignment>[] = [
    {
      key: "code",
      header: "Pitch",
      width: "w-[92px]",
      render: (r) => (
        <span className="font-spline text-[0.9375rem] font-medium tabular-nums text-ink-900">
          {r.code}
        </span>
      ),
    },
    { key: "area", header: "Area", render: (r) => r.area },
    {
      key: "holder",
      header: "Holder",
      render: (r) =>
        r.holder ? (
          <EntityCell initials={initialsOf(r.holder)} name={r.holder} />
        ) : (
          <span className="inline-flex items-center gap-2 text-[0.9375rem] text-ink-muted">
            <StatusSquare variant="anomaly" />— Unassigned
          </span>
        ),
    },
    {
      key: "agreement",
      header: "Agreement",
      render: (r) => (
        <span className="font-spline text-[12px] text-ink-muted">
          {r.agreement ? `${r.agreement} · since ${r.since}` : "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <StatusMark variant={STATUS_MARK[r.status].variant} label={STATUS_MARK[r.status].label} />
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      width: "w-[132px]",
      render: (r) =>
        r.holder === null ? (
          <SplitButton label="Assign" size="compact" onClick={() => setAssigning(r)} />
        ) : (
          <Menu
            label={`Actions for ${r.code}`}
            trigger={({ open, toggle }) => (
              <RowMenuButton open={open} toggle={toggle} label={`Actions for ${r.code}`} />
            )}
          >
            <MenuItem onClick={() => setAssigning(r)}>Reassign</MenuItem>
            <MenuItem href={`/power-user/pitches?pitch=${r.code}`}>View calendar</MenuItem>
            <MenuRule />
            <MenuItem destructive onClick={() => setReleasing(r)}>
              Release holder
            </MenuItem>
          </Menu>
        ),
    },
  ];

  return (
    <>
      <ContentHeader
        title="Assignments"
        description={
          <>
            Link a pitch holder to each pitch for the season. You can reassign or release
            holders — only an administrator creates new users.{" "}
            <UnderlineLink href={REQUEST_MAILTO}>Request from admin</UnderlineLink>
          </>
        }
      />

      <InstrumentRow
        cells={[
          { label: "Assigned", value: String(assignedCount), sub: "Holders on a pitch" },
          {
            label: "Unassigned",
            value: String(unassignedCount),
            sub: "Waiting for a holder",
            subTone: unassignedCount > 0 ? "warn" : "flat",
          },
        ]}
      />

      <div className="mt-8">
        <FilterBar>
          <FilterSelect
            label="Area"
            value={area}
            onChange={setArea}
            options={[
              { value: "all", label: "All" },
              ...areas.map((a) => ({ value: a, label: a })),
            ]}
          />
          <FilterSelect
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              { value: "all", label: "All" },
              { value: "Active", label: "Active" },
              { value: "Unassigned", label: "Unassigned" },
              { value: "Ending soon", label: "Ending soon" },
            ]}
          />
          <FilterSearch value={query} onChange={setQuery} placeholder="Search pitch or holder…" />
        </FilterBar>

        <Ledger
          caption="Pitch assignments"
          columns={columns}
          rows={rows}
          getKey={(r) => r.code}
          empty={{
            icon: <Link2 size={24} strokeWidth={1.5} />,
            title: "No pitches match.",
            guidance: "Try clearing the search or changing the area and status filters.",
            action: (
              <UnderlineLink
                onClick={() => {
                  setArea("all");
                  setStatus("all");
                  setQuery("");
                }}
              >
                Clear filters
              </UnderlineLink>
            ),
          }}
          footer={
            <>
              <LedgerCount shown={rows.length} total={filtered.length} unit="pitches" />
              <LedgerPagination page={page} pageCount={pageCount} onPage={setPage} />
            </>
          }
        />
      </div>

      <AssignDrawer pitch={assigning} onClose={() => setAssigning(null)} onSave={onSave} />

      <ConfirmModal
        open={Boolean(releasing)}
        onClose={() => setReleasing(null)}
        title={`Release ${releasing?.holder ?? ""} from ${releasing?.code ?? ""}?`}
        consequence="The pitch returns to the unassigned pool. Every night already logged on it is kept — releasing only ends the agreement."
        confirmLabel="Release holder"
        onConfirm={() => releasing && release(releasing)}
      />
    </>
  );
}
