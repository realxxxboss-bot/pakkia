"use client";

/* ------------------------------------------------------------------
   Portal form controls (PORTAL_SPEC A2 "Drawers & modals" → form fields).
   The editorial underline field, the ruled-radio list, and the square-
   thumbed toggle — the tiny signature details of the app's forms.
------------------------------------------------------------------ */

import type { ReactNode } from "react";
import { useId } from "react";
import { Check } from "lucide-react";

const labelCls =
  "font-spline text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted";

/* Field wrapper — mono uppercase label above its control. */
export function Field({
  label,
  hint,
  children,
  htmlFor,
  className = "",
}: {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={htmlFor} className={labelCls}>
        {label}
      </label>
      {children}
      {hint && <span className="text-[12px] text-ink-muted">{hint}</span>}
    </div>
  );
}

/* Underline input — 1px --line bottom border, 2px --pine-700 on focus. */
export function UnderlineInput({
  mono = false,
  className = "",
  ...props
}: { mono?: boolean } & React.ComponentPropsWithoutRef<"input">) {
  return (
    <input
      {...props}
      className={`field-underline tap-field w-full border-b border-line bg-transparent pb-1.5 text-[0.9375rem] text-ink-900 outline-none transition-[border-color] duration-150 placeholder:text-ink-muted focus:border-b-2 focus:border-pine-700 ${
        mono ? "font-spline tabular-nums" : ""
      } ${className}`}
    />
  );
}

/* Underline select — the native-select counterpart of UnderlineInput, for
   long option lists (e.g. Campsite) where a ruled-radio list is too tall. */
export function UnderlineSelect({
  className = "",
  children,
  ...props
}: React.ComponentPropsWithoutRef<"select">) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`tap-field w-full appearance-none border-b border-line bg-transparent pb-1.5 pr-6 font-spline text-[0.9375rem] text-ink-900 outline-none transition-[border-color] duration-150 focus:border-b-2 focus:border-pine-700 ${className}`}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute bottom-1.5 right-0 font-spline text-[12px] text-ink-muted" aria-hidden>
        ▾
      </span>
    </div>
  );
}

/* Ruled radio list — each option a row with a 16px square check target. */
export type RuledOption<T extends string> = {
  value: T;
  label: string;
  hint?: ReactNode;
};

export function RuledRadioGroup<T extends string>({
  name,
  value,
  onChange,
  options,
  legend,
}: {
  name: string;
  value: T;
  onChange: (v: T) => void;
  options: RuledOption<T>[];
  legend?: string;
}) {
  const gid = useId();
  return (
    <fieldset className="rounded-[6px] border border-line">
      {legend && <legend className="sr-only">{legend}</legend>}
      {options.map((opt, i) => {
        const selected = opt.value === value;
        const id = `${gid}-${opt.value}`;
        return (
          <label
            key={opt.value}
            htmlFor={id}
            className={`flex cursor-pointer items-start gap-3 px-3.5 py-3 transition-colors duration-150 hover:bg-paper-deep ${
              i > 0 ? "border-t border-line" : ""
            }`}
          >
            <input
              id={id}
              type="radio"
              name={name}
              checked={selected}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            <span
              className={`mt-0.5 grid size-4 flex-none place-items-center rounded-[4px] transition-colors duration-150 ${
                selected
                  ? "bg-pine-700 text-cream"
                  : "border border-ink-muted bg-transparent"
              }`}
              aria-hidden
            >
              {selected && <Check size={11} strokeWidth={3} />}
            </span>
            <span className="min-w-0">
              <span className="block text-[0.9375rem] text-ink-900">{opt.label}</span>
              {opt.hint && (
                <span className="mt-0.5 block text-[0.8125rem] leading-snug text-ink-muted">
                  {opt.hint}
                </span>
              )}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}

/* Square-thumbed toggle — 36×20, thumb 14px square (radius 4px). */
export function SquareToggle({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  id?: string;
}) {
  const gen = useId();
  const inputId = id ?? gen;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      id={inputId}
      onClick={() => onChange(!checked)}
      className={`tap-target relative inline-flex h-5 w-9 flex-none items-center rounded-[6px] border transition-colors duration-150 ${
        checked ? "border-pine-700 bg-pine-100" : "border-line bg-paper-deep"
      }`}
    >
      <span
        className={`absolute top-1/2 size-[14px] -translate-y-1/2 rounded-[4px] transition-[left] duration-150 ${
          checked ? "left-[19px] bg-pine-700" : "left-[2px] bg-ink-muted"
        }`}
        aria-hidden
      />
    </button>
  );
}

/* A settings/toggle row: label + helper on the left, control on the right. */
export function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5">
      <span className="min-w-0">
        <span className="block text-[0.9375rem] text-ink-900">{label}</span>
        {hint && (
          <span className="mt-0.5 block text-[0.8125rem] leading-snug text-ink-muted">
            {hint}
          </span>
        )}
      </span>
      <SquareToggle checked={checked} onChange={onChange} label={label} />
    </div>
  );
}
