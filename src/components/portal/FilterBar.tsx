"use client";

/* ------------------------------------------------------------------
   FilterBar (PORTAL_SPEC A2 "Filter bar") — mono segmented selects, applied
   filters as removable RULED TAGS (not pills), and a compact underline
   search focused by the "/" shortcut.
------------------------------------------------------------------ */

import { useEffect, useRef, type ReactNode } from "react";
import { Menu, MenuItem } from "./Menu";

export function FilterBar({ children }: { children: ReactNode }) {
  return <div className="mb-5 flex flex-wrap items-center gap-2.5">{children}</div>;
}

export type FilterOption = { value: string; label: string };

/* Mono select — "Plan: All", opens the A5 menu. */
export function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (v: string) => void;
}) {
  const current = options.find((o) => o.value === value)?.label ?? "All";
  return (
    <Menu
      align="start"
      label={`${label} filter`}
      trigger={({ open, toggle }) => (
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={toggle}
          className="tap-target inline-flex h-[34px] items-center gap-2 rounded-[6px] border border-line px-3 font-spline text-[12px] text-ink-900 transition-colors duration-150 hover:bg-paper-deep"
        >
          <span className="text-ink-muted">{label}:</span>
          {current}
          <span aria-hidden className="text-ink-muted">▾</span>
        </button>
      )}
    >
      {options.map((o) => (
        <MenuItem key={o.value} onClick={() => onChange(o.value)}>
          {o.label}
        </MenuItem>
      ))}
    </Menu>
  );
}

/* Removable ruled tag — the applied-filter chip, square-ish, not a pill. */
export function AppliedTag({
  children,
  onRemove,
}: {
  children: ReactNode;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-line bg-paper-deep px-2 py-1 font-spline text-[12px] text-ink-900">
      {children}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove filter"
        className="tap-target text-ink-muted transition-colors hover:text-terracotta"
      >
        ×
      </button>
    </span>
  );
}

/* Compact underline search — 1px --line bottom border, "/" focuses it. */
export function FilterSearch({
  value,
  onChange,
  placeholder = "Search…",
  width = 220,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  width?: number;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div className="relative" style={{ width }}>
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="tap-field w-full border-b border-line bg-transparent pb-1.5 pr-6 font-spline text-[12px] text-ink-900 outline-none transition-[border-color] duration-150 placeholder:text-ink-muted focus:border-b-2 focus:border-pine-700"
      />
      {!value && (
        <span
          className="pointer-events-none absolute right-0 top-0 grid size-4 place-items-center rounded-[3px] border border-line font-spline text-[10px] text-ink-muted"
          aria-hidden
        >
          /
        </span>
      )}
    </div>
  );
}
