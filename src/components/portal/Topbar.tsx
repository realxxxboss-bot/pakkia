"use client";

/* Topbar (PORTAL_SPEC A1) — 60px, --paper 95% + backdrop-blur, 1px --line
   bottom, sticky. Left: the breadcrumb (mono) that swaps to the compact
   page title once the content header scrolls away. Right: the notification
   bell (A3) with a 7px --amber unread square — otherwise nearly empty. */

import { useState } from "react";
import { Bell, Menu as MenuIcon } from "lucide-react";
import { useShell } from "./shell-context";
import { NotificationsPanel, unreadCountOf } from "./NotificationsPanel";
import type { PortalNotification } from "./types";

export function Topbar({
  notifications,
  onMenuClick,
  showMenuButton,
}: {
  notifications: PortalNotification[];
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}) {
  const { contextLine, navLabel, pageTitle, pastHeader } = useShell();
  const [panelOpen, setPanelOpen] = useState(false);
  const unread = unreadCountOf(notifications);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[60px] items-center gap-3 border-b border-line bg-paper/95 px-4 backdrop-blur-sm sm:px-8">
        {showMenuButton && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="grid size-9 place-items-center rounded-[6px] border border-line text-ink-muted lg:hidden"
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
          className="relative grid size-[34px] flex-none place-items-center rounded-[6px] border border-line text-ink-muted transition-colors hover:bg-paper-deep hover:text-ink-900"
        >
          <Bell size={17} strokeWidth={1.75} />
          {unread > 0 && (
            <span className="absolute -right-[3px] -top-[3px] size-[7px] bg-amber-500" aria-hidden />
          )}
        </button>
      </header>

      <NotificationsPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        notifications={notifications}
      />
    </>
  );
}
