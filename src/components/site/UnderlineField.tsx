"use client";

/* Editorial underline field (inner-pages spec §4.1) — the shared form input
   for Contact, Login and Signup. Label above in mono 11px uppercase; the
   control is transparent with only a 1px --line bottom border. Focus grows
   the border to 2px --pine-700 (the second pixel via an inset box-shadow so
   nothing shifts) and colors the label; errors switch both to #A65D45.
   Autofill overrides live in globals.css under `.field-underline` — cards on
   a non-default background set `--field-autofill-bg` to match. */

import { useId } from "react";

export type UnderlineFieldProps = {
  label: string;
  /** control type; "textarea" renders a <textarea> */
  type?: "text" | "email" | "password" | "textarea";
  /** inline validation message; presence switches the field to error state */
  error?: string;
  /** textarea only */
  rows?: number;
  id?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

export default function UnderlineField({
  label,
  type = "text",
  error,
  rows = 4,
  id,
  className = "",
  ...rest
}: UnderlineFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const errorId = `${fieldId}-error`;

  const control = `field-underline w-full rounded-none border-b bg-transparent py-[0.625rem] font-body text-[1rem] leading-[1.4] text-ink-900 transition-[border-color,box-shadow] duration-200 placeholder:text-ink-muted/60 focus:outline-none focus-visible:outline-none disabled:opacity-60 ${
    error
      ? "border-[#A65D45] focus:shadow-[inset_0_-1px_0_0_#A65D45]"
      : "border-line focus:border-pine-700 focus:shadow-[inset_0_-1px_0_0_var(--color-pine-700)]"
  }`;

  const shared = {
    id: fieldId,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    className: control,
    ...rest,
  };

  return (
    <div className={`group flex flex-col gap-1.5 ${className}`}>
      <label
        htmlFor={fieldId}
        className={`font-spline text-[11px] font-medium uppercase tracking-[0.12em] transition-colors duration-200 ${
          error
            ? "text-[#A65D45]"
            : "text-ink-muted group-focus-within:text-pine-700"
        }`}
      >
        {label}
      </label>
      {type === "textarea" ? (
        <textarea rows={rows} {...shared} />
      ) : (
        <input type={type} {...shared} />
      )}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="font-spline text-[12px] font-medium text-[#A65D45]"
        >
          {error}
        </p>
      )}
    </div>
  );
}
