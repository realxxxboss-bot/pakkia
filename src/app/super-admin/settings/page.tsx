import type { ReactNode } from "react";
import { Badge, Card, PageHeader } from "@/components/dashboard/primitives";
import { inputClass, labelClass } from "@/components/auth/fields";
import { planConfigs, platformSettings } from "../data";

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-4 border-b border-border py-6 last:border-0 sm:grid-cols-[240px_1fr] sm:gap-8">
      <div>
        <h4 className="text-[15px] font-semibold text-ink">{title}</h4>
        <p className="mt-1 text-[13px] leading-snug text-muted">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function SuperAdminSettings() {
  return (
    <>
      <PageHeader
        title="Platform settings"
        subtitle="Global configuration that applies to every campsite on Pakkia."
      />

      {/* Plans & pricing */}
      <Card className="mb-6">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <h3 className="text-[15px] font-semibold">Plans &amp; pricing</h3>
          <button
            type="button"
            className="rounded-[10px] bg-primary px-4 py-2 text-[13.5px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.98]"
          >
            Save changes
          </button>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-3">
          {planConfigs.map((p) => (
            <div
              key={p.name}
              className="rounded-[14px] border border-border bg-subtle/50 p-4"
            >
              <p className="mb-3 font-heading text-[15px] font-semibold text-primary">
                {p.name}
              </p>
              <div className="flex flex-col gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>Price / mo (€)</span>
                  <input className={inputClass} defaultValue={p.price} />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>Pitch limit</span>
                  <input className={inputClass} defaultValue={p.pitchLimit} />
                </label>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* General platform settings */}
      <Card className="px-5">
        <SettingRow
          title="Data & region"
          description="Where all tenant data is hosted."
        >
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge tone="success">EU · Frankfurt</Badge>
            <Badge tone="primary">GDPR</Badge>
            <Badge tone="neutral">Daily backups</Badge>
          </div>
          <label className="flex max-w-[420px] flex-col gap-1.5">
            <span className={labelClass}>Default retention</span>
            <input className={inputClass} defaultValue={platformSettings.retention} />
          </label>
        </SettingRow>

        <SettingRow
          title="Email sender"
          description="From address for invites, magic links and invoices."
        >
          <label className="flex max-w-[420px] flex-col gap-1.5">
            <span className={labelClass}>Sender</span>
            <input
              className={inputClass}
              defaultValue={platformSettings.emailSender}
            />
          </label>
        </SettingRow>

        <SettingRow
          title="Trial length"
          description="Free period given to every new campsite."
        >
          <label className="flex max-w-[280px] flex-col gap-1.5">
            <span className={labelClass}>Days</span>
            <input className={inputClass} defaultValue={platformSettings.trialDays} />
          </label>
        </SettingRow>

        <SettingRow
          title="Branding"
          description="Footer credit shown on every tenant portal."
        >
          <label className="flex max-w-[420px] flex-col gap-1.5">
            <span className={labelClass}>Footer credit</span>
            <input
              className={inputClass}
              defaultValue={platformSettings.footerCredit}
            />
          </label>
        </SettingRow>
      </Card>

      <p className="mt-8 font-eyebrow text-[9.5px] font-semibold tracking-[0.1em] text-muted uppercase">
        Powered by <span className="text-secondary">Growth Nexus</span>
      </p>
    </>
  );
}
