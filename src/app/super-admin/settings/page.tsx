"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  ContentHeader,
  Field,
  LedgerFrame,
  SplitButton,
  UnderlineInput,
  UnderlineLink,
  useAudit,
  useToast,
} from "@/components/portal";
import { admin, planConfigs, platformSettings } from "../data";

type PlanRow = { price: string; limit: string };
type FormState = {
  plans: Record<string, PlanRow>;
  retention: string;
  emailSender: string;
  trialDays: string;
  footerCredit: string;
};

const INITIAL: FormState = {
  plans: Object.fromEntries(planConfigs.map((p) => [p.name, { price: p.price, limit: p.pitchLimit }])),
  retention: platformSettings.retention,
  emailSender: platformSettings.emailSender,
  trialDays: platformSettings.trialDays,
  footerCredit: platformSettings.footerCredit,
};

function Group({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-6 border-b border-line py-10 first:pt-0 last:border-0 lg:grid-cols-[280px_1fr] [&>*]:min-w-0">
      <div className="lg:sticky lg:top-[76px] lg:self-start">
        <h2 className="font-familjen text-[1.125rem] font-semibold tracking-[-0.02em] text-pine-900">{title}</h2>
        <p className="mt-1 max-w-[36ch] text-[0.875rem] leading-snug text-ink-muted">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function SuperAdminSettings() {
  const toast = useToast();
  const { log } = useAudit();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [saved, setSaved] = useState<FormState>(INITIAL);

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(saved), [form, saved]);
  const plansDirty = useMemo(
    () => JSON.stringify(form.plans) !== JSON.stringify(saved.plans),
    [form.plans, saved.plans],
  );

  const setPlan = (name: string, key: keyof PlanRow, value: string) =>
    setForm((f) => ({ ...f, plans: { ...f.plans, [name]: { ...f.plans[name], [key]: value } } }));

  const savePlans = () => {
    log({ actor: admin.name, actorInitials: admin.initials, event: "Plan pricing updated", detail: "plans & pricing", tone: "settings" });
    toast({ message: "Plan pricing saved", variant: "success" });
    setSaved((s) => ({ ...s, plans: form.plans }));
  };

  const saveAll = () => {
    log({ actor: admin.name, actorInitials: admin.initials, event: "Platform settings updated", tone: "settings" });
    toast({ message: "Settings saved", variant: "success" });
    setSaved(form);
  };

  return (
    <>
      <ContentHeader
        title="Platform settings"
        description="Global configuration that applies to every campsite on Pakkia."
      />

      <Group title="Plans & pricing" description="Price and pitch limit per plan. Changes apply to new subscriptions.">
        <LedgerFrame>
          <div className="flex flex-col gap-6">
            {planConfigs.map((p) => (
              <div key={p.name}>
                <p className="mb-3 font-spline text-[11px] font-medium uppercase tracking-[0.1em] text-pine-700">{p.name}</p>
                <div className="grid gap-5 sm:grid-cols-2 [&>*]:min-w-0">
                  <Field label="Price / mo (€)" htmlFor={`price-${p.name}`}>
                    <UnderlineInput
                      id={`price-${p.name}`}
                      mono
                      value={form.plans[p.name].price}
                      onChange={(e) => setPlan(p.name, "price", e.target.value)}
                    />
                  </Field>
                  <Field label="Pitch limit" htmlFor={`limit-${p.name}`}>
                    <UnderlineInput
                      id={`limit-${p.name}`}
                      mono
                      value={form.plans[p.name].limit}
                      onChange={(e) => setPlan(p.name, "limit", e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </LedgerFrame>
        <div className="mt-4 flex justify-end">
          <SplitButton size="compact" label="Save changes" disabled={!plansDirty} onClick={savePlans} />
        </div>
      </Group>

      <Group title="Data & region" description="Where all tenant data is hosted and how long it is retained.">
        <LedgerFrame>
          <dl className="mb-5 flex flex-col">
            {[
              ["Region", "EU · Frankfurt"],
              ["Compliance", "GDPR"],
              ["Backups", "Daily"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border-b border-line py-2.5 last:border-0 font-spline text-[0.875rem]">
                <dt className="text-ink-muted">{k}</dt>
                <dd className="text-ink-900">{v}</dd>
              </div>
            ))}
          </dl>
          <Field label="Default retention" htmlFor="retention" className="max-w-[280px]">
            <UnderlineInput id="retention" value={form.retention} onChange={(e) => setForm((f) => ({ ...f, retention: e.target.value }))} />
          </Field>
        </LedgerFrame>
      </Group>

      <Group title="Email sender" description="From address for invites, magic links and invoices.">
        <LedgerFrame>
          <Field label="Sender" htmlFor="sender">
            <UnderlineInput id="sender" mono value={form.emailSender} onChange={(e) => setForm((f) => ({ ...f, emailSender: e.target.value }))} />
          </Field>
          <div className="mt-3">
            <UnderlineLink onClick={() => toast({ message: "Test email sent", variant: "info" })}>Send test email</UnderlineLink>
          </div>
        </LedgerFrame>
      </Group>

      <Group title="Trial length" description="Free period given to every new campsite.">
        <LedgerFrame>
          <Field label="Days" htmlFor="trial-days" className="max-w-[200px]">
            <UnderlineInput id="trial-days" mono value={form.trialDays} onChange={(e) => setForm((f) => ({ ...f, trialDays: e.target.value }))} />
          </Field>
        </LedgerFrame>
      </Group>

      <Group title="Branding" description="Footer credit shown on every tenant portal.">
        <LedgerFrame>
          <Field label="Footer credit" htmlFor="footer-credit">
            <UnderlineInput id="footer-credit" value={form.footerCredit} onChange={(e) => setForm((f) => ({ ...f, footerCredit: e.target.value }))} />
          </Field>
          <p className="mt-4 font-spline text-[12px] text-ink-muted">
            Preview: <span className="text-ink-900">{form.footerCredit || "—"}</span>
          </p>
        </LedgerFrame>
      </Group>

      {/* Unsaved-changes guard */}
      {dirty && (
        <div className="sticky bottom-4 z-20 mt-6 flex items-center justify-between gap-3 rounded-[8px] bg-pine-900 px-4 py-3 text-cream shadow-soft">
          <span className="text-[0.875rem]">You have unsaved changes</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setForm(saved)}
              className="tap-target text-[0.875rem] text-cream underline decoration-line-dark decoration-1 underline-offset-[4px] transition-colors hover:decoration-amber-500"
            >
              Discard
            </button>
            <SplitButton size="compact" variant="cream" label="Save" onClick={saveAll} />
          </div>
        </div>
      )}
    </>
  );
}
