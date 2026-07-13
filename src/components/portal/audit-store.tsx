"use client";

/* ------------------------------------------------------------------
   Audit store (PORTAL_SPEC Part C.5 — "the audit ledger is the product's
   spine; treat any unaudited mutation as a bug"). A client context seeded
   per portal; every mutating action calls log(). The dashboard ticker and
   the audit page both read the same live list, so a mutation anywhere
   surfaces immediately (and flashes on insert). Mock only — no backend.
------------------------------------------------------------------ */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type AuditTone = "record" | "settings" | "danger" | "support" | "info";

export type AuditEvent = {
  id: string;
  time: string;
  actor: string;
  actorInitials: string;
  event: string;
  target?: string;
  targetHref?: string;
  detail?: string;
  tone?: AuditTone;
  /** Inserted this session — drives the realtime insert flash + LIVE feel. */
  fresh?: boolean;
};

type AuditValue = {
  events: AuditEvent[];
  log: (e: Omit<AuditEvent, "id" | "time" | "fresh"> & { time?: string }) => void;
};

const AuditCtx = createContext<AuditValue | null>(null);

export function useAudit() {
  const ctx = useContext(AuditCtx);
  if (!ctx) throw new Error("useAudit must be used within <AuditProvider>.");
  return ctx;
}

export function AuditProvider({
  seed,
  children,
}: {
  seed: AuditEvent[];
  children: ReactNode;
}) {
  const [events, setEvents] = useState<AuditEvent[]>(seed);
  const seq = useRef(0);

  const log = useCallback<AuditValue["log"]>((e) => {
    const id = `live-${++seq.current}`;
    setEvents((prev) => [
      { id, time: e.time ?? "just now", fresh: true, ...e },
      ...prev,
    ]);
  }, []);

  const value = useMemo(() => ({ events, log }), [events, log]);
  return <AuditCtx.Provider value={value}>{children}</AuditCtx.Provider>;
}
