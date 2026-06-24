"use client";

import { useEffect, useId, useRef, useState } from "react";
import { PlusIcon } from "@/components/dashboard/icons";

/* Log / edit the number of people who stayed on a given night.
   Centered dialog on desktop, bottom sheet on mobile. Controlled by the
   parent screen. Placeholder only — onSave just reports the value. */

export type EntryTarget = { key: string; title: string; persons: number };

export function EntrySheet({
  target,
  onClose,
  onSave,
}: {
  target: EntryTarget | null;
  onClose: () => void;
  onSave: (value: number) => void;
}) {
  const open = target !== null;
  const panelRef = useRef<HTMLDivElement>(null);
  const headingId = useId();

  const [value, setValue] = useState(0);
  // Keep the last shown target so the panel retains its content while it
  // animates out. Reset the stepper on each open (adjust-state-during-render,
  // React's documented pattern — no effect needed).
  const [displayed, setDisplayed] = useState<EntryTarget | null>(target);
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (target) {
      setDisplayed(target);
      setValue(target.persons);
    }
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const step = (delta: number) => setValue((v) => Math.max(0, v + delta));

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[80] ${open ? "" : "pointer-events-none"}`}
    >
      <div
        onClick={onClose}
        aria-hidden
        className={`absolute inset-0 bg-dark/50 backdrop-blur-[2px] transition-opacity duration-200 ease-[var(--ease-out)] motion-reduce:transition-none ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="absolute inset-0 flex items-end justify-center sm:items-center sm:p-6">
        <div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby={headingId}
          className={`relative w-full rounded-t-[20px] bg-surface p-6 shadow-lg outline-none transition-[opacity,transform] duration-200 ease-[var(--ease-out)] motion-reduce:transition-none sm:max-w-[420px] sm:rounded-[18px] ${
            open
              ? "translate-y-0 opacity-100 sm:scale-100"
              : "translate-y-6 opacity-0 sm:translate-y-0 sm:scale-95"
          }`}
        >
          {/* mobile grip */}
          <div
            className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-container sm:hidden"
            aria-hidden
          />

          <h2 id={headingId} className="text-[20px]">
            {displayed?.title ?? "Log night"}
          </h2>
          <p className="mt-1 text-[14px] text-secondary">
            Pitch A-07 · how many people stayed?
          </p>

          <div className="mt-6 flex items-center gap-3 rounded-[14px] border border-border bg-subtle p-2">
            <StepButton
              label="One fewer person"
              onClick={() => step(-1)}
              disabled={value <= 0}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
                <path d="M5 12h14" />
              </svg>
            </StepButton>
            <div
              className="nums flex-1 text-center font-mono text-[44px] font-semibold leading-none tracking-[-0.02em] text-ink"
              aria-live="polite"
            >
              {value}
            </div>
            <StepButton label="One more person" onClick={() => step(1)}>
              <PlusIcon size={22} />
            </StepButton>
          </div>
          <p className="mt-2.5 text-center font-eyebrow text-[10px] font-semibold tracking-[0.1em] text-muted uppercase">
            Persons overnight
          </p>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-none rounded-[10px] px-5 py-3.5 text-[15px] font-semibold text-secondary ring-1 ring-border transition-colors duration-150 ease-[var(--ease-out)] hover:bg-subtle active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSave(value)}
              className="group flex flex-1 items-center justify-center gap-2 rounded-[10px] bg-primary px-5 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.98]"
            >
              Save night
            </button>
          </div>
        </div>
      </div>
    </div>
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
      className="grid h-14 w-14 flex-none place-items-center rounded-[12px] bg-surface text-primary shadow-xs ring-1 ring-border transition-[transform,color] duration-150 ease-[var(--ease-out)] hover:text-primary-dark active:scale-[0.94] disabled:text-muted disabled:opacity-50 disabled:active:scale-100"
    >
      {children}
    </button>
  );
}
