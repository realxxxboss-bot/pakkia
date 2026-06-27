"use client";

import { useState } from "react";
import { Arrow, btn } from "@/components/ui";

type Field = "name" | "site" | "email" | "message";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  "w-full rounded-[10px] border border-border bg-surface px-4 py-3 font-body text-[16px] text-ink transition-[border-color,box-shadow] duration-150 ease-[var(--ease-out)] placeholder:text-secondary/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15";

const labelClass =
  "font-eyebrow text-[10.5px] font-semibold tracking-[0.1em] text-secondary uppercase";

export default function ContactForm() {
  const [values, setValues] = useState<Record<Field, string>>({
    name: "",
    site: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState(false);

  const update = (field: Field, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<Field, string>> = {};
    if (!values.name.trim()) next.name = "Please tell us your name.";
    if (!values.email.trim()) next.email = "An email is required.";
    else if (!EMAIL_RE.test(values.email.trim()))
      next.email = "That doesn't look like a valid email.";
    if (!values.message.trim())
      next.message = "A quick word about your process helps.";
    return next;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-[20px] border border-border bg-surface p-8 shadow-md lg:p-10">
        <div className="mb-6 grid h-14 w-14 place-items-center rounded-[14px] bg-primary-tint text-primary-dark">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="mb-3 text-[22px]">Thanks, {values.name.split(" ")[0]}!</h3>
        <p className="text-[15.5px] leading-[1.6] text-secondary">
          Your request has been noted. This is a demo, so nothing was sent yet —
          on the live site this would reach{" "}
          <span className="font-semibold text-primary">hello@pakkia.fi</span>{" "}
          and we&apos;d be in touch within one business day.
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="rounded-[20px] border border-border bg-surface p-8 shadow-md lg:p-10"
    >
      <h3 className="mb-6 text-[22px]">Request your free month</h3>

      <FormField
        id="cname"
        label="Your name"
        error={errors.name}
        labelClass={labelClass}
      >
        <input
          id="cname"
          type="text"
          autoComplete="name"
          placeholder="Olli Virtanen"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "cname-err" : undefined}
          className={inputClass}
        />
      </FormField>

      <FormField
        id="csite"
        label="Campsite"
        error={errors.site}
        labelClass={labelClass}
      >
        <input
          id="csite"
          type="text"
          autoComplete="organization"
          placeholder="Rairanta"
          value={values.site}
          onChange={(e) => update("site", e.target.value)}
          className={inputClass}
        />
      </FormField>

      <FormField
        id="cemail"
        label="Email"
        error={errors.email}
        labelClass={labelClass}
      >
        <input
          id="cemail"
          type="email"
          autoComplete="email"
          placeholder="you@yoursite.fi"
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "cemail-err" : undefined}
          className={inputClass}
        />
      </FormField>

      <FormField
        id="cmsg"
        label="How do you track nights today?"
        error={errors.message}
        labelClass={labelClass}
      >
        <textarea
          id="cmsg"
          placeholder="A few words about your current spreadsheet or process…"
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "cmsg-err" : undefined}
          className={`${inputClass} min-h-[130px] resize-y`}
        />
      </FormField>

      <button type="submit" className={`${btn.base} ${btn.primary} w-full justify-center`}>
        Send request <Arrow />
      </button>
    </form>
  );
}

function FormField({
  id,
  label,
  error,
  labelClass,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  labelClass: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-[9px]">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="text-[13px] font-medium text-error">
          {error}
        </p>
      )}
    </div>
  );
}
