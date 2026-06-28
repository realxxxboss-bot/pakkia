"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CloseIcon, ExternalLinkIcon } from "@/components/dashboard/icons";
import { Badge } from "@/components/dashboard/primitives";
import {
  planTone,
  statusTone,
  type Tenant,
} from "@/app/super-admin/data";

/* Right-anchored detail drawer for a single campsite tenant. Mirrors the
   pitch-holder EntrySheet / power-user Sheet pattern: stays mounted, animates
   via transform/opacity, retains the last tenant so content survives the close
   animation, traps Escape and locks body scroll while open. */

function useRetained<T>(value: T | null): T | null {
  const [retained, setRetained] = useState(value);
  const [prev, setPrev] = useState(value);
  if (value !== prev) {
    setPrev(value);
    if (value !== null) setRetained(value);
  }
  return retained;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[12px] border border-border bg-subtle/60 px-4 py-3.5">
      <p className="font-eyebrow text-[9.5px] font-semibold tracking-[0.1em] text-muted uppercase">
        {label}
      </p>
      <p className="nums mt-1 font-mono text-[22px] font-semibold tracking-[-0.02em] text-primary">
        {value}
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 text-[14px] last:border-0">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}

function Section({ title }: { title: string }) {
  return (
    <p className="mb-1.5 mt-6 font-eyebrow text-[10px] font-semibold tracking-[0.12em] text-secondary uppercase first:mt-0">
      {title}
    </p>
  );
}

export function TenantDrawer({
  tenant,
  onClose,
}: {
  tenant: Tenant | null;
  onClose: () => void;
}) {
  const open = tenant !== null;
  const t = useRetained(tenant);
  const panelRef = useRef<HTMLDivElement>(null);
  const headingId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[80] ${open ? "" : "pointer-events-none"}`}
    >
      <div
        onClick={onClose}
        aria-hidden
        className={`absolute inset-0 bg-dark/50 backdrop-blur-[2px] transition-opacity duration-200 ease-[var(--ease-out)] motion-reduce:transition-none ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className={`absolute inset-y-0 right-0 flex w-[440px] max-w-[92vw] flex-col bg-surface shadow-lg outline-none transition-transform duration-300 ease-[var(--ease-out)] motion-reduce:transition-none ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {t && (
          <>
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
              <div className="min-w-0">
                <h2 id={headingId} className="truncate text-[21px]">
                  {t.name}
                </h2>
                <p className="mt-0.5 truncate text-[13px] text-muted">
                  {t.slug}.pakkia.fi
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  <Badge tone={planTone(t.plan)}>{t.plan}</Badge>
                  <Badge tone={statusTone(t.status)} dot>
                    {t.status}
                  </Badge>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid h-9 w-9 flex-none place-items-center rounded-[10px] text-muted ring-1 ring-border transition-colors duration-150 hover:bg-subtle hover:text-ink"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Pitches" value={t.pitches} />
                <Stat label="Users" value={t.users} />
                <Stat label="Nights MTD" value={t.nightsMTD} />
                <Stat label="MRR" value={t.mrr} />
              </div>

              <Section title="Account admin" />
              <Row label="Name" value={t.admin} />
              <Row label="Email" value={t.email} />

              <Section title="Subscription" />
              <Row
                label="Plan"
                value={`${t.plan}${
                  t.mrr !== "€0" ? ` · ${t.mrr}/mo` : " · free"
                }`}
              />
              <Row label="Status" value={t.status} />
              <Row label="Joined" value={t.joined} />
              <Row label="Next invoice" value={t.nextInvoice} />
            </div>

            <div className="flex flex-col gap-2.5 border-t border-border px-6 py-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-[10px] bg-amber px-5 py-3 text-[14.5px] font-semibold text-dark shadow-sm transition-[transform,background-color] duration-150 ease-[var(--ease-out)] hover:bg-amber/90 active:scale-[0.99]"
              >
                <ExternalLinkIcon size={17} />
                Log in as admin
              </button>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  className="flex-1 rounded-[10px] px-5 py-2.5 text-[14px] font-semibold text-secondary ring-1 ring-border transition-colors duration-150 hover:bg-subtle hover:text-ink"
                >
                  Change plan
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-[10px] px-5 py-2.5 text-[14px] font-semibold text-error ring-1 ring-border transition-colors duration-150 hover:bg-error hover:text-white"
                >
                  Suspend
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
