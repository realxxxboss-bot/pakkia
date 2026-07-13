"use client";

/* Topbar (PORTAL_SPEC A1) — 60px, --paper 95% + backdrop-blur, 1px --line
   bottom, sticky. Left: the breadcrumb (mono) that swaps to the compact
   page title once the content header scrolls away. Right: the notification
   bell (A3) with a 7px --amber unread square, driven by the real realtime
   channel — otherwise nearly empty. */

import { useState } from "react";
import { Bell, Menu as MenuIcon } from "lucide-react";
import { useShell } from "./shell-context";
import { NotificationsPanel } from "./NotificationsPanel";
import { useNotifications } from "./notifications-store";

export function Topbar({
  onMenuClick,
  showMenuButton,
  menuOpen = false,
}: {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  menuOpen?: boolean;
}) {
  const { contextLine, navLabel, pageTitle, pastHeader } = useShell();
  const [panelOpen, setPanelOpen] = useState(false);
  const { unread } = useNotifications();

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[60px] items-center gap-3 border-b border-line bg-paper/95 px-4 backdrop-blur-sm sm:px-8">
        {showMenuButton && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="portal-mobile-nav"
            className="grid size-11 flex-none place-items-center rounded-[6px] border border-line text-ink-muted transition-colors duration-150 hover:bg-paper-deep hover:text-ink-900 lg:hidden"
          >
            <MenuIcon size={18} />
          </button>
        )}

        <div className="min-w-0 flex-1">
          {pastHeader && pageTitle ? (
            <h2 className="truncate font-familjen text-[1.125rem] font-semibold tracking-[-0.02em] text-pine-900">
              {pageTitle}
            </h2>
          ) : (
            <p className="truncate font-spline text-[12px] uppercase tracking-[0.1em] text-ink-muted">
              {contextLine} <span className="text-line">/</span> {navLabel}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setPanelOpen(true)}
          aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
          className="tap-target relative grid size-[34px] flex-none place-items-center rounded-[6px] border border-line text-ink-muted transition-colors hover:bg-paper-deep hover:text-ink-900"
        >
          <Bell size={17} strokeWidth={1.75} />
          {unread > 0 && (
            <span className="absolute -right-[3px] -top-[3px] size-[7px] bg-amber-500" aria-hidden />
          )}
        </button>
      </header>

      <NotificationsPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </>
  );
}
