"use client";

/* ------------------------------------------------------------------
   Toasts (PORTAL_SPEC A2) — bottom-right (bottom-center on mobile),
   --pine-900 background, --cream text, mono for values, 7px status square,
   auto-dismiss 4s, optional "Undo" underline-link.
------------------------------------------------------------------ */

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastVariant = "info" | "success" | "danger";

type ToastInput = {
  message: ReactNode;
  variant?: ToastVariant;
  /** Shorthand for the common Undo affordance. */
  onUndo?: () => void;
  /** Any other trailing underline-link action (e.g. "Copy invite link"). */
  action?: { label: string; onClick: () => void };
};

type ToastRecord = ToastInput & { id: number };

const SQUARE: Record<ToastVariant, string> = {
  info: "bg-amber-500",
  success: "bg-pine-100",
  danger: "bg-terracotta",
};

const ToastCtx = createContext<(t: ToastInput) => void>(() => {});

export function useToast() {
  return useContext(ToastCtx);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const seq = useRef(0);

  const remove = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (input: ToastInput) => {
      const id = ++seq.current;
      setToasts((t) => [...t, { ...input, id }]);
      setTimeout(() => remove(id), 4000);
    },
    [remove],
  );

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-6 sm:items-end">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex max-w-[92vw] items-center gap-3 rounded-[8px] bg-pine-900 px-4 py-3 text-[0.875rem] text-cream shadow-soft sm:max-w-[380px]"
          >
            <span className={`size-[7px] flex-none ${SQUARE[t.variant ?? "info"]}`} aria-hidden />
            <span className="flex-1">{t.message}</span>
            {(t.onUndo || t.action) && (
              <button
                type="button"
                onClick={() => {
                  if (t.action) t.action.onClick();
                  else t.onUndo?.();
                  remove(t.id);
                }}
                className="flex-none text-cream underline decoration-line-dark decoration-1 underline-offset-[4px] transition-colors hover:decoration-amber-500"
              >
                {t.action ? t.action.label : "Undo"}
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
