"use client";

/* The Assign / Reassign drawer (PORTAL_SPEC B3.2). Shared by the Assignments
   ledger and the dashboard's "Pending assignments" rows, which open it
   prefilled with the pitch — so the two entry points cannot drift apart. */

import { useEffect, useId, useState } from "react";
import {
  Drawer,
  Field,
  RuledRadioGroup,
  SplitButton,
  UnderlineInput,
} from "@/components/portal";
import {
  agreements,
  holders,
  type Agreement,
  type Assignment,
} from "../data";

export type AssignResult = {
  holder: string;
  agreement: Agreement;
  season: string;
  since: string;
};

export function AssignDrawer({
  pitch,
  onClose,
  onSave,
}: {
  /** The pitch being assigned; null keeps the drawer closed. */
  pitch: Assignment | null;
  onClose: () => void;
  onSave: (pitch: Assignment, result: AssignResult) => void;
}) {
  const listId = useId();
  const reassign = Boolean(pitch?.holder);

  const [holder, setHolder] = useState("");
  const [agreement, setAgreement] = useState<Agreement>("Seasonal");
  const [since, setSince] = useState("2026-06-19");

  // Reset the form each time a different pitch opens the drawer.
  useEffect(() => {
    if (!pitch) return;
    setHolder("");
    setAgreement(pitch.agreement ?? "Seasonal");
    setSince("2026-06-19");
  }, [pitch]);

  const valid = holders.includes(holder as (typeof holders)[number]);

  const submit = () => {
    if (!pitch || !valid) return;
    const [, month, day] = since.split("-");
    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    onSave(pitch, {
      holder,
      agreement,
      season: pitch.season,
      since: `${Number(day)} ${MONTHS[Number(month) - 1] ?? "Jun"}`,
    });
    onClose();
  };

  return (
    <Drawer
      open={Boolean(pitch)}
      onClose={onClose}
      title={reassign ? "Reassign holder" : "Assign a holder"}
      description={
        reassign
          ? "The current agreement ends today; the new holder starts from the date below."
          : "Link a pitch holder to this pitch for the season."
      }
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="text-[0.9375rem] font-medium text-ink-900 underline decoration-line decoration-1 underline-offset-[6px] transition-colors hover:text-pine-700 hover:decoration-amber-500"
          >
            Cancel
          </button>
          <SplitButton
            label="Save assignment"
            size="compact"
            onClick={submit}
            disabled={!valid}
          />
        </>
      }
    >
      {pitch && (
        <div className="flex flex-col gap-6">
          {/* Pitch context header — the drawer always says what it is acting on. */}
          <div className="rounded-[6px] border border-line bg-paper-deep px-4 py-3">
            <p className="font-spline text-[11px] uppercase tracking-[0.12em] text-ink-muted">
              Pitch
            </p>
            <p className="mt-1 font-spline text-[1rem] font-medium tabular-nums text-pine-900">
              {pitch.code} · {pitch.area}
            </p>
            {reassign && (
              <p className="mt-1.5 font-spline text-[12px] text-ink-muted">
                Currently {pitch.holder} · {pitch.agreement} since {pitch.since} ·{" "}
                <span className="text-terracotta">ends today</span>
              </p>
            )}
          </div>

          <Field label="Pitch holder" hint="Only an administrator can create new holders.">
            <UnderlineInput
              list={listId}
              value={holder}
              onChange={(e) => setHolder(e.target.value)}
              placeholder="Search holders…"
              autoComplete="off"
            />
            <datalist id={listId}>
              {holders.map((h) => (
                <option key={h} value={h} />
              ))}
            </datalist>
          </Field>

          <Field label="Agreement">
            <RuledRadioGroup
              name="agreement"
              legend="Agreement"
              value={agreement}
              onChange={setAgreement}
              options={agreements.map((a) => ({
                value: a,
                label: a,
                hint:
                  a === "Seasonal"
                    ? "Runs to the end of the 2026 season."
                    : "A short booking; the pitch returns to the pool afterwards.",
              }))}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Starts">
              <UnderlineInput
                mono
                type="date"
                value={since}
                onChange={(e) => setSince(e.target.value)}
              />
            </Field>
            <Field label="Season">
              <UnderlineInput mono value={pitch.season} readOnly />
            </Field>
          </div>
        </div>
      )}
    </Drawer>
  );
}
