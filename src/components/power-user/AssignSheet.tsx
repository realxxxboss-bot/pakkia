"use client";

import { useState } from "react";
import {
  Sheet,
  SheetCancel,
  SheetField,
  SheetSave,
  sheetControl,
  useRetained,
} from "@/components/power-user/Sheet";
import {
  agreements,
  holders,
  type Agreement,
  type Assignment,
} from "@/app/power-user/data";

/* Link a pitch holder to a pitch for a season / agreement. Staff can reassign or
   release; only an Administrator creates new users — so the holder roster here
   is fixed. UI only. */

export type AssignDraft = {
  holder: string;
  agreement: Agreement;
  season: string;
};

export function AssignSheet({
  pitch,
  onClose,
  onSave,
}: {
  pitch: Assignment | null;
  onClose: () => void;
  onSave: (pitchCode: string, draft: AssignDraft) => void;
}) {
  const open = pitch !== null;
  const displayed = useRetained(pitch);

  const [holder, setHolder] = useState("");
  const [agreement, setAgreement] = useState<Agreement>("Seasonal");
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (pitch) {
      setHolder(pitch.holder ?? "");
      setAgreement(pitch.agreement ?? "Seasonal");
    }
  }

  const verb = displayed?.holder ? "Reassign" : "Assign";

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={`${verb} holder`}
      description={
        displayed
          ? `${verb} a pitch holder for ${displayed.code} · ${displayed.area}.`
          : undefined
      }
      footer={
        <>
          <SheetCancel onClick={onClose} />
          <SheetSave
            onClick={() =>
              displayed &&
              onSave(displayed.code, {
                holder,
                agreement,
                season: displayed.season,
              })
            }
          >
            Save assignment
          </SheetSave>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <SheetField label="Pitch holder" htmlFor="as-holder">
          <select
            id="as-holder"
            value={holder}
            onChange={(e) => setHolder(e.target.value)}
            className={sheetControl}
          >
            <option value="">Select a holder…</option>
            {holders.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </SheetField>

        <SheetField label="Agreement" htmlFor="as-agreement">
          <div
            id="as-agreement"
            role="radiogroup"
            aria-label="Agreement"
            className="flex gap-1.5 rounded-[12px] bg-subtle p-1.5"
          >
            {agreements.map((a) => {
              const on = agreement === a;
              return (
                <button
                  key={a}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setAgreement(a)}
                  className={`flex-1 rounded-[9px] px-3 py-2 text-[13.5px] font-semibold transition-colors duration-150 ${
                    on
                      ? "bg-primary text-white shadow-sm"
                      : "text-secondary hover:text-ink"
                  }`}
                >
                  {a}
                </button>
              );
            })}
          </div>
        </SheetField>

        <SheetField label="Season" htmlFor="as-season">
          <input
            id="as-season"
            value={displayed ? `Season ${displayed.season}` : ""}
            disabled
            className={`${sheetControl} disabled:bg-subtle disabled:text-muted`}
          />
        </SheetField>

        {displayed?.holder && (
          <p className="rounded-[10px] bg-subtle px-3.5 py-3 text-[13px] leading-snug text-secondary">
            Reassigning replaces{" "}
            <span className="font-semibold text-ink">{displayed.holder}</span>.
            To release the pitch instead, choose the blank holder.
          </p>
        )}
      </div>
    </Sheet>
  );
}
