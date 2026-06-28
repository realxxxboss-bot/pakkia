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
import { holders, type Assignment } from "@/app/power-user/data";

/* Link a pitch holder to a pitch. Staff can reassign; only admins create new
   users — so the holder list is fixed. */

export function AssignSheet({
  pitch,
  onClose,
  onSave,
}: {
  pitch: Assignment | null;
  onClose: () => void;
  onSave: (pitchCode: string, holder: string) => void;
}) {
  const open = pitch !== null;
  const displayed = useRetained(pitch);

  const [holder, setHolder] = useState("");
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (pitch) setHolder(pitch.holder ?? "");
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
            onClick={() => displayed && onSave(displayed.code, holder)}
          >
            Save holder
          </SheetSave>
        </>
      }
    >
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
    </Sheet>
  );
}
