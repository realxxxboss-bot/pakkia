"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader, Badge } from "@/components/dashboard/primitives";
import { Field, TextInput, inputClass } from "@/components/auth/fields";
import { site, staff } from "../data";

export default function PowerUserProfile() {
  const [values, setValues] = useState({
    name: staff.name,
    email: staff.email,
    phone: staff.phone,
  });
  const [dailyDigest, setDailyDigest] = useState(true);
  const [pendingAlerts, setPendingAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const update = (key: keyof typeof values, v: string) => {
    setValues((s) => ({ ...s, [key]: v }));
    if (saved) setSaved(false);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <>
      <PageHeader title="Profile" subtitle="Your details and notification preferences." />

      <div className="max-w-[560px]">
        <div className="mb-7 flex items-center gap-4">
          <span
            className="grid h-14 w-14 flex-none place-items-center rounded-[16px] bg-primary font-heading text-[20px] font-semibold text-white"
            aria-hidden
          >
            {staff.initials}
          </span>
          <div>
            <p className="font-heading text-[20px] font-semibold tracking-[-0.01em] text-ink">
              {staff.name}
            </p>
            <p className="mt-0.5 font-eyebrow text-[10px] font-semibold tracking-[0.1em] text-muted uppercase">
              {staff.role} · {site.name}
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <Field id="pf-name" label="Full name">
            <TextInput
              id="pf-name"
              value={values.name}
              onChange={(v) => update("name", v)}
              autoComplete="name"
            />
          </Field>
          <Field id="pf-email" label="Email">
            <TextInput
              id="pf-email"
              type="email"
              value={values.email}
              onChange={(v) => update("email", v)}
              autoComplete="email"
            />
          </Field>
          <Field id="pf-phone" label="Phone">
            <TextInput
              id="pf-phone"
              type="tel"
              value={values.phone}
              onChange={(v) => update("phone", v)}
              autoComplete="tel"
            />
          </Field>
          <Field id="pf-role" label="Role (set by campsite)">
            <input
              id="pf-role"
              value={`${staff.role} · ${site.name}`}
              disabled
              className={inputClass}
            />
          </Field>

          {/* notification toggles */}
          <div className="flex flex-col divide-y divide-border border-y border-border">
            <ToggleRow
              title="Daily digest"
              hint="A morning summary of last night's counts across all pitches."
              checked={dailyDigest}
              onChange={setDailyDigest}
            />
            <ToggleRow
              title="Pending-entry alerts"
              hint="Notify me when pitches still need a count before reporting closes."
              checked={pendingAlerts}
              onChange={setPendingAlerts}
            />
          </div>

          {/* data residency note */}
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-secondary">
            <Badge tone="primary">EU · Frankfurt</Badge>
            <Badge tone="primary">GDPR</Badge>
            <span>Your data stays in the EU.</span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-[10px] bg-primary px-5 py-3 text-[15px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.98]"
            >
              Save changes
            </button>
            <Link
              href="/login"
              className="rounded-[10px] px-5 py-3 text-[15px] font-semibold text-secondary ring-1 ring-border transition-colors duration-150 hover:bg-subtle hover:text-ink"
            >
              Sign out
            </Link>
            {saved && (
              <span
                role="status"
                className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-primary"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Changes saved
              </span>
            )}
          </div>
        </form>

        <p className="mt-8 font-eyebrow text-[9.5px] font-semibold tracking-[0.1em] text-muted uppercase">
          Powered by <span className="text-secondary">Growth Nexus</span>
        </p>
      </div>
    </>
  );
}

function ToggleRow({
  title,
  hint,
  checked,
  onChange,
}: {
  title: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-5">
      <div>
        <p className="text-[15px] font-medium text-ink">{title}</p>
        <p className="mt-0.5 max-w-[42ch] text-[13px] text-muted">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 flex-none rounded-full transition-colors duration-200 ease-[var(--ease-out)] focus-visible:outline-2 ${
          checked ? "bg-primary" : "bg-border-strong"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-[var(--ease-out)] motion-reduce:transition-none ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
