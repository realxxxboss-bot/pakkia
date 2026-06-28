"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { CloseIcon } from "@/components/dashboard/icons";

/* Generic accessible dialog for the Power User portal: centered card on
   desktop, bottom sheet on mobile. Stays mounted and animates via opacity /
   transform so content is retained while it closes. Mirrors the pitch-holder
   EntrySheet pattern, but reusable across Quick entry / Assign / Add event. */

export const sheetFieldLabel =
  "font-eyebrow text-[10.5px] font-semibold tracking-[0.1em] text-secondary uppercase";

export const sheetControl =
  "w-full rounded-[10px] border border-border bg-surface px-3.5 py-3 font-body text-[15px] text-ink transition-[border-color,box-shadow] duration-150 ease-[var(--ease-out)] focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15";

/** Keep the last non-null value so a dialog can finish its close animation. */
export function useRetained<T>(value: T | null): T | null {
  const [retained, setRetained] = useState(value);
  const [prev, setPrev] = useState(value);
  if (value !== prev) {
    setPrev(value);
    if (value !== null) setRetained(value);
  }
  return retained;
}

export function SheetField({
  label,
  htmlFor,
  children,
  className = "",
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={htmlFor} className={sheetFieldLabel}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function Sheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  footer: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const headingId = useId();

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
          className={`relative flex w-full flex-col rounded-t-[20px] bg-surface shadow-lg outline-none transition-[opacity,transform] duration-200 ease-[var(--ease-out)] motion-reduce:transition-none sm:max-w-[460px] sm:rounded-[18px] ${
            open
              ? "translate-y-0 opacity-100 sm:scale-100"
              : "translate-y-6 opacity-0 sm:translate-y-0 sm:scale-95"
          }`}
        >
          <div
            className="mx-auto mt-3 mb-1 h-1.5 w-10 flex-none rounded-full bg-container sm:hidden"
            aria-hidden
          />
          <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-1 sm:pt-6">
            <div>
              <h2 id={headingId} className="text-[20px]">
                {title}
              </h2>
              {description && (
                <p className="mt-1 text-[14px] leading-snug text-secondary">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid h-9 w-9 flex-none place-items-center rounded-[10px] text-muted ring-1 ring-border transition-colors duration-150 hover:bg-subtle hover:text-ink"
            >
              <CloseIcon size={18} />
            </button>
          </div>

          <div className="px-6 py-5">{children}</div>

          <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Shared footer buttons. */
export function SheetCancel({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[10px] px-5 py-2.5 text-[14.5px] font-semibold text-secondary ring-1 ring-border transition-colors duration-150 ease-[var(--ease-out)] hover:bg-subtle active:scale-[0.98]"
    >
      Cancel
    </button>
  );
}

export function SheetSave({
  onClick,
  children = "Save",
}: {
  onClick: () => void;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[10px] bg-primary px-5 py-2.5 text-[14.5px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.98]"
    >
      {children}
    </button>
  );
}
