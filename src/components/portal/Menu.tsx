"use client";

/* ------------------------------------------------------------------
   Menu (PORTAL_SPEC A5) — the one dropdown used by row "⋯" actions, the
   sidebar user menu, and select filters. Paper background, 1px --line
   border, radius 8px, --shadow-soft. Destructive items in terracotta
   below a rule. Closes on outside click + Esc; restores focus to trigger.
------------------------------------------------------------------ */

import Link from "next/link";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const MenuCtx = createContext<{ close: () => void }>({ close: () => {} });

export function Menu({
  trigger,
  children,
  align = "end",
  side = "bottom",
  width,
  label = "Menu",
}: {
  trigger: (o: { open: boolean; toggle: () => void }) => ReactNode;
  children: ReactNode;
  align?: "start" | "end";
  side?: "bottom" | "top";
  width?: number;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative inline-flex">
      {trigger({ open, toggle: () => setOpen((o) => !o) })}
      {open && (
        <div
          role="menu"
          aria-label={label}
          style={width ? { width } : undefined}
          className={`absolute z-50 min-w-[184px] overflow-hidden rounded-[8px] border border-line bg-paper py-1 shadow-soft ${
            side === "bottom" ? "top-full mt-2" : "bottom-full mb-2"
          } ${align === "end" ? "right-0" : "left-0"}`}
        >
          <MenuCtx.Provider value={{ close: () => setOpen(false) }}>
            {children}
          </MenuCtx.Provider>
        </div>
      )}
    </div>
  );
}

type MenuItemProps = {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  destructive?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
};

export function MenuItem({
  children,
  onClick,
  href,
  destructive,
  icon,
  disabled,
}: MenuItemProps) {
  const { close } = useContext(MenuCtx);
  const cls = `flex w-full items-center gap-2.5 px-3 py-2 text-left text-[0.875rem] transition-colors duration-150 hover:bg-paper-deep disabled:pointer-events-none disabled:opacity-50 ${
    destructive ? "text-terracotta" : "text-ink-900"
  }`;
  const inner = (
    <>
      {icon && <span className="flex-none text-ink-muted" aria-hidden>{icon}</span>}
      <span className="flex-1">{children}</span>
    </>
  );
  if (href) {
    return (
      <Link href={href} role="menuitem" className={cls} onClick={close}>
        {inner}
      </Link>
    );
  }
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      className={cls}
      onClick={() => {
        onClick?.();
        close();
      }}
    >
      {inner}
    </button>
  );
}

/* A non-interactive meta row (e.g. the email under the user's name). */
export function MenuMeta({ children }: { children: ReactNode }) {
  return (
    <div className="px-3 py-1.5 font-spline text-[12px] text-ink-muted">{children}</div>
  );
}

export function MenuRule() {
  return <div className="my-1 h-px bg-line" aria-hidden />;
}

/* The square "⋯" row-action trigger button (28px, 1px --line, radius 6px). */
export function RowMenuButton({
  open,
  toggle,
  label = "Row actions",
}: {
  open: boolean;
  toggle: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
      className={`grid size-7 place-items-center rounded-[6px] border border-line font-spline text-[15px] leading-none text-ink-muted transition-colors duration-150 hover:bg-paper-deep hover:text-ink-900 ${
        open ? "bg-paper-deep text-ink-900" : ""
      }`}
    >
      <span className="-mt-1.5">⋯</span>
    </button>
  );
}
