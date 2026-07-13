"use client";

/* PITCH HOLDER — Dashboard (PORTAL_SPEC B4.1).

   The 10-second-a-day screen. Everything above the fold answers one question:
   "have I logged tonight?" — and if not, gives the holder the single biggest
   button in the product to fix it. */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import {
  ContentHeader,
  HeatCell,
  InstrumentRow,
  SplitButton,
  UnderlineLink,
} from "@/components/portal";
import { useHolder } from "../_components/holder-store";
import {
  dateKey,
  holder,
  monthTotals,
  pitch,
  recentNights,
  today,
  upcomingEvents,
} from "../data";

/* The 20:00 rule (PORTAL_SPEC B4.1). Server and first client render agree
   (false); the real hour corrects it on mount, so there is no hydration
   mismatch. A real deployment resolves this in Europe/Helsinki server-side
   (Part C.7) — never in the phone's local time, which may be anywhere. */
function useAfterEight() {
  const [after, setAfter] = useState(false);
  useEffect(() => setAfter(new Date().getHours() >= 20), []);
  return after;
}

export default function PitchHolderDashboard() {
  const router = useRouter();
  const { entries, openStepper, requestDay } = useHolder();
  const afterEight = useAfterEight();

  const tonightKey = dateKey(today.month, today.day);
  const tonight = entries[tonightKey];
  const logged = tonight !== undefined;
  const overdue = afterEight && !logged;

  const june = monthTotals(entries, today.month);
  const recent = recentNights(entries, 4);
  const events = upcomingEvents(3);

  // A night from the list opens in the CALENDAR's stepper — the holder lands
  // where the correction is visible in context, not in a modal over a list.
  const openInCalendar = (month: number, day: number) => {
    requestDay({ month, day });
    router.push("/pitch-holder/calendar");
  };

  return (
    <>
      <ContentHeader eyebrow={today.mono} title={`Hei, ${holder.firstName}.`} />

      {/* THE CARD — the one place in this design system a true card is earned:
          the pitch, and the state of tonight. */}
      <section className="overflow-hidden rounded-[12px] border border-line bg-paper">
        <div className="flex items-start justify-between gap-4 px-5 py-5 sm:px-6">
          <div>
            <p className="font-spline text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
              Your pitch
            </p>
            <p className="mt-2 font-spline text-[2rem] font-medium leading-none tabular-nums text-pine-900">
              {pitch.code}
            </p>
            <p className="mt-2 text-[0.9375rem] text-ink-muted">
              {pitch.area} · {pitch.site}
            </p>
          </div>
          {logged && (
            <span
              className="grid size-7 flex-none place-items-center rounded-[4px] bg-pine-700 text-cream"
              aria-hidden
            >
              <Check size={16} strokeWidth={2.5} />
            </span>
          )}
        </div>

        {/* Tonight zone. After 20:00 with nothing logged, the rule above it
            turns amber and the button pulses ONCE on load — an attention
            state, not a nag. It never loops. */}
        <div
          className={`border-t px-5 py-5 sm:px-6 ${overdue ? "border-amber-500" : "border-line"}`}
        >
          {logged ? (
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <p className="text-[0.9375rem] text-ink-900">
                Tonight ·{" "}
                <span className="font-spline font-medium tabular-nums text-pine-900">
                  {tonight}
                </span>{" "}
                {tonight === 1 ? "person" : "persons"}
              </p>
              <UnderlineLink
                onClick={() => openStepper({ month: today.month, day: today.day })}
              >
                Edit
              </UnderlineLink>
            </div>
          ) : (
            <>
              <p className="text-[0.9375rem] text-ink-900">
                You haven&apos;t logged tonight yet.
              </p>
              <SplitButton
                size="full"
                label="Log tonight's guests"
                onClick={() => openStepper({ month: today.month, day: today.day })}
                className={`mt-4 ${overdue ? "pulse-once" : ""}`}
              />
            </>
          )}
        </div>
      </section>

      <div className="mt-8">
        <InstrumentRow
          cells={[
            {
              label: "Person-nights · June",
              value: String(june.personNights),
            },
            {
              label: "Nights logged",
              value: String(june.nightsLogged),
              sub: `of ${today.day} nights so far`,
            },
          ]}
        />
      </div>

      {/* What's on — the events staff marked visible to holders. */}
      <section className="mt-10">
        <h2 className="font-familjen text-[1.125rem] font-semibold tracking-[-0.02em] text-pine-900">
          What&apos;s on
        </h2>
        <ul className="mt-4 border-t border-line">
          {events.map((e) => (
            <li
              key={e.name}
              className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line py-3.5"
            >
              <span className="w-[6.5rem] flex-none font-spline text-[12px] uppercase tracking-[0.08em] text-pine-700">
                {e.range}
              </span>
              <span className="text-[0.9375rem] text-ink-900">{e.name}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex items-center gap-2 font-spline text-[11px] uppercase tracking-[0.1em] text-ink-muted">
          <span className="relative size-3.5 rounded-[3px] border border-line" aria-hidden>
            <span className="absolute inset-x-0.5 bottom-[2px] h-[2px] rounded-full bg-amber-500" />
          </span>
          Marked on your calendar
        </p>
      </section>

      {/* Last few nights — each row opens that night's stepper in the calendar. */}
      <section className="mt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-familjen text-[1.125rem] font-semibold tracking-[-0.02em] text-pine-900">
            Last few nights
          </h2>
          <UnderlineLink href="/pitch-holder/calendar" className="text-[0.875rem]">
            View all
          </UnderlineLink>
        </div>
        <ul className="mt-4 border-t border-line">
          {recent.map((n) => (
            <li key={`${n.month}-${n.day}`} className="border-b border-line">
              <button
                type="button"
                onClick={() => openInCalendar(n.month, n.day)}
                className="-mx-3 flex w-[calc(100%+1.5rem)] items-center justify-between gap-4 rounded-[6px] px-3 py-3 text-left transition-colors duration-150 hover:bg-paper-deep"
              >
                <span className="font-spline text-[12px] uppercase tracking-[0.08em] text-ink-muted">
                  {n.label}
                </span>
                <span className="flex items-center gap-3">
                  <span className="text-[0.9375rem] text-ink-900">
                    <span className="font-spline font-medium tabular-nums">{n.persons}</span>{" "}
                    {n.persons === 1 ? "person" : "persons"}
                  </span>
                  <HeatCell
                    value={n.persons}
                    size={20}
                    label={`${n.persons} persons`}
                    className="text-[11px]"
                  />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
