"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  DataTable,
  PageHeader,
  type Column,
} from "@/components/dashboard/primitives";
import {
  ChevronDownIcon,
  PlusIcon,
  SearchIcon,
} from "@/components/dashboard/icons";
import {
  Sheet,
  SheetCancel,
  SheetField,
  SheetSave,
  sheetControl,
} from "@/components/power-user/Sheet";
import {
  areas,
  pitches as seedPitches,
  pitchTotal,
  type Pitch,
} from "../data";

function FilterPill({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-[10px] bg-surface px-3.5 py-2.5 text-[13.5px] font-medium text-secondary ring-1 ring-border transition-colors duration-150 hover:bg-subtle hover:text-ink"
    >
      {children}
      <ChevronDownIcon size={15} className="text-muted" />
    </button>
  );
}

function RowActions({
  pitch,
  onEdit,
  onToggleStatus,
}: {
  pitch: Pitch;
  onEdit: (p: Pitch) => void;
  onToggleStatus: (code: string) => void;
}) {
  const active = pitch.status === "Active";
  return (
    <div className="flex items-center justify-end gap-1.5">
      <button
        type="button"
        onClick={() => onEdit(pitch)}
        className="rounded-[8px] px-2.5 py-1.5 text-[13px] font-semibold text-secondary ring-1 ring-border transition-colors duration-150 hover:bg-subtle hover:text-ink"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => onToggleStatus(pitch.code)}
        className={`rounded-[8px] px-2.5 py-1.5 text-[13px] font-semibold ring-1 transition-colors duration-150 ${
          active
            ? "text-error ring-error/30 hover:bg-error/10"
            : "text-primary ring-primary/30 hover:bg-primary-tint"
        }`}
      >
        {active ? "Deactivate" : "Activate"}
      </button>
    </div>
  );
}

export default function AdminPitches() {
  const [list, setList] = useState<Pitch[]>(seedPitches);
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Pitch | null>(null);

  const activeCount = list.filter((p) => p.status === "Active").length;

  const toggleStatus = (code: string) =>
    setList((prev) =>
      prev.map((p) =>
        p.code === code
          ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" }
          : p,
      ),
    );

  const openAdd = () => {
    setEditing(null);
    setSheetOpen(true);
  };
  const openEdit = (p: Pitch) => {
    setEditing(p);
    setSheetOpen(true);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (p) =>
        p.code.toLowerCase().includes(q) ||
        p.area.toLowerCase().includes(q) ||
        (p.holder ?? "").toLowerCase().includes(q),
    );
  }, [list, query]);

  const columns: Column<Pitch>[] = [
    {
      key: "code",
      header: "Pitch",
      className: "font-semibold text-ink",
      render: (r) => r.code,
    },
    { key: "area", header: "Area", render: (r) => r.area },
    {
      key: "meta",
      header: "Setup",
      className: "text-muted text-[13px]",
      render: (r) => (
        <span className="whitespace-nowrap">
          {r.hookup === "Electric" ? "Electric" : "No hookup"} · {r.surface}
        </span>
      ),
    },
    {
      key: "holder",
      header: "Assigned holder",
      render: (r) =>
        r.holder ? (
          <span>
            {r.holder}
            {r.holderEmail && (
              <span className="ml-1 text-[12.5px] text-muted">
                · {r.holderEmail}
              </span>
            )}
          </span>
        ) : (
          <span className="text-muted">— Unassigned</span>
        ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <Badge tone={r.status === "Active" ? "success" : "neutral"} dot>
          {r.status}
        </Badge>
      ),
    },
    {
      key: "nights",
      header: "Nights MTD",
      align: "right",
      render: (r) => (
        <span
          className={`nums font-mono font-semibold ${
            r.nightsMTD === 0 ? "text-muted" : "text-ink"
          }`}
        >
          {r.nightsMTD}
        </span>
      ),
    },
    {
      key: "action",
      header: "",
      align: "right",
      render: (r) => (
        <RowActions pitch={r} onEdit={openEdit} onToggleStatus={toggleStatus} />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Pitches"
        subtitle={`Configure pitch numbers, areas, setup and the holder assigned to each. ${activeCount} active of ${pitchTotal} this season.`}
        actions={
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-4 py-2.5 text-[14.5px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.98]"
          >
            <PlusIcon size={17} />
            Add pitch
          </button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <label className="flex min-w-[200px] flex-1 items-center gap-2.5 rounded-[10px] bg-surface px-3.5 py-2.5 ring-1 ring-border focus-within:ring-2 focus-within:ring-primary/40 sm:max-w-[320px]">
          <SearchIcon size={16} className="flex-none text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pitch or holder…"
            className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-muted"
          />
        </label>
        <FilterPill>Area: All</FilterPill>
        <FilterPill>Status: All</FilterPill>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        getRowKey={(r) => r.code}
        caption="Pitches at Rairanta"
        empty={
          <p className="px-4 py-10 text-center text-[14px] text-muted">
            No pitches match “{query}”.
          </p>
        }
      />

      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={editing ? `Edit pitch ${editing.code}` : "Add pitch"}
        description={
          editing
            ? "Update this pitch's area, setup and assigned holder."
            : "Create a new pitch for this season."
        }
        footer={
          <>
            <SheetCancel onClick={() => setSheetOpen(false)} />
            <SheetSave onClick={() => setSheetOpen(false)}>
              {editing ? "Save changes" : "Add pitch"}
            </SheetSave>
          </>
        }
      >
        <div className="flex flex-col gap-4" key={editing?.code ?? "new-pitch"}>
          <SheetField label="Pitch number" htmlFor="ap-code">
            <input
              id="ap-code"
              className={sheetControl}
              placeholder="e.g. A-15"
              defaultValue={editing?.code ?? ""}
            />
          </SheetField>
          <SheetField label="Area" htmlFor="ap-area">
            <select
              id="ap-area"
              className={sheetControl}
              defaultValue={editing?.area ?? ""}
            >
              <option value="" disabled>
                Select an area
              </option>
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </SheetField>
          <div className="grid grid-cols-2 gap-4">
            <SheetField label="Hookup" htmlFor="ap-hookup">
              <select
                id="ap-hookup"
                className={sheetControl}
                defaultValue={editing?.hookup ?? "Electric"}
              >
                <option value="Electric">Electric</option>
                <option value="None">No hookup</option>
              </select>
            </SheetField>
            <SheetField label="Surface" htmlFor="ap-surface">
              <select
                id="ap-surface"
                className={sheetControl}
                defaultValue={editing?.surface ?? "Grass"}
              >
                <option value="Grass">Grass</option>
                <option value="Gravel">Gravel</option>
              </select>
            </SheetField>
          </div>
          <SheetField label="Assign holder (optional)" htmlFor="ap-holder">
            <select
              id="ap-holder"
              className={sheetControl}
              defaultValue={editing?.holder ?? ""}
            >
              <option value="">— Leave unassigned</option>
              <option>Aino Korhonen</option>
              <option>Mikko Laine</option>
              <option>Satu Niemi</option>
              <option>Janne Mäkinen</option>
            </select>
          </SheetField>
        </div>
      </Sheet>
    </>
  );
}
