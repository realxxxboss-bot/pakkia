"use client";

import { useEffect, useId, useRef, useState } from "react";

/* Small accessible popover used for the topbar notifications and user menu.
   Panel stays mounted and toggles via opacity/transform transitions (cheap,
   interruptible) and scales from its trigger corner — origin-aware. */

export function Popover({
  align = "end",
  label,
  trigger,
  panelClassName = "",
  children,
}: {
  align?: "start" | "end";
  label: string;
  trigger: (open: boolean) => React.ReactNode;
  panelClassName?: string;
  children: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
      >
        {trigger(open)}
      </button>
      <div
        id={panelId}
        role="menu"
        aria-label={label}
        className={`absolute top-[calc(100%+8px)] z-50 transition-[opacity,transform] duration-150 ease-[var(--ease-out)] motion-reduce:transition-none ${
          align === "end"
            ? "right-0 origin-top-right"
            : "left-0 origin-top-left"
        } ${
          open
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        } ${panelClassName}`}
      >
        {children(() => setOpen(false))}
      </div>
    </div>
  );
}
