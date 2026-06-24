"use client";

import { useId, useState } from "react";

/* Form primitives shared by the signup and login screens.
   Label above, input, error below — the established Pakkia form pattern. */

export const inputClass =
  "w-full rounded-[10px] border border-border bg-surface px-4 py-3 font-body text-[16px] text-ink transition-[border-color,box-shadow] duration-150 ease-[var(--ease-out)] placeholder:text-secondary/55 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 disabled:bg-subtle disabled:text-muted aria-[invalid=true]:border-[#b3402a] aria-[invalid=true]:focus:ring-[#b3402a]/15";

export const labelClass =
  "font-eyebrow text-[10.5px] font-semibold tracking-[0.1em] text-secondary uppercase";

export function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[9px]">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
        {hint}
      </div>
      {children}
      {error && (
        <p
          id={`${id}-err`}
          className="text-[13px] font-medium text-[#b3402a]"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({
  id,
  type = "text",
  value,
  onChange,
  error,
  ...rest
}: {
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "id" | "type" | "value" | "onChange"
>) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-err` : undefined}
      className={inputClass}
      {...rest}
    />
  );
}

export function PasswordInput({
  id,
  value,
  onChange,
  error,
  autoComplete = "current-password",
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  const labelId = useId();
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`${inputClass} pr-12`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        aria-pressed={show}
        aria-describedby={labelId}
        className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-[10px] text-muted transition-colors duration-150 hover:text-ink focus-visible:outline-2"
      >
        {show ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" />
            <path d="M9.4 5.2A9.5 9.5 0 0112 5c5 0 9 4.5 9 7a12 12 0 01-2.2 3M6.1 6.6A12.8 12.8 0 003 12c0 2.5 4 7 9 7a9.7 9.7 0 003.7-.7" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
      <span id={labelId} className="sr-only">
        Show password as plain text
      </span>
    </div>
  );
}
