"use client";

import { useState } from "react";
import {
  Badge,
  DataTable,
  PageHeader,
  type Column,
} from "@/components/dashboard/primitives";
import {
  ChevronDownIcon,
  MoreIcon,
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
import { areas, pitches, pitchTotal, type Pitch } from "../data";

const columns: Column<Pitch>[] = [
  {
    key: "code",
    header: "Pitch",
    className: "font-semibold text-ink",
    render: (r) => r.code,
  },
  { key: "area", header: "Area", render: (r) => r.area },
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
    render: () => (
      <button
        type="button"
        aria-label="Pitch actions"
        className="grid h-8 w-8 place-items-center rounded-[9px] text-muted transition-colors duration-150 hover:bg-subtle hover:text-primary"
      >
        <MoreIcon size={16} />
      </button>
    ),
  },
];

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

export default function AdminPitches() {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Pitches"
        subtitle={`Manage pitch numbers, areas and the holder assigned to each. ${pitchTotal} pitches in this season.`}
        actions={
          <button
            type="button"
            onClick={() => setAddOpen(true)}
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
            placeholder="Search pitch or holder…"
            className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-muted"
          />
        </label>
        <FilterPill>Area: All</FilterPill>
        <FilterPill>Status: All</FilterPill>
      </div>

      <DataTable
        columns={columns}
        rows={pitches}
        getRowKey={(r) => r.code}
        caption="Pitches at Rairanta"
      />

      <Sheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add pitch"
        description="Create a new pitch for this season."
        footer={
          <>
            <SheetCancel onClick={() => setAddOpen(false)} />
            <SheetSave onClick={() => setAddOpen(false)}>Add pitch</SheetSave>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <SheetField label="Pitch number" htmlFor="ap-code">
            <input id="ap-code" className={sheetControl} placeholder="e.g. A-15" />
          </SheetField>
          <SheetField label="Area" htmlFor="ap-area">
            <select id="ap-area" className={sheetControl} defaultValue="">
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
          <SheetField label="Assign holder (optional)" htmlFor="ap-holder">
            <select id="ap-holder" className={sheetControl} defaultValue="">
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
