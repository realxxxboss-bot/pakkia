"use client";

import Link from "next/link";
import { useState } from "react";
import { StatCard, SectionTitle } from "@/components/dashboard/primitives";
import { AlertIcon, PlusIcon } from "@/components/dashboard/icons";
import { EntrySheet, type EntryTarget } from "@/components/pitch-holder/EntrySheet";
import {
  events,
  holder,
  monthTotals,
  pitch,
  recentNights,
  today,
} from "../data";

export default function PitchHolderDashboard() {
  const [target, setTarget] = useState<EntryTarget | null>(null);

  return (
    <>
      <header className="mb-7">
        <h1 className="text-[clamp(26px,3.4vw,34px)] leading-[1.05]">
          Hei, {holder.firstName}.
        </h1>
        <p className="mt-1.5 text-[15px] text-secondary">{today.label}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        {/* left: pitch + tonight */}
        <div className="flex flex-col gap-4">
          <div className="relative overflow-hidden rounded-[16px] bg-dark p-7 text-white shadow-dark">
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border-[18px] border-white/[0.05]"
              aria-hidden
            />
            <p className="font-eyebrow text-[10px] font-semibold tracking-[0.12em] text-amber uppercase">
              Your pitch
            </p>
            <p className="nums mt-2.5 font-heading text-[40px] font-semibold leading-none tracking-[-0.02em]">
              {pitch.code}
            </p>
            <p className="mt-2 text-[14px] text-white/70">
              {pitch.area} · {pitch.site}
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-[14px] border border-amber/30 bg-amber/[0.08] px-4 py-3.5">
            <span className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-amber/20 text-amber-ink">
              <AlertIcon size={18} />
            </span>
            <p className="text-[14px] leading-snug text-ink">
              You haven&apos;t logged{" "}
              <span className="font-semibold">tonight</span> yet.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setTarget({
                key: `d-${today.day}`,
                title: `Tonight · ${today.day} June`,
                persons: 0,
              })
            }
            className="group flex w-full items-center justify-center gap-2.5 rounded-[12px] bg-primary px-5 py-4 text-[16px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.99]"
          >
            <PlusIcon size={20} />
            Log tonight&apos;s guests
          </button>

          <div className="grid grid-cols-2 gap-4">
            <StatCard
              label="Person-nights · June"
              value={monthTotals.personNights}
            />
            <StatCard
              label="Nights logged"
              value={monthTotals.nightsLogged}
            />
          </div>
        </div>

        {/* right: what's on + recent */}
        <div className="flex flex-col gap-6">
          <section>
            <SectionTitle title="What's on" />
            <ul className="flex flex-col gap-2.5">
              {events.map((e) => (
                <li
                  key={e.range}
                  className="flex items-center gap-4 rounded-[12px] border border-border bg-surface px-4 py-3.5 shadow-xs"
                >
                  <span className="flex-none border-r border-border pr-4 font-heading text-[13.5px] font-semibold text-primary">
                    {e.range}
                  </span>
                  <span className="text-[14px] font-medium text-ink">
                    {e.name}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <SectionTitle
              title="Last few nights"
              action={
                <Link
                  href="/pitch-holder/calendar"
                  className="text-[13px] font-semibold text-primary transition-colors hover:text-primary-dark"
                >
                  View all
                </Link>
              }
            />
            <ul className="overflow-hidden rounded-[14px] border border-border bg-surface shadow-xs">
              {recentNights.map((n) => (
                <li key={n.day}>
                  <button
                    type="button"
                    onClick={() =>
                      setTarget({
                        key: `d-${n.day}`,
                        title: n.label,
                        persons: n.persons,
                      })
                    }
                    className="flex w-full items-center justify-between border-b border-border px-4 py-3.5 text-left transition-colors duration-150 last:border-0 hover:bg-subtle/60"
                  >
                    <span className="text-[14.5px] font-medium text-ink">
                      {n.label}
                    </span>
                    <span className="nums font-heading text-[16px] font-semibold text-primary">
                      {n.persons}{" "}
                      <span className="font-body text-[12px] font-normal text-muted">
                        persons
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <EntrySheet
        target={target}
        onClose={() => setTarget(null)}
        onSave={() => setTarget(null)}
      />
    </>
  );
}
