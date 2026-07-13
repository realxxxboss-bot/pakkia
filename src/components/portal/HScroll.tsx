"use client";

/* ------------------------------------------------------------------
   HScroll (PORTAL_SPEC A2 "Tables": "Overflow-x auto on small screens with
   a right-edge fade hint") — the one horizontal scroller, shared by the
   Ledger and the nightly HeatGrid.

   Three things it gets right that a bare `overflow-x-auto` does not:

   1. `min-w-0`. A grid/flex child defaults to `min-width: auto`, so it
      refuses to shrink below its content and the overflow container never
      engages — the wide table just pushes the whole page sideways instead.
   2. The fade. A --paper gradient on the right edge, shown ONLY while there
      is more table to scroll to, so a phone never silently hides a column.
   3. `overscroll-x-contain`, so swiping the table to its end doesn't hand
      the gesture to the browser's back-navigation.
------------------------------------------------------------------ */

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export function HScroll({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState(false);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setMore(el.scrollWidth - el.clientWidth - el.scrollLeft > 1);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    // The table itself changes width when rows/columns/filters change.
    for (const child of Array.from(el.children)) ro.observe(child);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <div className={`relative min-w-0 ${className}`}>
      <div ref={ref} onScroll={measure} className="overflow-x-auto overscroll-x-contain">
        {children}
      </div>
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-paper to-transparent transition-opacity duration-200 ease-[var(--ease-out)] motion-reduce:transition-none ${
          more ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
