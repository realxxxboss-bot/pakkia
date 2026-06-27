/* Reusable dashboard primitives, rendered in the Pakkia fintech system.
   Presentational and portal-agnostic so Power User / Admin / Super Admin
   can reuse them. Restrained borders, subtle elevation, tabular numerals. */

import type { ReactNode } from "react";

/* ---------- Card ---------- */

export function Card({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}) {
  return (
    <Tag
      className={`rounded-[14px] border border-border bg-surface shadow-xs ${className}`}
    >
      {children}
    </Tag>
  );
}

/* ---------- PageHeader ---------- */

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-2 font-eyebrow text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="text-[clamp(24px,3vw,30px)] leading-[1.1]">{title}</h1>
        {subtitle && (
          <p className="mt-2 max-w-[60ch] text-[15px] leading-[1.5] text-secondary">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-none items-center gap-2.5">{actions}</div>}
    </div>
  );
}

/* ---------- Badge ---------- */

type BadgeTone = "neutral" | "primary" | "amber" | "success" | "dark";

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: "bg-subtle text-secondary",
  primary: "bg-primary-tint text-primary-dark",
  amber: "bg-amber/15 text-amber-ink",
  success: "bg-occ-1 text-primary-dark",
  dark: "bg-dark text-white",
};

export function Badge({
  children,
  tone = "neutral",
  dot = false,
  className = "",
}: {
  children: ReactNode;
  tone?: BadgeTone;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${BADGE_TONES[tone]} ${className}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

/* ---------- StatCard ---------- */

export function StatCard({
  label,
  value,
  unit,
  hint,
  icon,
  emphasis = false,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  hint?: ReactNode;
  icon?: ReactNode;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`rounded-[14px] border p-5 transition-colors duration-150 ${
        emphasis
          ? "border-transparent bg-dark text-white shadow-dark"
          : "border-border bg-surface shadow-xs"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className={`font-eyebrow text-[10px] font-semibold tracking-[0.1em] uppercase ${
            emphasis ? "text-amber" : "text-muted"
          }`}
        >
          {label}
        </p>
        {icon && (
          <span className={emphasis ? "text-white/70" : "text-muted"}>
            {icon}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span
          className={`nums font-mono text-[30px] font-semibold tracking-[-0.02em] ${
            emphasis ? "text-white" : "text-primary"
          }`}
        >
          {value}
        </span>
        {unit && (
          <span
            className={`text-[14px] font-medium ${
              emphasis ? "text-white/60" : "text-muted"
            }`}
          >
            {unit}
          </span>
        )}
      </div>
      {hint && (
        <p
          className={`mt-2 text-[13px] leading-snug ${
            emphasis ? "text-white/65" : "text-secondary"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

/* ---------- DataTable ---------- */

export type Column<T> = {
  key: string;
  header: ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
  render: (row: T) => ReactNode;
};

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  caption,
  empty,
}: {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T, index: number) => string;
  caption?: string;
  empty?: ReactNode;
}) {
  if (rows.length === 0 && empty) {
    return <Card className="p-2">{empty}</Card>;
  }

  const alignClass = (a?: Column<T>["align"]) =>
    a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left";

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[14.5px]">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr className="border-b border-border">
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={`px-5 py-3.5 font-eyebrow text-[10.5px] font-semibold tracking-[0.08em] text-muted uppercase ${alignClass(
                    c.align,
                  )}`}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={getRowKey(row, i)}
                className="border-b border-border last:border-0 transition-colors duration-150 hover:bg-subtle/60"
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`px-5 py-3.5 text-ink ${alignClass(c.align)} ${
                      c.className ?? ""
                    }`}
                  >
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ---------- EmptyState ---------- */

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
      {icon && (
        <span className="grid h-12 w-12 place-items-center rounded-[12px] bg-subtle text-muted">
          {icon}
        </span>
      )}
      <div>
        <h3 className="text-[17px]">{title}</h3>
        {description && (
          <p className="mx-auto mt-1.5 max-w-[42ch] text-[14px] leading-[1.5] text-secondary">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

/* ---------- SectionTitle ---------- */

export function SectionTitle({
  title,
  action,
  className = "",
}: {
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-3.5 flex items-center justify-between gap-3 ${className}`}>
      <h2 className="text-[16px] font-semibold">{title}</h2>
      {action}
    </div>
  );
}
