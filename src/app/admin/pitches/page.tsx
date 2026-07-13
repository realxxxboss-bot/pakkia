"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ContentHeader,
  Drawer,
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
  MenuRule,
  RowMenuButton,
  RuledRadioGroup,
  SplitButton,
  StatusMark,
  UnderlineInput,
  UnderlineSelect,
  useAudit,
  useToast,
  type LedgerColumn,
} from "@/components/portal";
import { ConfirmModal } from "@/components/portal/ConfirmModal";
import {
  admin,
  areas,
  pitches as seedPitches,
  users,
  type Hookup,
  type Pitch,
  type Surface,
} from "../data";

const PAGE_SIZE = 10;

const holderNames = users.filter((u) => u.role === "Pitch holder").map((u) => u.name);

function initialsOf(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export default function AdminPitches() {
  const toast = useToast();
  const { log } = useAudit();

  const [list, setList] = useState<Pitch[]>(seedPitches);
  const [area, setArea] = useState("all");
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Pitch | null>(null);
  const [code, setCode] = useState("");
  const [formArea, setFormArea] = useState<string>(areas[0]);
  const [hookup, setHookup] = useState<Hookup>("Electric");
  const [surface, setSurface] = useState<Surface>("Grass");
  const [holder, setHolder] = useState("");

  const [deactivateTarget, setDeactivateTarget] = useState<Pitch | null>(null);

  useEffect(() => setPage(1), [area, status, query]);

  // Counts are computed from the real 60-pitch list — the old header
  // hard-counted a 7-row sample and read "6 active of 60".
  const activeCount = list.filter((p) => p.status === "Active").length;
  const total = list.length;

  const filtered = useMemo(
    () =>
      list.filter((p) => {
        if (area !== "all" && p.area !== area) return false;
        if (status !== "all" && p.status !== status) return false;
        if (query && !p.code.toLowerCase().includes(query.toLowerCase())) return false;
        return true;
      }),
    [list, area, status, query],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAdd = () => {
    setEditing(null);
    setCode("");
    setFormArea(areas[0]);
    setHookup("Electric");
    setSurface("Grass");
    setHolder("");
    setDrawerOpen(true);
  };

  const openEdit = (p: Pitch) => {
    setEditing(p);
    setCode(p.code);
    setFormArea(p.area);
    setHookup(p.hookup);
    setSurface(p.surface);
    setHolder(p.holder ?? "");
    setDrawerOpen(true);
  };

  const savePitch = () => {
    if (!code.trim()) return;
    const next: Pitch = {
      code: code.trim(),
      area: formArea,
      holder: holder || null,
      status: editing?.status ?? "Active",
      hookup,
      surface,
      nightsMTD: editing?.nightsMTD ?? 0,
    };
    setList((l) =>
      editing ? l.map((p) => (p.code === editing.code ? next : p)) : [...l, next],
    );
    log({
      actor: admin.name,
      actorInitials: admin.initials,
      event: editing ? "Edited pitch" : "Added pitch",
      target: next.code,
      detail: `${next.area} · ${next.hookup} · ${next.surface}`,
      tone: "record",
    });
    toast({ message: `${next.code} ${editing ? "updated" : "added"}`, variant: "success" });
    setDrawerOpen(false);
  };

  const toggleStatus = (p: Pitch) => {
    const activating = p.status === "Inactive";
    setList((l) =>
      l.map((x) =>
        x.code === p.code ? { ...x, status: activating ? "Active" : "Inactive" } : x,
      ),
    );
    log({
      actor: admin.name,
      actorInitials: admin.initials,
      event: activating ? "Activated pitch" : "Deactivated pitch",
      target: p.code,
      detail: activating ? "back in service" : "logged data retained",
      tone: activating ? "record" : "danger",
    });
    toast({
      message: `${p.code} ${activating ? "activated" : "deactivated"}`,
      variant: activating ? "success" : "danger",
    });
  };

  const columns: LedgerColumn<Pitch>[] = [
    {
      key: "code",
      header: "Pitch",
      cellClassName: "font-spline font-medium text-ink-900",
      render: (p) => p.code,
    },
    { key: "area", header: "Area", render: (p) => p.area },
    {
      key: "setup",
      header: "Setup",
      cellClassName: "font-spline text-[12px] text-ink-muted",
      render: (p) => `${p.hookup} · ${p.surface}`,
    },
    {
      key: "holder",
      header: "Assigned holder",
      render: (p) =>
        p.holder ? (
          <EntityCell initials={initialsOf(p.holder)} name={p.holder} />
        ) : p.status === "Active" ? (
          // Active but unassigned — the actionable anomaly (amber outline).
          <StatusMark variant="anomaly" label="— Unassigned" />
        ) : (
          <StatusMark variant="pending" label="— Unassigned" />
        ),
    },
    {
      key: "status",
      header: "Status",
      render: (p) =>
        p.status === "Active" ? (
          <StatusMark variant="active" label="Active" />
        ) : (
          <StatusMark variant="inactive" label="Inactive" />
        ),
    },
    { key: "nights", header: "Nights MTD", numeric: true, render: (p) => p.nightsMTD },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (p) => (
        <Menu trigger={({ open, toggle }) => <RowMenuButton open={open} toggle={toggle} label={`Actions for ${p.code}`} />}>
          <MenuItem onClick={() => openEdit(p)}>Edit</MenuItem>
          <MenuItem onClick={() => toast({ message: `Opening calendar for ${p.code}`, variant: "info" })}>
            View calendar
          </MenuItem>
          <MenuRule />
          {p.status === "Inactive" ? (
            <MenuItem onClick={() => toggleStatus(p)}>Activate</MenuItem>
          ) : (
            <MenuItem destructive onClick={() => setDeactivateTarget(p)}>
              Deactivate
            </MenuItem>
          )}
        </Menu>
      ),
    },
  ];

  return (
    <>
      <ContentHeader
        title="Pitches"
        description={`Configure pitch numbers, areas, setup and the holder assigned to each. ${activeCount} active of ${total} this season.`}
        action={<SplitButton size="compact" label="Add pitch" onClick={openAdd} />}
      />

      <FilterBar>
        <FilterSelect
          label="Area"
          value={area}
          onChange={setArea}
          options={[{ value: "all", label: "All" }, ...areas.map((a) => ({ value: a, label: a }))]}
        />
        <FilterSelect
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "all", label: "All" },
            { value: "Active", label: "Active" },
            { value: "Inactive", label: "Inactive" },
          ]}
        />
        <FilterSearch value={query} onChange={setQuery} placeholder="Search pitch number…" width={220} />
      </FilterBar>

      <Ledger
        columns={columns}
        rows={rows}
        getKey={(p) => p.code}
        caption="Pitches at Rairanta"
        empty={{ icon: null, title: "No pitches match these filters.", guidance: "Clear a filter to see the rest of the site." }}
        footer={
          <>
            <LedgerCount shown={rows.length} total={filtered.length} unit="pitches" />
            {pageCount > 1 && <LedgerPagination page={page} pageCount={pageCount} onPage={setPage} />}
          </>
        }
      />

      {/* Add / edit pitch */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? `Edit ${editing.code}` : "Add pitch"}
        description={editing ? "Update this pitch's setup or holder." : "Add a pitch to this campsite."}
        footer={
          <>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="text-[0.9375rem] font-medium text-ink-900 underline decoration-line decoration-1 underline-offset-[6px] hover:text-pine-700 hover:decoration-amber-500"
            >
              Cancel
            </button>
            <SplitButton size="compact" label={editing ? "Save pitch" : "Add pitch"} disabled={!code.trim()} onClick={savePitch} />
          </>
        }
      >
        <div className="flex flex-col gap-6">
          <Field label="Pitch number" htmlFor="p-code">
            <UnderlineInput id="p-code" mono value={code} onChange={(e) => setCode(e.target.value)} placeholder="A-15" />
          </Field>

          <Field label="Area" htmlFor="p-area">
            <UnderlineSelect id="p-area" value={formArea} onChange={(e) => setFormArea(e.target.value)}>
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </UnderlineSelect>
          </Field>

          <Field label="Hookup">
            <RuledRadioGroup
              name="p-hookup"
              legend="Hookup"
              value={hookup}
              onChange={(v) => setHookup(v as Hookup)}
              options={[
                { value: "Electric", label: "Electric" },
                { value: "None", label: "None" },
              ]}
            />
          </Field>

          <Field label="Surface">
            <RuledRadioGroup
              name="p-surface"
              legend="Surface"
              value={surface}
              onChange={(v) => setSurface(v as Surface)}
              options={[
                { value: "Grass", label: "Grass" },
                { value: "Gravel", label: "Gravel" },
              ]}
            />
          </Field>

          <Field label="Assign holder" htmlFor="p-holder" hint="Optional — pitches can stay unassigned.">
            <UnderlineSelect id="p-holder" value={holder} onChange={(e) => setHolder(e.target.value)}>
              <option value="">Unassigned</option>
              {holderNames.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </UnderlineSelect>
          </Field>
        </div>
      </Drawer>

      <ConfirmModal
        open={deactivateTarget !== null}
        onClose={() => setDeactivateTarget(null)}
        title="Deactivate pitch"
        consequence={
          deactivateTarget
            ? `${deactivateTarget.code} stops accepting new entries. Everything already logged against it is kept and still counts toward your reports.`
            : ""
        }
        confirmLabel="Deactivate"
        onConfirm={() => deactivateTarget && toggleStatus(deactivateTarget)}
      />
    </>
  );
}
