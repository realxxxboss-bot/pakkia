"use client";

/* PITCH HOLDER — Calendar (PORTAL_SPEC B4.2). The product's core screen.

   A month of nights at a glance: the heat scale says how full, the hatch says
   what's missing, the amber outline says which night is tonight. Tapping any
   editable day opens the shared stepper (a bottom sheet on phones, the right
   drawer on desktop). Future days are visible but inert — you cannot log a
   night that hasn't happened. */

import { useEffect } from "react";
import {
  ContentHeader,
  HeatLegend,
  MonthCalendar,
  SplitButton,
  type CalendarDay,
} from "@/components/portal";
import { TickNumber, useHolder } from "../_components/holder-store";
import {
  DOW,
  dateKey,
  daysInMonth,
  eventOn,
  isFuture,
  isToday,
  monthLabel,
  monthName,
  monthTotals,
  pitch,
  season,
  startOffset,
  today,
} from "../data";

export default function PitchHolderCalendar() {
  const {
    entries,
    pending,
    flashing,
    month,
    setMonth,
    openStepper,
    takeRequestedDay,
  } = useHolder();

  // Arriving from a "last few nights" row: open that night's stepper here, in
  // the calendar, where the correction lands in context.
  useEffect(() => {
    const requested = takeRequestedDay();
    if (requested) openStepper(requested);
    // Mount only — a later render must not re-open a sheet the holder closed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totals = monthTotals(entries, month);
  const tonightLogged = entries[dateKey(today.month, today.day)] !== undefined;

  const days: CalendarDay[] = Array.from({ length: daysInMonth(month) }, (_, i) => {
    const day = i + 1;
    const key = dateKey(month, day);
    const value = entries[key];
    const logged = value !== undefined;
    const future = isFuture(month, day);
    const tonight = isToday(month, day);
    return {
      day,
      value: logged ? value : null,
      event: Boolean(eventOn(month, day)),
      // Past, in season, and still blank — the state this whole product exists
      // to make impossible to miss.
      unlogged: !logged && !future && !tonight,
      future,
      // Tonight is marked by the amber outline alone; say it out loud too.
      note: tonight && !logged ? "not logged yet" : undefined,
      flash: flashing.has(key),
      pending: pending.has(key),
    };
  });

  return (
    <>
      <ContentHeader
        title="Calendar"
        description={`Your pitch ${pitch.code}. Tap any day to enter or edit the number of persons who stayed.`}
      />

      <MonthCalendar
        monthLabel={monthLabel(month)}
        monthName={monthName(month)}
        days={days}
        startOffset={startOffset(month)}
        dow={DOW}
        today={month === today.month ? today.day : undefined}
        onDayClick={(d) => openStepper({ month, day: d.day })}
        onPrevMonth={month > season.startMonth ? () => setMonth(month - 1) : undefined}
        onNextMonth={month < season.endMonth ? () => setMonth(month + 1) : undefined}
        // Phone-first: the grid bleeds to the screen edges below 640px so the
        // touch cells clear 44px even on a 375px phone. On desktop it's a
        // normal ledger-framed card.
        className="-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-[12px] sm:border-x"
        bodyClassName="p-2 sm:p-5"
        gapClassName="gap-1 sm:gap-1.5"
        cellClassName="aspect-square w-full min-h-[44px] text-[0.9375rem]"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-spline text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
                Person-nights · {monthName(month).split(" ")[0]}
              </p>
              <TickNumber
                value={totals.personNights}
                className="mt-1.5 block text-[1.5rem] font-medium leading-none text-pine-900"
              />
            </div>
            <SplitButton
              size="compact"
              label={tonightLogged ? "Edit tonight" : "Log tonight"}
              onClick={() => {
                setMonth(today.month);
                openStepper({ month: today.month, day: today.day });
              }}
            />
          </div>
        }
      />

      <div className="mt-5 flex flex-col gap-3">
        <HeatLegend />
        <p className="font-spline text-[11px] uppercase tracking-[0.1em] text-ink-muted">
          {season.note}
        </p>
      </div>
    </>
  );
}
