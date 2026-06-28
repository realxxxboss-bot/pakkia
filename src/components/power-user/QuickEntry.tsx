"use client";

import { useState } from "react";
import { PlusIcon } from "@/components/dashboard/icons";
import {
  Sheet,
  SheetCancel,
  SheetField,
  SheetSave,
  sheetControl,
  useRetained,
} from "@/components/power-user/Sheet";
import { heatPitches } from "@/app/power-user/data";

/* Log / edit a night for any pitch. Opened from Today (pending list) and from
   Records (heatmap cells). The target pre-fills pitch, date and count. */

export type QuickEntryTarget = {
  title: string;
  pitch: string;
  dateISO: string;
  persons: number;
};

const PITCH_OPTIONS = heatPitches.map((p) => `${p.code} · ${p.area}`);

export function QuickEntry({
  target,
  onClose,
  onSave,
}: {
  target: QuickEntryTarget | null;
  onClose: () => void;
  onSave: (value: QuickEntryTarget) => void;
}) {
  const open = target !== null;
  const displayed = useRetained(target);

  const [pitch, setPitch] = useState("");
  const [date, setDate] = useState("");
  const [persons, setPersons] = useState(0);

  // Re-seed the form each time the dialog opens (render-time reset pattern).
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (target) {
      setPitch(target.pitch);
      setDate(target.dateISO);
      setPersons(target.persons);
    }
  }

  const step = (delta: number) => setPersons((v) => Math.max(0, v + delta));

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={displayed?.title ?? "Log a night"}
      description="Set the number of people who stayed."
      footer={
        <>
          <SheetCancel onClick={onClose} />
          <SheetSave
            onClick={() =>
              onSave({ title: displayed?.title ?? "", pitch, dateISO: date, persons })
            }
          >
            Save night
          </SheetSave>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <SheetField label="Pitch" htmlFor="qe-pitch">
          <select
            id="qe-pitch"
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            className={sheetControl}
          >
            <option value="">Select a pitch…</option>
            {PITCH_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </SheetField>

        <SheetField label="Date" htmlFor="qe-date">
          <input
            id="qe-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={sheetControl}
          />
        </SheetField>

        <SheetField label="Persons that night">
          <div className="flex items-center gap-3 rounded-[14px] border border-border bg-subtle p-2">
            <StepButton
              label="One fewer person"
              onClick={() => step(-1)}
              disabled={persons <= 0}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
                <path d="M5 12h14" />
              </svg>
            </StepButton>
            <div
              className="nums flex-1 text-center font-mono text-[40px] font-semibold leading-none tracking-[-0.02em] text-ink"
              aria-live="polite"
            >
              {persons}
            </div>
            <StepButton label="One more person" onClick={() => step(1)}>
              <PlusIcon size={22} />
            </StepButton>
          </div>
        </SheetField>
      </div>
    </Sheet>
  );
}

function StepButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="grid h-[52px] w-[52px] flex-none place-items-center rounded-[12px] bg-surface text-primary shadow-xs ring-1 ring-border transition-[transform,color] duration-150 ease-[var(--ease-out)] hover:text-primary-dark active:scale-[0.94] disabled:text-muted disabled:opacity-50 disabled:active:scale-100"
    >
      {children}
    </button>
  );
}
