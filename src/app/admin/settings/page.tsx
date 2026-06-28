import type { ReactNode } from "react";
import { Badge, Card, PageHeader } from "@/components/dashboard/primitives";
import { ChevronDownIcon } from "@/components/dashboard/icons";
import { inputClass, labelClass } from "@/components/auth/fields";
import { settings } from "../data";

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

export default function AdminSettings() {
  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Site details, season dates and data handling for Rairanta."
      />

      <Card className="mb-6 px-5">
        <SettingRow
          title="Site details"
          description="Name and the subdomain holders use to reach the portal."
        >
          <div className="flex flex-col gap-4">
            <label className="flex max-w-[420px] flex-col gap-1.5">
              <span className={labelClass}>Campsite name</span>
              <input className={inputClass} defaultValue={settings.campsiteName} />
            </label>
            <label className="flex max-w-[420px] flex-col gap-1.5">
              <span className={labelClass}>Subdomain</span>
              <input className={inputClass} defaultValue={settings.subdomain} />
            </label>
          </div>
        </SettingRow>

        <SettingRow
          title="Season dates"
          description="Defines the reporting period and which months appear in reports."
        >
          <div className="flex flex-wrap gap-4">
            <label className="flex max-w-[180px] flex-col gap-1.5">
              <span className={labelClass}>Season start</span>
              <input
                type="date"
                className={inputClass}
                defaultValue={settings.seasonStart}
              />
            </label>
            <label className="flex max-w-[180px] flex-col gap-1.5">
              <span className={labelClass}>Season end</span>
              <input
                type="date"
                className={inputClass}
                defaultValue={settings.seasonEnd}
              />
            </label>
          </div>
        </SettingRow>

        <SettingRow
          title="Data & privacy"
          description="Where data lives and how long it's kept."
        >
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge tone="success">EU · Frankfurt</Badge>
            <Badge tone="primary">GDPR</Badge>
            <Badge tone="neutral">Daily backups</Badge>
          </div>
          <div className="flex max-w-[280px] flex-col gap-1.5">
            <span className={labelClass}>Retention</span>
            <span className="flex items-center justify-between gap-2 rounded-[10px] border border-border bg-surface px-4 py-3 text-[14px] text-ink">
              {settings.retention}
              <ChevronDownIcon size={16} className="text-muted" />
            </span>
          </div>
        </SettingRow>
      </Card>

      {/* danger zone */}
      <Card className="border-error/25">
        <div className="border-b border-error/15 px-5 py-4">
          <h3 className="text-[15px] font-semibold text-error">Danger zone</h3>
        </div>
        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-[14.5px] font-semibold text-ink">
              Close season &amp; archive
            </h4>
            <p className="mt-1 max-w-[52ch] text-[13px] text-muted">
              Locks all records for 2026 and archives the season. This cannot be
              undone.
            </p>
          </div>
          <button
            type="button"
            className="flex-none rounded-[10px] px-5 py-2.5 text-[14px] font-semibold text-error ring-1 ring-error/30 transition-colors duration-150 hover:bg-error hover:text-white"
          >
            Close season
          </button>
        </div>
      </Card>

      <p className="mt-8 font-eyebrow text-[9.5px] font-semibold tracking-[0.1em] text-muted uppercase">
        Powered by <span className="text-secondary">Growth Nexus</span>
      </p>
    </>
  );
}
