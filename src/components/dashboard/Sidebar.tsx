"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
} from "@/components/dashboard/icons";
import type { NavItem, PortalUser } from "@/components/dashboard/types";

export function Sidebar({
  nav,
  user,
  brandSub,
  collapsed = false,
  mobile = false,
  onCollapseToggle,
  onNavigate,
  onClose,
}: {
  nav: NavItem[];
  user: PortalUser;
  brandSub?: string;
  collapsed?: boolean;
  mobile?: boolean;
  onCollapseToggle?: () => void;
  onNavigate?: () => void;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  // On the mobile drawer the sidebar always shows full labels.
  const compact = collapsed && !mobile;

  return (
    <div className="flex h-full flex-col border-r border-border bg-surface">
      {/* brand */}
      <div
        className={`flex h-16 flex-none items-center border-b border-border ${
          compact ? "justify-center px-2" : "justify-between px-5"
        }`}
      >
        <Link
          href="/"
          aria-label="Pakkia home"
          onClick={onNavigate}
          className="flex items-center gap-2.5 overflow-hidden"
        >
          <BrandMark />
          {!compact && (
            <span className="flex flex-col leading-tight">
              <span className="font-heading text-[17px] font-semibold tracking-[-0.02em] text-ink">
                Pakkia
              </span>
              {brandSub && (
                <span className="font-eyebrow text-[9.5px] font-semibold tracking-[0.1em] text-muted uppercase">
                  {brandSub}
                </span>
              )}
            </span>
          )}
        </Link>
        {mobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid h-9 w-9 place-items-center rounded-[9px] text-secondary transition-colors hover:bg-subtle hover:text-ink"
          >
            <CloseIcon size={18} />
          </button>
        )}
      </div>

      {/* nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Portal">
        <ul className="flex flex-col gap-1">
          {nav.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  title={compact ? item.label : undefined}
                  className={`group flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[14.5px] font-medium transition-colors duration-150 ${
                    compact ? "justify-center" : ""
                  } ${
                    active
                      ? "bg-primary-tint text-primary-dark font-semibold"
                      : "text-secondary hover:bg-subtle hover:text-ink"
                  }`}
                >
                  <span className="flex-none">{item.icon}</span>
                  {!compact && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* footer: user identity + desktop collapse toggle */}
      <div className="flex-none border-t border-border p-3">
        <div
          className={`flex items-center gap-3 rounded-[10px] px-2 py-2 ${
            compact ? "justify-center" : ""
          }`}
        >
          <span
            className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-primary font-heading text-[13px] font-semibold text-white"
            aria-hidden
          >
            {user.initials}
          </span>
          {!compact && (
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-[13.5px] font-semibold text-ink">
                {user.name}
              </span>
              <span className="truncate text-[12px] text-muted">
                {user.role}
              </span>
            </span>
          )}
        </div>

        {!mobile && (
          <button
            type="button"
            onClick={onCollapseToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`mt-1 flex w-full items-center gap-2 rounded-[10px] px-3 py-2 text-[13px] font-medium text-muted transition-colors duration-150 hover:bg-subtle hover:text-ink ${
              compact ? "justify-center" : ""
            }`}
          >
            {collapsed ? (
              <ChevronRightIcon size={18} />
            ) : (
              <>
                <ChevronLeftIcon size={18} />
                <span>Collapse</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
