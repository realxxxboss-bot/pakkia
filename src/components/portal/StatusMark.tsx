/* ------------------------------------------------------------------
   StatusMark — replaces ALL status pills across the portals
   (PORTAL_SPEC A2 "Status marks"). A 7px solid square (the printer's-mark
   motif) + a mono 12px label. Status is conveyed by shape + text, never
   color alone (Part C.8 accessibility).
------------------------------------------------------------------ */

export type StatusVariant =
  | "active" // pine square
  | "trial" // amber square
  | "pending" // outline square (invited / unassigned / internal)
  | "anomaly" // AMBER OUTLINE square — the actionable oddity (unassigned but
  //             active pitch, past night still unlogged). Loud but not an error.
  | "danger" // terracotta square (suspended / blocked / overdue / failed)
  | "inactive" // line square (archived / off)
  | "info" // pine square, informational
  | "live"; // amber square, pulsing

const SQUARE: Record<StatusVariant, string> = {
  active: "bg-pine-700",
  info: "bg-pine-700",
  trial: "bg-amber-500",
  pending: "border border-ink-muted bg-transparent",
  anomaly: "border border-amber-500 bg-transparent",
  danger: "bg-terracotta",
  inactive: "bg-line",
  live: "bg-amber-500 live-pulse",
};

const LABEL: Record<StatusVariant, string> = {
  active: "text-ink-900",
  info: "text-ink-900",
  trial: "text-ink-900",
  pending: "text-ink-muted",
  anomaly: "text-ink-muted",
  danger: "text-terracotta",
  inactive: "text-ink-muted",
  live: "text-ink-900",
};

export function StatusMark({
  variant,
  label,
  className = "",
}: {
  variant: StatusVariant;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-spline text-[12px] tracking-[0.01em] ${LABEL[variant]} ${className}`}
    >
      <span
        className={`size-[7px] flex-none ${SQUARE[variant]}`}
        aria-hidden
      />
      {label}
    </span>
  );
}

/* Just the square — for use inside a heat/entity cell where the label sits
   elsewhere (e.g. the unassigned-pitch anomaly marker). */
export function StatusSquare({
  variant,
  className = "",
}: {
  variant: StatusVariant;
  className?: string;
}) {
  return (
    <span className={`inline-block size-[7px] flex-none ${SQUARE[variant]} ${className}`} aria-hidden />
  );
}

/* 2FA indicator — On = pine square, Off = outline square (nudged to
   terracotta so "2FA Off" reads as an action item, per B1.3). */
export function TwoFactorMark({ on }: { on: boolean }) {
  return on ? (
    <StatusMark variant="active" label="On" />
  ) : (
    <span className="inline-flex items-center gap-2 font-spline text-[12px] text-terracotta">
      <span className="size-[7px] flex-none border border-terracotta bg-transparent" aria-hidden />
      Off
    </span>
  );
}
