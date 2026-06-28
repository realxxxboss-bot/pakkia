"use client";

import { useState, type ReactNode } from "react";
import { Card, PageHeader } from "@/components/dashboard/primitives";
import { inputClass, labelClass } from "@/components/auth/fields";
import { occupancyBases, settings } from "../data";

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

function Toggle({
  label,
  description,
  defaultOn = false,
}: {
  label: string;
  description: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className="flex w-full max-w-[440px] items-center justify-between gap-4 rounded-[12px] border border-border bg-surface px-4 py-3 text-left transition-colors duration-150 hover:bg-subtle/50"
    >
      <span className="leading-tight">
        <span className="block text-[14px] font-medium text-ink">{label}</span>
        <span className="block text-[12.5px] text-muted">{description}</span>
      </span>
      <span
        aria-hidden
        className={`relative h-6 w-10 flex-none rounded-full transition-colors duration-200 ease-[var(--ease-out)] ${
          on ? "bg-primary" : "bg-border-strong"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-[var(--ease-out)] ${
            on ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}

const SegmentInput = ({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  ariaLabel: string;
}) => (
  <div
    role="radiogroup"
    aria-label={ariaLabel}
    className="inline-flex gap-1.5 rounded-[12px] bg-subtle p-1.5"
  >
    {options.map((o) => {
      const on = value === o;
      return (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={on}
          onClick={() => onChange(o)}
          className={`rounded-[9px] px-4 py-2 text-[13.5px] font-semibold transition-colors duration-150 ${
            on ? "bg-primary text-white shadow-sm" : "text-secondary hover:text-ink"
          }`}
        >
          {o}
        </button>
      );
    })}
  </div>
);

export default function AdminSettings() {
  const [basis, setBasis] = useState<string>(settings.occupancyBasis);

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Season dates and the scoring rules used to calculate occupancy for Rairanta."
      />

      {/* site + season */}
      <Card className="mb-6 px-5">
        <SettingRow
          title="Site details"
          description="Name and the subdomain holders use to reach this campsite's portal."
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
          title="Season definition"
          description="The reporting period and the peak window highlighted in reports."
        >
          <div className="flex flex-col gap-5">
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
            <div className="flex flex-wrap gap-4">
              <label className="flex max-w-[180px] flex-col gap-1.5">
                <span className={labelClass}>Peak start</span>
                <input
                  type="date"
                  className={inputClass}
                  defaultValue={settings.peakStart}
                />
              </label>
              <label className="flex max-w-[180px] flex-col gap-1.5">
                <span className={labelClass}>Peak end</span>
                <input
                  type="date"
                  className={inputClass}
                  defaultValue={settings.peakEnd}
                />
              </label>
            </div>
          </div>
        </SettingRow>
      </Card>

      {/* scoring & occupancy rules */}
      <Card className="mb-6 px-5">
        <div className="flex items-center justify-between border-b border-border py-5">
          <div>
            <h3 className="text-[15px] font-semibold text-ink">
              Scoring &amp; occupancy rules
            </h3>
            <p className="mt-1 max-w-[60ch] text-[13px] text-muted">
              How nights are scored into the occupancy figures across this
              campsite&apos;s reports and dashboard.
            </p>
          </div>
        </div>

        <SettingRow
          title="Pitch capacity"
          description="Maximum persons used to calculate a full pitch when scoring occupancy."
        >
          <label className="flex max-w-[180px] flex-col gap-1.5">
            <span className={labelClass}>Persons per pitch</span>
            <input
              type="number"
              min={1}
              max={20}
              className={inputClass}
              defaultValue={settings.pitchCapacity}
            />
          </label>
        </SettingRow>

        <SettingRow
          title="Occupancy basis"
          description="Whether occupancy is measured per person or per pitch night."
        >
          <SegmentInput
            options={occupancyBases}
            value={basis}
            onChange={setBasis}
            ariaLabel="Occupancy basis"
          />
        </SettingRow>

        <SettingRow
          title="Counting rules"
          description="Fine-tune how missing and empty nights affect the numbers."
        >
          <div className="flex flex-col gap-3">
            <Toggle
              label="Count empty nights as zero"
              description="Logged nights of 0 persons still count toward the period."
              defaultOn={settings.countEmptyNights}
            />
            <Toggle
              label="Auto-remind for missing entries"
              description={`Nudge holders at ${settings.reminderTime} when a night is unlogged.`}
              defaultOn={settings.autoRemind}
            />
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
