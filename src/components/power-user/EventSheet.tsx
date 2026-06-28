"use client";

import { useState } from "react";
import {
  Sheet,
  SheetCancel,
  SheetField,
  SheetSave,
  sheetControl,
} from "@/components/power-user/Sheet";

/* Add a highlighted date to the calendar. Holders see site-wide events that are
   marked visible; internal ones stay staff-only. */

const SCOPES = ["Site-wide", "A area", "B area", "C area"] as const;

export type NewEvent = {
  title: string;
  from: string;
  to: string;
  scope: string;
  visible: boolean;
};

export function EventSheet({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (event: NewEvent) => void;
}) {
  const [title, setTitle] = useState("");
  const [from, setFrom] = useState("2026-06-20");
  const [to, setTo] = useState("2026-06-22");
  const [scope, setScope] = useState<string>("Site-wide");
  const [visible, setVisible] = useState(true);

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setTitle("");
      setFrom("2026-06-20");
      setTo("2026-06-22");
      setScope("Site-wide");
      setVisible(true);
    }
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Add event"
      description="Highlight a special date on the calendar."
      footer={
        <>
          <SheetCancel onClick={onClose} />
          <SheetSave onClick={() => onSave({ title, from, to, scope, visible })}>
            Save event
          </SheetSave>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <SheetField label="Title" htmlFor="ev-title">
          <input
            id="ev-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Midsummer · Juhannus"
            className={sheetControl}
          />
        </SheetField>

        <div className="grid grid-cols-2 gap-4">
          <SheetField label="From" htmlFor="ev-from">
            <input
              id="ev-from"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className={sheetControl}
            />
          </SheetField>
          <SheetField label="To" htmlFor="ev-to">
            <input
              id="ev-to"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className={sheetControl}
            />
          </SheetField>
        </div>

        <SheetField label="Scope" htmlFor="ev-scope">
          <select
            id="ev-scope"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className={sheetControl}
          >
            {SCOPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </SheetField>

        <label className="flex items-center justify-between gap-4 rounded-[12px] border border-border bg-subtle px-4 py-3">
          <span className="text-[14.5px] font-medium text-ink">
            Visible to pitch holders
          </span>
          <input
            type="checkbox"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
            className="h-5 w-5 flex-none accent-primary"
          />
        </label>
      </div>
    </Sheet>
  );
}
