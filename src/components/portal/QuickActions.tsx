"use client";

/* ------------------------------------------------------------------
   QuickActions (PORTAL_SPEC B3.1 §3) — the dashboard's three link-cards
   become ONE ruled strip: cells separated by 1px --line rules, each a whole-
   cell link with an 18px stroke icon, a label and a mono description. No icon
   squares, no cards, no shadows.
------------------------------------------------------------------ */

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export type QuickAction = {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-[12px] border border-line bg-paper sm:grid-cols-3">
      {actions.map((a, i) => {
        const Icon = a.icon;
        return (
          <Link
            key={a.href}
            href={a.href}
            className={`group flex items-start gap-3 px-5 py-4 transition-colors duration-150 hover:bg-paper-deep ${
              i > 0 ? "border-t border-line sm:border-l sm:border-t-0" : ""
            }`}
          >
            <Icon
              size={18}
              strokeWidth={1.5}
              className="mt-0.5 flex-none text-pine-700"
              aria-hidden
            />
            <span className="min-w-0">
              <span className="block text-[0.9375rem] font-medium text-ink-900 transition-colors group-hover:text-pine-700">
                {a.label}
              </span>
              <span className="mt-0.5 block font-spline text-[12px] text-ink-muted">
                {a.description}
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
