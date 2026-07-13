"use client";

/* PITCH HOLDER — Profile (PORTAL_SPEC B4.4). A single narrow column of
   ledger-framed groups. The pitch itself is read-only: holders don't assign
   their own pitch, staff do — the role boundary is stated, not enforced by a
   missing button. */

import { useState } from "react";
import type { ReactNode } from "react";
import {
  Field,
  ContentHeader,
  LedgerFrame,
  RuledRadioGroup,
  SplitButton,
  StatusMark,
  ToggleRow,
  UnderlineInput,
  UnderlineLink,
  useAudit,
  useToast,
} from "@/components/portal";
import { signOutAction } from "@/lib/auth-actions";
import { PasswordDrawer } from "../_components/PasswordDrawer";
import { holder, pitch, season, sessions } from "../data";

type Lang = "fi" | "en";

function Group({
  title,
  description,
  children,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-line pt-8">
      <h2 className="font-familjen text-[1.125rem] font-semibold tracking-[-0.02em] text-pine-900">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-[0.875rem] leading-relaxed text-ink-muted">{description}</p>
      )}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function PitchHolderProfile() {
  const toast = useToast();
  const { log } = useAudit();

  const [details, setDetails] = useState({
    name: holder.name,
    email: holder.email,
    phone: holder.phone,
  });
  const [reminder, setReminder] = useState(true);
  const [announcements, setAnnouncements] = useState(true);
  const [lang, setLang] = useState<Lang>("en");
  const [changingPassword, setChangingPassword] = useState(false);

  const dirty =
    details.name !== holder.name ||
    details.email !== holder.email ||
    details.phone !== holder.phone;

  const saveDetails = () => {
    log({
      actor: holder.name,
      actorInitials: holder.initials,
      event: "Updated profile",
      detail: details.email !== holder.email ? `${holder.email} → ${details.email}` : undefined,
      tone: "settings",
    });
    toast({ message: "Your details are saved.", variant: "success" });
  };

  const signOut = () => {
    // Real sign-out: clears the Supabase session server-side, then /login.
    void signOutAction();
  };

  return (
    <div className="max-w-[560px]">
      <ContentHeader title="Profile" description="Your details and preferences." />

      <div className="flex flex-col gap-8">
        {/* 1 — Your details */}
        <section>
          <h2 className="font-familjen text-[1.125rem] font-semibold tracking-[-0.02em] text-pine-900">
            Your details
          </h2>
          <LedgerFrame className="mt-4" bodyClassName="flex flex-col gap-7 p-5">
            <Field label="Full name" htmlFor="pf-name">
              <UnderlineInput
                id="pf-name"
                autoComplete="name"
                value={details.name}
                onChange={(e) => setDetails((d) => ({ ...d, name: e.target.value }))}
              />
            </Field>
            <Field label="Email" htmlFor="pf-email">
              <UnderlineInput
                id="pf-email"
                type="email"
                autoComplete="email"
                value={details.email}
                onChange={(e) => setDetails((d) => ({ ...d, email: e.target.value }))}
              />
            </Field>
            <Field label="Phone" htmlFor="pf-phone">
              <UnderlineInput
                id="pf-phone"
                type="tel"
                autoComplete="tel"
                value={details.phone}
                onChange={(e) => setDetails((d) => ({ ...d, phone: e.target.value }))}
              />
            </Field>
            <div className="flex justify-end">
              <SplitButton
                size="compact"
                label="Save changes"
                disabled={!dirty}
                onClick={saveDetails}
              />
            </div>
          </LedgerFrame>
        </section>

        {/* 2 — Your pitch (read-only: assigned by staff) */}
        <Group title="Your pitch" description="Assigned by campsite staff.">
          <LedgerFrame bodyClassName="p-0">
            <dl className="text-[0.9375rem]">
              {[
                ["Pitch", pitch.code],
                ["Area", pitch.area],
                ["Agreement", pitch.agreement],
                ["Season", season.range],
                ["Capacity", `${pitch.capacity} persons`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 last:border-0"
                >
                  <dt className="font-spline text-[11px] uppercase tracking-[0.12em] text-ink-muted">
                    {label}
                  </dt>
                  <dd className="font-spline tabular-nums text-ink-900">{value}</dd>
                </div>
              ))}
            </dl>
          </LedgerFrame>
        </Group>

        {/* 3 — Notifications */}
        <Group title="Notifications">
          <LedgerFrame bodyClassName="px-5 py-1">
            <div className="divide-y divide-line">
              <ToggleRow
                label="Remind me at 20:00 if tonight is unlogged"
                hint="A single nudge, on the evenings you've missed."
                checked={reminder}
                onChange={setReminder}
              />
              <ToggleRow
                label="Event announcements"
                hint="Midsummer, market days and anything else staff publish."
                checked={announcements}
                onChange={setAnnouncements}
              />
            </div>
          </LedgerFrame>
        </Group>

        {/* 4 — Language */}
        <Group
          title="Language"
          description="Finnish holders are the real users — Suomi ships next."
        >
          <RuledRadioGroup
            name="lang"
            legend="Language"
            value={lang}
            onChange={setLang}
            options={[
              { value: "fi", label: "Suomi", hint: "Coming soon." },
              { value: "en", label: "English" },
            ]}
          />
        </Group>

        {/* 5 — Security */}
        <Group title="Security">
          <LedgerFrame bodyClassName="p-0">
            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
              <span className="text-[0.9375rem] text-ink-900">Password</span>
              <UnderlineLink
                onClick={() => setChangingPassword(true)}
                className="text-[0.875rem]"
              >
                Change password
              </UnderlineLink>
            </div>
            <ul>
              {sessions.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5 last:border-0"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[0.9375rem] text-ink-900">
                      {s.device}
                    </span>
                    <span className="block font-spline text-[12px] text-ink-muted">
                      {s.place} · {s.last}
                    </span>
                  </span>
                  {s.current ? (
                    <StatusMark variant="active" label="THIS DEVICE" />
                  ) : (
                    <StatusMark variant="pending" label="SIGNED IN" />
                  )}
                </li>
              ))}
            </ul>
          </LedgerFrame>
        </Group>

        {/* 6 — Sign out */}
        <section className="border-t border-line pt-8">
          <UnderlineLink tone="danger" onClick={signOut}>
            Sign out
          </UnderlineLink>
        </section>
      </div>

      <PasswordDrawer
        open={changingPassword}
        onClose={() => setChangingPassword(false)}
      />
    </div>
  );
}
