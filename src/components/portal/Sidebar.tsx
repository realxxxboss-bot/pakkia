"use client";

/* ------------------------------------------------------------------
   Sidebar (PORTAL_SPEC A1) — the portal's identity element. --pine-900,
   1px --line-dark right border. Tent mark + logotype in --cream, a mono
   context line, nav items with 20px Lucide icons, active = a 2px --amber
   left rule (the ONLY amber in the sidebar). Pinned user chip + collapse
   toggle. Collapsed = icons + flat tooltips.
------------------------------------------------------------------ */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { TentMark } from "@/components/site/primitives";
import type { NavItem, PortalUser } from "./types";
import { UserMenu } from "./UserMenu";

export function Sidebar({
  nav,
  user,
  contextLine,
  brandTag,
  collapsed = false,
  onCollapseToggle,
  mobile = false,
  onNavigate,
  profileHref,
  settingsHref,
  onSignOut,
}: {
  nav: NavItem[];
  user: PortalUser;
  contextLine: string;
  brandTag?: string;
  collapsed?: boolean;
  onCollapseToggle?: () => void;
  mobile?: boolean;
  onNavigate?: () => void;
  profileHref: string;
  settingsHref?: string;
  onSignOut: () => void;
}) {
  const pathname = usePathname();
  const isCollapsed = collapsed && !mobile;

  return (
    <div className="flex h-full flex-col border-r border-line-dark bg-pine-900">
      {/* brand */}
      <div className={`flex items-center gap-2.5 px-4 pb-4 pt-5 ${isCollapsed ? "justify-center" : ""}`}>
        <TentMark size={20} className="text-cream" />
        {!isCollapsed && (
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-familjen text-[1.0625rem] font-bold tracking-[-0.02em] text-cream">
                Pakkia
              </span>
              {brandTag && (
                <span className="font-spline text-[11px] uppercase tracking-[0.14em] text-cream-muted">
                  {brandTag}
                </span>
              )}
            </div>
            <span className="mt-0.5 block font-spline text-[11px] uppercase tracking-[0.14em] text-cream-muted">
              {contextLine}
            </span>
          </div>
        )}
      </div>

      {/* nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2" aria-label="Portal">
        <ul className="flex flex-col gap-0.5">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <li key={item.href} className="group relative">
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex items-center rounded-[6px] px-3 py-2.5 text-[0.9375rem] font-medium transition-colors duration-150 ${
                    isCollapsed ? "justify-center" : "gap-3"
                  } ${
                    active
                      ? "bg-[rgba(245,242,234,0.08)] text-cream"
                      : "text-cream-muted hover:bg-[rgba(245,242,234,0.06)] hover:text-cream"
                  }`}
                >
                  {active && (
                    <span
                      className="absolute inset-y-0 left-0 w-[2px] bg-amber-500"
                      aria-hidden
                    />
                  )}
                  <Icon size={20} strokeWidth={1.5} className="flex-none" aria-hidden />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
                {isCollapsed && (
                  <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-[6px] border border-line-dark bg-pine-900 px-2 py-1 font-spline text-[12px] text-cream opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* footer: collapse toggle + user chip */}
      <div className="border-t border-line-dark px-3 py-3">
        {!mobile && onCollapseToggle && (
          <div className={`mb-2 flex ${isCollapsed ? "justify-center" : "justify-end"}`}>
            <button
              type="button"
              onClick={onCollapseToggle}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="tap-target grid size-7 place-items-center rounded-[6px] border border-line-dark text-cream-muted transition-colors hover:bg-[rgba(245,242,234,0.06)] hover:text-cream"
            >
              {isCollapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
            </button>
          </div>
        )}
        <UserMenu
          user={user}
          profileHref={profileHref}
          settingsHref={settingsHref}
          onSignOut={onSignOut}
          collapsed={isCollapsed}
        />
      </div>
    </div>
  );
}
