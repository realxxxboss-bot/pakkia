"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  ContentHeader,
  Field,
  LedgerFrame,
  RuledRadioGroup,
  SplitButton,
  ToggleRow,
  UnderlineInput,
  useAudit,
  useToast,
} from "@/components/portal";
import { ConfirmModal } from "@/components/portal/ConfirmModal";
import { admin, occupancyBases, settings, today } from "../data";

type FormState = {
  campsiteName: string;
  seasonStart: string;
  seasonEnd: string;
  peakStart: string;
  peakEnd: string;
  pitchCapacity: string;
  occupancyBasis: string;
  countEmptyNights: boolean;
  autoRemind: boolean;
};

const INITIAL: FormState = {
  campsiteName: settings.campsiteName,
  seasonStart: settings.seasonStart,
  seasonEnd: settings.seasonEnd,
  peakStart: settings.peakStart,
  peakEnd: settings.peakEnd,
  pitchCapacity: String(settings.pitchCapacity),
  occupancyBasis: settings.occupancyBasis,
  countEmptyNights: settings.countEmptyNights,
  autoRemind: settings.autoRemind,
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
    <div className="grid gap-6 border-b border-line py-10 first:pt-0 last:border-0 lg:grid-cols-[280px_1fr]">
      <div className="lg:sticky lg:top-[76px] lg:self-start">
        <h2 className="font-familjen text-[1.125rem] font-semibold tracking-[-0.02em] text-pine-900">
          {title}
        </h2>
        <p className="mt-1 max-w-[36ch] text-[0.875rem] leading-snug text-ink-muted">
          {description}
        </p>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function AdminSettings() {
  const toast = useToast();
  const { log } = useAudit();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [saved, setSaved] = useState<FormState>(INITIAL);
  const [closeOpen, setCloseOpen] = useState(false);
  const [archived, setArchived] = useState(false);

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(saved), [form, saved]);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  // The peak window must sit inside the season.
  const peakInvalid =
    form.peakStart < form.seasonStart ||
    form.peakEnd > form.seasonEnd ||
    form.peakStart > form.peakEnd;

  const saveAll = () => {
    if (peakInvalid) return;
    // Every save writes an audit event — with the value diff where it matters.
    if (form.pitchCapacity !== saved.pitchCapacity) {
      log({
        actor: admin.name,
        actorInitials: admin.initials,
        event: "Updated settings",
        target: "Scoring rules",
        detail: `pitch capacity ${saved.pitchCapacity} → ${form.pitchCapacity}`,
        tone: "settings",
      });
    }
    if (form.seasonEnd !== saved.seasonEnd || form.seasonStart !== saved.seasonStart) {
      log({
        actor: admin.name,
        actorInitials: admin.initials,
        event: "Updated settings",
        target: `Season ${today.season}`,
        detail: `season ${saved.seasonStart} → ${form.seasonStart} · ${saved.seasonEnd} → ${form.seasonEnd}`,
        tone: "settings",
      });
    }
    log({
      actor: admin.name,
      actorInitials: admin.initials,
      event: "Updated settings",
      target: "Campsite settings",
      detail: "saved",
      tone: "settings",
    });
    toast({ message: "Settings saved", variant: "success" });
    setSaved(form);
  };

  return (
    <>
      {/* Post-close read-only banner */}
      {archived && (
        <div className="mb-6 rounded-[6px] border border-line bg-paper-deep px-4 py-3 font-spline text-[12px] uppercase tracking-[0.08em] text-ink-muted">
          Season {today.season} is archived · read-only
        </div>
      )}

      <ContentHeader
        title="Settings"
        description="Season dates and the scoring rules used to calculate occupancy for Rairanta."
      />

      <Group
        title="Site details"
        description="Name and the subdomain holders use to reach this campsite's portal."
      >
        <LedgerFrame>
          <div className="flex flex-col gap-6">
            <Field label="Campsite name" htmlFor="s-name">
              <UnderlineInput
                id="s-name"
                value={form.campsiteName}
                onChange={(e) => set("campsiteName", e.target.value)}
              />
            </Field>
            <Field
              label="Subdomain"
              htmlFor="s-sub"
              hint="Contact platform to change."
            >
              <UnderlineInput id="s-sub" mono readOnly value={settings.subdomain} className="text-ink-muted" />
            </Field>
          </div>
        </LedgerFrame>
      </Group>

      <Group
        title="Season definition"
        description="The reporting period and the peak window highlighted in reports."
      >
        <LedgerFrame>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Season start" htmlFor="s-start">
              <UnderlineInput id="s-start" type="date" mono value={form.seasonStart} onChange={(e) => set("seasonStart", e.target.value)} />
            </Field>
            <Field label="Season end" htmlFor="s-end">
              <UnderlineInput id="s-end" type="date" mono value={form.seasonEnd} onChange={(e) => set("seasonEnd", e.target.value)} />
            </Field>
            <Field label="Peak start" htmlFor="p-start">
              <UnderlineInput id="p-start" type="date" mono value={form.peakStart} onChange={(e) => set("peakStart", e.target.value)} />
            </Field>
            <Field label="Peak end" htmlFor="p-end">
              <UnderlineInput id="p-end" type="date" mono value={form.peakEnd} onChange={(e) => set("peakEnd", e.target.value)} />
            </Field>
          </div>
          {peakInvalid && (
            <p className="mt-4 font-spline text-[12px] text-terracotta">
              The peak window must fall inside the season.
            </p>
          )}
        </LedgerFrame>
      </Group>

      <Group
        title="Scoring & occupancy"
        description="How nights are scored into the occupancy figures across this campsite's reports and dashboard."
      >
        <LedgerFrame>
          <div className="flex flex-col gap-6">
            <Field
              label="Pitch capacity"
              htmlFor="s-cap"
              hint="Maximum persons used to calculate a full pitch when scoring occupancy."
            >
              <UnderlineInput
                id="s-cap"
                type="number"
                min={1}
                max={20}
                mono
                className="max-w-[160px]"
                value={form.pitchCapacity}
                onChange={(e) => set("pitchCapacity", e.target.value)}
              />
            </Field>

            <Field label="Occupancy basis">
              <RuledRadioGroup
                name="occ-basis"
                legend="Occupancy basis"
                value={form.occupancyBasis}
                onChange={(v) => set("occupancyBasis", v)}
                options={occupancyBases.map((b) => ({ value: b, label: b }))}
              />
            </Field>

            <div>
              <p className="mb-1 font-spline text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
                Counting rules
              </p>
              <div className="divide-y divide-line">
                {/* Helper sentences kept verbatim — they document the rules. */}
                <ToggleRow
                  label="Count empty nights as zero"
                  hint="Logged nights of 0 persons still count toward the period."
                  checked={form.countEmptyNights}
                  onChange={(v) => set("countEmptyNights", v)}
                />
                <ToggleRow
                  label="Auto-remind for missing entries"
                  hint={`Nudge holders at ${settings.reminderTime} when a night is unlogged.`}
                  checked={form.autoRemind}
                  onChange={(v) => set("autoRemind", v)}
                />
              </div>
            </div>
          </div>
        </LedgerFrame>
      </Group>

      <Group
        title="Danger zone"
        description="Irreversible actions for this campsite's season."
      >
        {/* The ONLY red border in the app. */}
        <div className="rounded-[12px] border border-terracotta bg-paper p-5">
          <h3 className="font-familjen text-[1.0625rem] font-semibold tracking-[-0.02em] text-terracotta">
            Close season &amp; archive
          </h3>
          <p className="mt-1.5 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-muted">
            Locks all records for {today.season} and archives the season. This cannot be undone.
          </p>
          <div className="mt-4">
            <SplitButton
              size="compact"
              variant="danger"
              label="Close season"
              disabled={archived}
              onClick={() => setCloseOpen(true)}
            />
          </div>
        </div>
      </Group>

      {/* Unsaved-changes guard */}
      {dirty && (
        <div className="sticky bottom-4 z-20 mt-6 flex items-center justify-between gap-3 rounded-[8px] bg-pine-900 px-4 py-3 text-cream shadow-soft">
          <span className="text-[0.875rem]">You have unsaved changes</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setForm(saved)}
              className="text-[0.875rem] text-cream underline decoration-line-dark decoration-1 underline-offset-[4px] transition-colors hover:decoration-amber-500"
            >
              Discard
            </button>
            <SplitButton size="compact" variant="cream" label="Save" disabled={peakInvalid} onClick={saveAll} />
          </div>
        </div>
      )}

      <ConfirmModal
        open={closeOpen}
        onClose={() => setCloseOpen(false)}
        title="Close season & archive"
        consequence={`All ${today.season} records at Rairanta become read-only. Holders and staff can still view them, but nothing more can be logged or edited. This cannot be undone.`}
        confirmLabel="Close season"
        typeToConfirm={`CLOSE ${today.season}`}
        onConfirm={() => {
          setArchived(true);
          log({
            actor: admin.name,
            actorInitials: admin.initials,
            event: "Closed season",
            target: `Season ${today.season}`,
            detail: "archived · read-only",
            tone: "danger",
          });
          toast({ message: `Season ${today.season} archived`, variant: "danger" });
        }}
      />
    </>
  );
}
