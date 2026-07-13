"use client";

/* ------------------------------------------------------------------
   Holder store — the state behind the 10-second-a-day portal.

   One provider owns the nights, because three screens write to the same
   truth: the dashboard's "Log tonight's guests", the calendar's stepper,
   and the summary's month ledger all read and mutate the same entries.

   It also owns the two things that make this portal honest on a phone in a
   forest (PORTAL_SPEC B4.2):

   - the optimistic save — the sheet closes immediately, the cell flashes an
     amber outline for 800ms while the heat colour updates under it, and the
     month total ticks. The holder never waits on a spinner.
   - the offline queue — if the save happens with no connection, the night is
     written to localStorage, the cell wears a DASHED amber outline, and the
     toast says "saved on this phone", not "saved". On reconnect it flushes
     and the dashed outlines resolve. Claiming a save we haven't made would
     be the one unforgivable bug in a compliance product.

   Every save writes an audit row (Part C.5) — an edit to a past night is
   recorded, and the stepper says so out loud rather than warning about it.
------------------------------------------------------------------ */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useAudit, useToast } from "@/components/portal";
import {
  dateKey,
  dayLabel,
  isToday,
  pitch,
  seedEntries,
  today,
  type Entries,
} from "../data";

const QUEUE_KEY = "pakkia.holder.queue";

export type DayTarget = { month: number; day: number };

type QueuedNight = DayTarget & { persons: number };

type HolderValue = {
  entries: Entries;
  /** Keys saved on this phone but not yet synced — the dashed-outline cells. */
  pending: ReadonlySet<string>;
  /** Keys mid save-flash (800ms). */
  flashing: ReadonlySet<string>;
  /** The month the calendar is showing; the summary ledger writes to it. */
  month: number;
  setMonth: (m: number) => void;
  /** The day whose stepper is open, or null. */
  target: DayTarget | null;
  openStepper: (t: DayTarget) => void;
  closeStepper: () => void;
  /** Ask the calendar to open a day's stepper on arrival (dashboard → calendar). */
  requestDay: (t: DayTarget) => void;
  takeRequestedDay: () => DayTarget | null;
  save: (t: DayTarget, persons: number) => void;
  capacity: number;
};

const HolderCtx = createContext<HolderValue | null>(null);

export function useHolder() {
  const ctx = useContext(HolderCtx);
  if (!ctx) throw new Error("useHolder must be used within <HolderProvider>.");
  return ctx;
}

const DESKTOP_MQ = "(min-width: 1024px)";

/** True once the viewport is desktop-wide — it decides whether the stepper is
    a bottom sheet or the right drawer. The server snapshot is `false`: this
    portal is phone-first, so a phone is what we assume until told otherwise. */
export function useIsDesktop() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(DESKTOP_MQ);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(DESKTOP_MQ).matches,
    () => false,
  );
}

export function HolderProvider({ children }: { children: ReactNode }) {
  const toast = useToast();
  const { log } = useAudit();

  const [entries, setEntries] = useState<Entries>(seedEntries);
  const [pending, setPending] = useState<ReadonlySet<string>>(new Set());
  const [flashing, setFlashing] = useState<ReadonlySet<string>>(new Set());
  const [month, setMonth] = useState(today.month);
  const [target, setTarget] = useState<DayTarget | null>(null);
  const requested = useRef<DayTarget | null>(null);
  const timers = useRef<number[]>([]);

  // Replay anything this phone saved while offline (including from an earlier
  // visit) before the first paint the holder can act on.
  useEffect(() => {
    let queue: QueuedNight[] = [];
    try {
      queue = JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]");
    } catch {
      queue = [];
    }
    if (queue.length === 0) return;
    setEntries((e) => {
      const next = { ...e };
      for (const q of queue) next[dateKey(q.month, q.day)] = q.persons;
      return next;
    });
    setPending(new Set(queue.map((q) => dateKey(q.month, q.day))));
  }, []);

  // Reconnect → flush. The nights were never lost; they just weren't ours yet.
  useEffect(() => {
    const flush = () => {
      setPending((p) => {
        if (p.size === 0) return p;
        try {
          localStorage.removeItem(QUEUE_KEY);
        } catch {}
        toast({ message: `${p.size} night${p.size === 1 ? "" : "s"} synced.`, variant: "success" });
        return new Set();
      });
    };
    window.addEventListener("online", flush);
    return () => window.removeEventListener("online", flush);
  }, [toast]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const save = useCallback(
    ({ month: m, day }: DayTarget, persons: number) => {
      const key = dateKey(m, day);
      const previous = entries[key];
      const offline = typeof navigator !== "undefined" && navigator.onLine === false;

      // Optimistic: the number is on screen before anything else happens.
      setEntries((e) => ({ ...e, [key]: persons }));
      setTarget(null);

      setFlashing((f) => new Set(f).add(key));
      timers.current.push(
        window.setTimeout(() => {
          setFlashing((f) => {
            const next = new Set(f);
            next.delete(key);
            return next;
          });
        }, 800),
      );

      if (offline) {
        setPending((p) => new Set(p).add(key));
        try {
          const queue: QueuedNight[] = JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]");
          const next = queue.filter((q) => dateKey(q.month, q.day) !== key);
          next.push({ month: m, day, persons });
          localStorage.setItem(QUEUE_KEY, JSON.stringify(next));
        } catch {}
        toast({ message: "Saved on this phone — will sync.", variant: "info" });
      } else {
        setPending((p) => {
          if (!p.has(key)) return p;
          const next = new Set(p);
          next.delete(key);
          return next;
        });
        toast({
          message: isToday(m, day)
            ? `Tonight · ${persons} person${persons === 1 ? "" : "s"} logged.`
            : `${dayLabel(m, day)} · ${persons} person${persons === 1 ? "" : "s"} logged.`,
          variant: "success",
        });
      }

      // Nothing is silently editable — an overwrite is recorded as a diff.
      const edited = previous !== undefined && previous !== persons;
      log({
        actor: "Aino Korhonen",
        actorInitials: "AK",
        event: edited ? "Edited night record" : "Logged night",
        target: `${pitch.code} · ${dayLabel(m, day)}`,
        detail: edited ? `${previous} → ${persons}` : `${persons} persons`,
        tone: "record",
      });
    },
    [entries, log, toast],
  );

  const value = useMemo<HolderValue>(
    () => ({
      entries,
      pending,
      flashing,
      month,
      setMonth,
      target,
      openStepper: (t) => setTarget(t),
      closeStepper: () => setTarget(null),
      requestDay: (t) => {
        requested.current = t;
        setMonth(t.month);
      },
      takeRequestedDay: () => {
        const t = requested.current;
        requested.current = null;
        return t;
      },
      save,
      capacity: pitch.capacity,
    }),
    [entries, pending, flashing, month, target, save],
  );

  return <HolderCtx.Provider value={value}>{children}</HolderCtx.Provider>;
}

/* A number that counts from its previous value to its next one over 400ms —
   the month total "ticking up" as a night lands (B4.2). Instant for anyone
   who asked for less motion, and instant on first mount (no count-up on a
   page the holder has merely opened). */
export function TickNumber({ value, className = "" }: { value: number; className?: string }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  const raf = useRef(0);

  useEffect(() => {
    const start = from.current;
    if (start === value) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      from.current = value;
      setShown(value);
      return;
    }
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / 400);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(start + (value - start) * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value]);

  return (
    <span className={`font-spline tabular-nums ${className}`}>
      {shown.toLocaleString("en-US")}
    </span>
  );
}
