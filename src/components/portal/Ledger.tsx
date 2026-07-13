"use client";

/* ------------------------------------------------------------------
   Ledger (PORTAL_SPEC A2 "Tables") — the core component; every portal
   screen has one. A real <table> with <th scope> (Part C.8), framed like
   a printed ledger: 1px --line border, radius 12px, --paper background,
   mono uppercase header on --paper-deep, sortable headers, row "⋯" menus,
   footer "Showing X of Y" + pagination, empty + skeleton states.
------------------------------------------------------------------ */

import type { ReactNode } from "react";
import { UnderlineLink } from "./buttons";
import { HScroll } from "./HScroll";

export type SortDir = "asc" | "desc";

export type LedgerColumn<T> = {
  key: string;
  header: ReactNode;
  align?: "left" | "right";
  /** Mono, tabular-nums, right-aligned. */
  numeric?: boolean;
  sortable?: boolean;
  width?: string;
  headClassName?: string;
  cellClassName?: string;
  render: (row: T) => ReactNode;
};

export function Ledger<T>({
  columns,
  rows,
  getKey,
  caption,
  onRowClick,
  sort,
  onSort,
  loading = false,
  skeletonRows = 6,
  empty,
  footer,
  totalRow,
  bare = false,
  className = "",
}: {
  columns: LedgerColumn<T>[];
  rows: T[];
  getKey: (row: T) => string;
  caption: string;
  onRowClick?: (row: T) => void;
  sort?: { key: string; dir: SortDir };
  onSort?: (key: string) => void;
  loading?: boolean;
  skeletonRows?: number;
  empty?: {
    icon: ReactNode;
    title: string;
    guidance?: string;
    action?: ReactNode;
  };
  footer?: ReactNode;
  /** A summed Total row: --paper-deep fill, 2px --pine-700 top rule, weight
      500 values. One cell per column (report previews, area summaries). */
  totalRow?: ReactNode[];
  /** Drop the ledger's own border/radius — for when it already sits inside a
      LedgerFrame (e.g. the report preview document). */
  bare?: boolean;
  className?: string;
}) {
  const showEmpty = !loading && rows.length === 0;

  return (
    <div
      className={`min-w-0 ${
        bare ? "bg-paper" : "overflow-hidden rounded-[12px] border border-line bg-paper"
      } ${className}`}
    >
      <HScroll>
        <table className="w-full border-collapse text-[0.9375rem]">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-line bg-paper-deep">
              {columns.map((c) => {
                const active = sort?.key === c.key;
                const glyph = !c.sortable
                  ? null
                  : active
                    ? sort!.dir === "asc"
                      ? "↑"
                      : "↓"
                    : "↕";
                return (
                  <th
                    key={c.key}
                    scope="col"
                    className={`px-5 py-3 font-spline text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted ${
                      c.numeric || c.align === "right" ? "text-right" : "text-left"
                    } ${c.width ?? ""} ${c.headClassName ?? ""}`}
                  >
                    {c.sortable ? (
                      <button
                        type="button"
                        onClick={() => onSort?.(c.key)}
                        className={`tap-target group inline-flex items-center gap-1.5 uppercase tracking-[0.1em] transition-colors hover:text-ink-900 ${
                          c.numeric || c.align === "right" ? "flex-row-reverse" : ""
                        } ${active ? "text-pine-700" : ""}`}
                      >
                        {c.header}
                        <span
                          aria-hidden
                          className={`font-spline ${active ? "text-pine-700" : "text-ink-muted opacity-0 transition-opacity group-hover:opacity-100"}`}
                        >
                          {glyph}
                        </span>
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={`sk-${i}`} className="border-b border-line last:border-0">
                  {columns.map((c) => (
                    <td key={c.key} className="px-5 py-3.5">
                      <span className="block h-3.5 w-[70%] animate-pulse rounded-[3px] bg-paper-deep" />
                    </td>
                  ))}
                </tr>
              ))}

            {!loading &&
              rows.map((row) => {
                const clickable = Boolean(onRowClick);
                return (
                  <tr
                    key={getKey(row)}
                    {...(clickable
                      ? {
                          onClick: () => onRowClick!(row),
                          tabIndex: 0,
                          onKeyDown: (e: React.KeyboardEvent) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onRowClick!(row);
                            }
                          },
                        }
                      : {})}
                    className={`group border-b border-line transition-colors duration-150 last:border-0 hover:bg-paper-deep focus-visible:bg-paper-deep focus-visible:outline-none ${
                      clickable ? "cursor-pointer" : ""
                    }`}
                  >
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        className={`px-5 py-3.5 align-middle ${
                          c.numeric
                            ? "font-spline tabular-nums text-right text-ink-900"
                            : c.align === "right"
                              ? "text-right"
                              : "text-left"
                        } ${c.cellClassName ?? ""}`}
                      >
                        {c.render(row)}
                      </td>
                    ))}
                  </tr>
                );
              })}
          </tbody>

          {totalRow && !loading && rows.length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-pine-700 bg-paper-deep">
                {columns.map((c, i) => (
                  <td
                    key={c.key}
                    className={`px-5 py-3 font-medium text-ink-900 ${
                      c.numeric
                        ? "font-spline text-right tabular-nums"
                        : c.align === "right"
                          ? "text-right"
                          : "text-left"
                    }`}
                  >
                    {totalRow[i]}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </HScroll>

      {showEmpty && empty && (
        <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
          <span className="text-ink-muted" aria-hidden>{empty.icon}</span>
          <p className="text-[0.9375rem] text-ink-900">{empty.title}</p>
          {empty.guidance && (
            <p className="max-w-[34ch] text-[0.875rem] text-ink-muted">{empty.guidance}</p>
          )}
          {empty.action && <div className="mt-1">{empty.action}</div>}
        </div>
      )}

      {footer && (
        <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-3">
          {footer}
        </div>
      )}
    </div>
  );
}

/* ---------------- Ledger helpers ---------------- */

/* Entity cell — 28px square initials avatar (radius 6px, pine-100 bg) +
   name + secondary line (email/subdomain). The house-style square avatar. */
export function EntityCell({
  initials,
  name,
  secondary,
  avatarTone = "pine",
  trailing,
}: {
  initials: string;
  name: ReactNode;
  secondary?: ReactNode;
  avatarTone?: "pine" | "system";
  trailing?: ReactNode;
}) {
  return (
    <span className="flex items-center gap-3">
      <span
        className={`grid size-7 flex-none place-items-center rounded-[6px] font-spline text-[11px] ${
          avatarTone === "system"
            ? "bg-paper-deep text-ink-muted"
            : "bg-pine-100 text-pine-900"
        }`}
        aria-hidden
      >
        {initials}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2 truncate text-[0.9375rem] font-medium text-ink-900 transition-colors group-hover:text-pine-700">
          {name}
          {trailing}
        </span>
        {secondary && (
          <span className="block truncate font-spline text-[12px] text-ink-muted">
            {secondary}
          </span>
        )}
      </span>
    </span>
  );
}

/* Footer building blocks. */
export function LedgerCount({ shown, total, unit }: { shown: number; total: number; unit: string }) {
  return (
    <span className="font-spline text-[12px] text-ink-muted">
      Showing {shown} of {total} {unit}
    </span>
  );
}

export function LedgerPagination({
  page,
  pageCount,
  onPage,
}: {
  page: number;
  pageCount: number;
  onPage: (p: number) => void;
}) {
  const btn =
    "tap-target grid size-7 place-items-center rounded-[6px] border border-line font-spline text-[13px] text-ink-muted transition-colors hover:bg-paper-deep hover:text-ink-900 disabled:opacity-40 disabled:hover:bg-transparent";
  return (
    <div className="flex items-center gap-1.5">
      <button type="button" className={btn} onClick={() => onPage(page - 1)} disabled={page <= 1} aria-label="Previous page">
        ‹
      </button>
      {Array.from({ length: pageCount }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onPage(i + 1)}
          aria-label={`Page ${i + 1}`}
          aria-current={page === i + 1 ? "page" : undefined}
          className={`tap-target grid size-7 place-items-center rounded-[6px] border font-spline text-[13px] transition-colors ${
            page === i + 1
              ? "border-pine-700 text-pine-700"
              : "border-line text-ink-muted hover:bg-paper-deep hover:text-ink-900"
          }`}
        >
          {i + 1}
        </button>
      ))}
      <button type="button" className={btn} onClick={() => onPage(page + 1)} disabled={page >= pageCount} aria-label="Next page">
        ›
      </button>
    </div>
  );
}

/* A framed block that isn't a table — charts, the report preview, mini
   stat frames. Same ledger DNA (1px --line, radius 12px, --paper) with an
   optional mono header row. */
export function LedgerFrame({
  header,
  children,
  className = "",
  bodyClassName = "",
  shadow = false,
}: {
  header?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  /** The report/export preview frame — one of the three permitted shadows. */
  shadow?: boolean;
}) {
  return (
    <div
      className={`min-w-0 overflow-hidden rounded-[12px] border border-line bg-paper ${
        shadow ? "shadow-soft" : ""
      } ${className}`}
    >
      {header && (
        <div className="flex items-center justify-between gap-3 border-b border-line bg-paper-deep px-5 py-3">
          {header}
        </div>
      )}
      <div className={bodyClassName || "p-5"}>{children}</div>
    </div>
  );
}

/* The reusable "View all / more" underline-link shorthand for footers. */
export function LedgerLink({ href, children }: { href: string; children: ReactNode }) {
  return <UnderlineLink href={href}>{children}</UnderlineLink>;
}
