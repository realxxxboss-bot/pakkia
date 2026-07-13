"use client";

/* ContentHeader (PORTAL_SPEC A1) — every page starts here: H1 + one-line
   description + optional ONE compact split-arrow action (+ secondary
   underline-links), then the signature 1px --line rule (mb-8). Registers
   the page title with the shell and reports when it scrolls out of view so
   the topbar can swap the breadcrumb for the compact title. */

import { useEffect, useRef, type ReactNode } from "react";
import { useShell } from "./shell-context";

export function ContentHeader({
  title,
  description,
  eyebrow,
  action,
  secondary,
}: {
  title: string;
  description?: ReactNode;
  /** Optional mono line above the H1 (e.g. "TUESDAY · 19 JUNE 2026"). */
  eyebrow?: ReactNode;
  action?: ReactNode;
  secondary?: ReactNode;
}) {
  const { setPageTitle, setPastHeader } = useShell();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPageTitle(title);
    setPastHeader(false);
    return () => setPastHeader(false);
  }, [title, setPageTitle, setPastHeader]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setPastHeader(!entry.isIntersecting && entry.boundingClientRect.top <= 60);
      },
      { rootMargin: "-60px 0px 0px 0px", threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [setPastHeader]);

  return (
    <header>
      {eyebrow && (
        <p className="mb-2 font-spline text-[12px] uppercase tracking-[0.14em] text-ink-muted">
          {eyebrow}
        </p>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-familjen text-[clamp(1.5rem,2.5vw,2rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-pine-900">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-muted">
              {description}
            </p>
          )}
        </div>
        {(action || secondary) && (
          <div className="flex flex-none flex-wrap items-center gap-x-5 gap-y-2 sm:justify-end">
            {secondary}
            {action}
          </div>
        )}
      </div>
      <div className="mb-8 mt-5 h-px bg-line" />
      <div ref={sentinelRef} aria-hidden className="h-px w-px" />
    </header>
  );
}
