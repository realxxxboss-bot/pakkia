"use client";

/* ------------------------------------------------------------------
   Drawer (PORTAL_SPEC A2 "Drawers & modals") — the right-side form drawer
   (Add campsite, Appoint administrator, Notifications…). 440px, --paper,
   1px --line left border, 300ms slide, scrim (click / Esc close), pinned
   footer. Traps focus and restores it on close (Part C.8). A bottom-sheet
   variant (radius 16px top) is used by the holder stepper on mobile.
------------------------------------------------------------------ */

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";

export function Drawer({
  open,
  onClose,
  title,
  description,
  footer,
  side = "right",
  width = 440,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  footer?: ReactNode;
  side?: "right" | "bottom";
  width?: number;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (open) {
      restoreRef.current = document.activeElement as HTMLElement;
      setMounted(true);
      const raf = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(raf);
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), 300);
    return () => clearTimeout(t);
  }, [open]);

  // Lock body scroll + focus first control + restore on close.
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  useEffect(() => {
    if (!shown) return;
    const el = panelRef.current;
    if (!el) return;
    const focusable = el.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable?.focus();
    return () => {
      restoreRef.current?.focus?.();
    };
  }, [shown]);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const el = panelRef.current;
      if (!el) return;
      const items = Array.from(
        el.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((n) => n.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mounted, onClose]);

  if (!mounted) return null;

  const isBottom = side === "bottom";
  const panelPos = isBottom
    ? `inset-x-0 bottom-0 rounded-t-[16px] border-t ${shown ? "translate-y-0" : "translate-y-full"}`
    : `inset-y-0 right-0 border-l ${shown ? "translate-x-0" : "translate-x-full"}`;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div
        aria-hidden
        onClick={onClose}
        className={`absolute inset-0 bg-[rgba(20,52,43,0.32)] transition-opacity duration-300 ease-[var(--ease-out)] motion-reduce:transition-none ${
          shown ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        ref={panelRef}
        style={isBottom ? undefined : { width: `min(${width}px, 100vw)` }}
        className={`absolute flex max-h-full flex-col border-line bg-paper shadow-soft transition-transform duration-300 ease-[var(--ease-out)] motion-reduce:transition-none ${panelPos}`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="font-familjen text-[1.125rem] font-semibold tracking-[-0.02em] text-pine-900">
              {title}
            </h2>
            {description && (
              <p className="mt-0.5 text-[0.875rem] text-ink-muted">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-8 flex-none place-items-center rounded-[6px] border border-line text-ink-muted transition-colors hover:bg-paper-deep hover:text-ink-900"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>

        {footer && (
          <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
