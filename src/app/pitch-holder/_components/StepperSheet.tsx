"use client";

/* ------------------------------------------------------------------
   THE STEPPER (PORTAL_SPEC B4.2) — this replaces the old "log night" form,
   and it is the whole product for the holder: one number, once a day, with
   cold hands, in the dark, on a phone.

   So: two 56px square buttons flanking a 4rem mono count. Long-press repeats.
   Tapping the number types it directly (a holder with 9 guests shouldn't press
   "+" nine times). 0 is a valid, meaningful answer — the pitch was empty — and
   the helper says so, because a blank night and an empty night are different
   facts to Statistics Finland.

   A bottom sheet on phones (thumb reach), the standard right drawer on desktop.
   Both are the ONE shared Drawer component — the holder portal doesn't get its
   own dialog.
------------------------------------------------------------------ */

import { useEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Drawer, SplitButton, UnderlineLink } from "@/components/portal";
import { useHolder, useIsDesktop, type DayTarget } from "./holder-store";
import { dateKey, dayLabel, eventOn, isToday, pitch, today } from "../data";

export function StepperSheet() {
  const { target } = useHolder();
  if (!target) return null;
  // Keyed by the night: opening a different day mounts a fresh stepper, so the
  // count is seeded from that night's record with no syncing effect to get
  // wrong. (React's "reset state with a key".)
  return <Stepper key={dateKey(target.month, target.day)} target={target} />;
}

function Stepper({ target }: { target: DayTarget }) {
  const { closeStepper, entries, save, capacity } = useHolder();
  const desktop = useIsDesktop();

  // Seeded from the night already on record — 0 included, because an empty
  // night is a recorded fact, not an absence.
  const [count, setCount] = useState(
    () => entries[dateKey(target.month, target.day)] ?? 0,
  );
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const repeat = useRef<{ delay?: number; tick?: number }>({});

  useEffect(() => {
    if (typing) inputRef.current?.select();
  }, [typing]);

  const clamp = (n: number) => Math.max(0, Math.min(capacity, n));

  const stopRepeat = () => {
    window.clearTimeout(repeat.current.delay);
    window.clearInterval(repeat.current.tick);
    repeat.current = {};
  };
  useEffect(() => stopRepeat, []);

  /** Press = one step. Hold = a step every 90ms after a 400ms delay. */
  const startRepeat = (delta: number) => {
    setCount((c) => clamp(c + delta));
    stopRepeat();
    repeat.current.delay = window.setTimeout(() => {
      repeat.current.tick = window.setInterval(() => {
        setCount((c) => {
          const next = clamp(c + delta);
          if (next === c) stopRepeat(); // hit a bound — stop hammering it
          return next;
        });
      }, 90);
    }, 400);
  };

  const commitTyped = () => {
    const parsed = Number.parseInt(draft, 10);
    setCount(Number.isNaN(parsed) ? 0 : clamp(parsed));
    setTyping(false);
  };

  const { month, day } = target;
  const event = eventOn(month, day);
  const tonight = isToday(month, day);
  const past = month < today.month || (month === today.month && day < today.day);
  const atMax = count >= capacity;

  const stepBtn =
    "grid size-14 flex-none place-items-center rounded-[8px] border border-line text-pine-900 transition-colors duration-150 hover:bg-paper-deep active:border-pine-700 active:bg-pine-700 active:text-cream disabled:opacity-40 disabled:hover:bg-transparent";

  return (
    <Drawer
      open
      onClose={closeStepper}
      side={desktop ? "right" : "bottom"}
      title={
        <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-spline text-[0.9375rem] uppercase tracking-[0.08em] text-pine-900">
          {pitch.code} · {dayLabel(month, day)}
          {event && (
            <span className="font-spline text-[11px] uppercase tracking-[0.12em] text-amber-500">
              {event.tag}
            </span>
          )}
        </span>
      }
      footer={
        <div className="flex w-full flex-col items-center gap-3">
          <SplitButton
            size="full"
            label="Save night"
            onClick={() => save(target, count)}
          />
          <UnderlineLink onClick={closeStepper} className="text-[0.875rem]">
            Cancel
          </UnderlineLink>
        </div>
      }
    >
      <div className="flex flex-col items-center py-2">
        <p className="font-spline text-[11px] uppercase tracking-[0.12em] text-ink-muted">
          {tonight ? "Persons staying tonight" : "Persons who stayed"}
        </p>

        <div className="mt-5 flex w-full items-center justify-center gap-5 sm:gap-7">
          <button
            type="button"
            aria-label="One person fewer"
            disabled={count <= 0}
            onPointerDown={() => startRepeat(-1)}
            onPointerUp={stopRepeat}
            onPointerLeave={stopRepeat}
            onPointerCancel={stopRepeat}
            className={stepBtn}
          >
            <Minus size={22} strokeWidth={1.75} aria-hidden />
          </button>

          {typing ? (
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              aria-label="Number of persons"
              value={draft}
              onChange={(e) => setDraft(e.target.value.replace(/\D/g, "").slice(0, 2))}
              onBlur={commitTyped}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitTyped();
                if (e.key === "Escape") setTyping(false);
              }}
              className="w-[5.5rem] border-b-2 border-pine-700 bg-transparent text-center font-spline text-[4rem] font-medium leading-none tabular-nums text-pine-900 outline-none"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setDraft(String(count));
                setTyping(true);
              }}
              aria-label={`${count} persons. Tap to type a number.`}
              className="w-[5.5rem] rounded-[6px] border-b-2 border-transparent text-center font-spline text-[4rem] font-medium leading-none tabular-nums text-pine-900 transition-colors duration-150 hover:border-line"
            >
              {count}
            </button>
          )}

          <button
            type="button"
            aria-label="One person more"
            disabled={atMax}
            onPointerDown={() => startRepeat(1)}
            onPointerUp={stopRepeat}
            onPointerLeave={stopRepeat}
            onPointerCancel={stopRepeat}
            className={stepBtn}
          >
            <Plus size={22} strokeWidth={1.75} aria-hidden />
          </button>
        </div>

        {/* One reserved line, so the sheet never jumps as the note changes. */}
        <p className="mt-5 flex min-h-[2.25rem] items-center px-2 text-center text-[0.8125rem] text-ink-muted">
          {atMax ? (
            <span className="font-spline text-[11px] uppercase tracking-[0.12em]">
              MAX {capacity} PER PITCH
            </span>
          ) : count === 0 ? (
            "0 = pitch was empty tonight."
          ) : (
            "Tap the number to type it."
          )}
        </p>

        {past && (
          <p className="mt-2 border-t border-line pt-4 font-spline text-[11px] uppercase tracking-[0.1em] text-ink-muted">
            Edits are recorded in the audit trail.
          </p>
        )}
      </div>
    </Drawer>
  );
}
