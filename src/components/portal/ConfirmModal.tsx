"use client";

/* ------------------------------------------------------------------
   ConfirmModal (PORTAL_SPEC A2) — the ONLY centered modal in the app,
   reserved for destructive confirms (Block, Suspend, Close season). Small
   centered card, consequence sentence, and for irreversible actions a
   type-to-confirm field. Confirm is terracotta; Cancel is default-focused.
------------------------------------------------------------------ */

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { SplitButton } from "./buttons";

export function ConfirmModal({
  open,
  onClose,
  title,
  consequence,
  confirmLabel,
  onConfirm,
  typeToConfirm,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  consequence: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  /** When set, the confirm button unlocks only once this string is typed. */
  typeToConfirm?: string;
  children?: ReactNode;
}) {
  const [typed, setTyped] = useState("");
  const cancelRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const fieldId = useId();

  useEffect(() => {
    if (!open) {
      setTyped("");
      return;
    }
    restoreRef.current = document.activeElement as HTMLElement;
    const t = setTimeout(() => cancelRef.current?.focus(), 20);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      restoreRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const locked = typeToConfirm ? typed.trim() !== typeToConfirm : false;

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(20,52,43,0.32)]"
      />
      <div className="relative w-full max-w-[420px] rounded-[12px] border border-line bg-paper p-6 shadow-soft">
        <h2 id={titleId} className="font-familjen text-[1.125rem] font-semibold tracking-[-0.02em] text-pine-900">
          {title}
        </h2>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">{consequence}</p>
        {children && <div className="mt-4">{children}</div>}

        {typeToConfirm && (
          <div className="mt-5 flex flex-col gap-2">
            <label htmlFor={fieldId} className="font-spline text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
              Type “{typeToConfirm}” to continue
            </label>
            <input
              id={fieldId}
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoComplete="off"
              className="w-full border-b border-line bg-transparent pb-1.5 font-spline text-[0.9375rem] text-ink-900 outline-none transition-[border-color] focus:border-b-2 focus:border-pine-700"
            />
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            className="text-[0.9375rem] font-medium text-ink-900 underline decoration-line decoration-1 underline-offset-[6px] transition-colors hover:text-pine-700 hover:decoration-amber-500"
          >
            Cancel
          </button>
          <SplitButton
            variant="danger"
            size="compact"
            label={confirmLabel}
            disabled={locked}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}
