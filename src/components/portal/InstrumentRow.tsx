"use client";

/* ------------------------------------------------------------------
   InstrumentRow (PORTAL_SPEC A2 "Stat tiles") — NOT four floating cards.
   One ruled strip (same DNA as the marketing stats strip): 1px --line
   top+bottom, cells separated by 1px --line vertical rules, 2×2 on mobile.
   Values count up on first mount only.
------------------------------------------------------------------ */

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

const SUB_TONE = {
  up: "text-pine-700",
  warn: "text-terracotta",
  flat: "text-ink-muted",
} as const;

/** Count a formatted numeric string up from 0 on first mount. Preserves a
    leading symbol (€) and trailing symbol (%), and thousands separators. */
export function useCountUp(display: string, enabled = true, duration = 600) {
  const match = display.match(/^([^\d-]*)(-?[\d,]+(?:\.\d+)?)(.*)$/);
  const target = match ? Number(match[2].replace(/,/g, "")) : NaN;
  const grouped = Boolean(match && match[2].includes(","));
  // `n` holds the in-flight count-up ONLY. Once the animation is over it goes
  // back to null and the cell renders `target` directly — so a figure that
  // changes later (the holder logs tonight; June's person-nights move) shows
  // the new number instead of freezing at the one we animated to.
  const [n, setN] = useState<number | null>(() =>
    enabled && !Number.isNaN(target) ? 0 : null,
  );
  const done = useRef(false);

  useEffect(() => {
    if (done.current || Number.isNaN(target)) return;
    done.current = true;
    const still =
      !enabled ||
      target === 0 ||
      (typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
    if (still) {
      setN(null);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      if (t < 1) {
        setN(target * eased);
        raf = requestAnimationFrame(tick);
      } else {
        setN(null); // done — hand rendering back to the live value
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, enabled, duration]);

  if (!match || Number.isNaN(target)) return display;
  const rounded = Math.round(n ?? target);
  const body = grouped ? rounded.toLocaleString("en-US") : String(rounded);
  return `${match[1]}${body}${match[3]}`;
}

export type InstrumentCell = {
  label: string;
  value: string;
  /** Small divisor rendered in 1rem ink-muted, e.g. "/ 14". */
  divisor?: string;
  sub?: ReactNode;
  subTone?: keyof typeof SUB_TONE;
  href?: string;
  valueTone?: "ink" | "amber";
  countUp?: boolean;
};

function Cell({ cell }: { cell: InstrumentCell }) {
  const shown = useCountUp(cell.value, cell.countUp ?? true);
  const inner = (
    <>
      <p className="font-spline text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
        {cell.label}
      </p>
      <p className="mt-2.5 flex items-baseline gap-1.5">
        <span
          className={`font-spline text-[1.75rem] font-medium tabular-nums leading-none ${
            cell.valueTone === "amber" ? "text-amber-500" : "text-pine-900"
          }`}
        >
          {shown}
        </span>
        {cell.divisor && (
          <span className="font-spline text-[1rem] tabular-nums text-ink-muted">
            {cell.divisor}
          </span>
        )}
      </p>
      {cell.sub && (
        <p className={`mt-1.5 text-[0.8125rem] ${SUB_TONE[cell.subTone ?? "flat"]}`}>
          {cell.sub}
        </p>
      )}
    </>
  );

  const pad = "px-5 py-6";
  if (cell.href) {
    return (
      <Link
        href={cell.href}
        className={`block ${pad} transition-colors duration-150 hover:bg-paper-deep`}
      >
        {inner}
      </Link>
    );
  }
  return <div className={pad}>{inner}</div>;
}

const COLS: Record<number, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

export function InstrumentRow({ cells }: { cells: InstrumentCell[] }) {
  const cols = COLS[cells.length] ?? "md:grid-cols-4";
  return (
    <div className={`grid grid-cols-2 border-y border-line ${cols}`}>
      {cells.map((cell, i) => {
        // Mobile 2-col wrap rules, reset to a single desktop row.
        const mobileL = i % 2 === 1 ? "border-l border-line" : "";
        const mobileT = i >= 2 ? "border-t border-line" : "";
        const desktop =
          i === 0
            ? "md:border-l-0 md:border-t-0"
            : "md:border-l md:border-l-line md:border-t-0";
        return (
          <div key={cell.label} className={`${mobileL} ${mobileT} ${desktop}`}>
            <Cell cell={cell} />
          </div>
        );
      })}
    </div>
  );
}
