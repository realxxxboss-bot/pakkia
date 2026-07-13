"use client";

import { useState } from "react";
import {
  ContentHeader,
  Field,
  LedgerFrame,
  SplitButton,
  ToggleRow,
  UnderlineInput,
  useToast,
} from "@/components/portal";
import { site, staff } from "../data";

export default function PowerUserProfile() {
  const toast = useToast();

  const [name, setName] = useState(staff.name);
  const [email, setEmail] = useState(staff.email);
  const [phone, setPhone] = useState(staff.phone);
  const [digest, setDigest] = useState(true);
  const [pendingAlerts, setPendingAlerts] = useState(true);

  return (
    <>
      <ContentHeader
        title="Profile"
        description="Your details and notification preferences."
      />

      <div className="flex max-w-[640px] flex-col gap-8">
        <LedgerFrame
          header={
            <span className="font-spline text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
              Your details
            </span>
          }
        >
          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              toast({ message: "Profile saved.", variant: "success" });
            }}
          >
            <Field label="Full name">
              <UnderlineInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </Field>
            <Field label="Email">
              <UnderlineInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </Field>
            <Field label="Phone">
              <UnderlineInput
                mono
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </Field>
            <div className="flex justify-end">
              <SplitButton type="submit" label="Save changes" size="compact" />
            </div>
          </form>
        </LedgerFrame>

        {/* Role boundary: staff cannot promote themselves. */}
        <LedgerFrame
          header={
            <span className="font-spline text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
              Your role
            </span>
          }
        >
          <p className="font-spline text-[0.9375rem] text-pine-900">
            {staff.role} · {site.name}
          </p>
          <p className="mt-1.5 text-[0.8125rem] text-ink-muted">
            Set by the campsite administrator. Staff assign holders and read reports; they do
            not create users or change campsite settings.
          </p>
        </LedgerFrame>

        <LedgerFrame
          header={
            <span className="font-spline text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
              Notifications
            </span>
          }
        >
          <div className="flex flex-col divide-y divide-line">
            <ToggleRow
              label="Daily digest"
              hint="A morning summary of last night's counts across all pitches."
              checked={digest}
              onChange={setDigest}
            />
            <ToggleRow
              label="Pending-entry alerts"
              hint="Notify me when pitches still need a count before reporting closes."
              checked={pendingAlerts}
              onChange={setPendingAlerts}
            />
          </div>
        </LedgerFrame>

        <p className="font-spline text-[12px] text-ink-muted">
          EU · Frankfurt · GDPR — your data stays in the EU.
        </p>
      </div>
    </>
  );
}
