"use client";

import Link from "next/link";
import { Popover } from "@/components/dashboard/Popover";
import {
  BellIcon,
  ChevronDownIcon,
  LogoutIcon,
  MenuIcon,
  SettingsIcon,
  UserIcon,
} from "@/components/dashboard/icons";
import type { PortalNotification, PortalUser } from "@/components/dashboard/types";

/* Default notifications (pitch-holder copy). Each portal passes its own set via
   the `notifications` prop; this is only the fallback. */
const DEFAULT_NOTIFICATIONS: PortalNotification[] = [
  {
    id: "n1",
    title: "You haven't logged tonight's guests yet.",
    time: "Today, 21:00",
    unread: true,
  },
  {
    id: "n2",
    title: "Midsummer weekend starts Friday — expect a busy pitch.",
    time: "2 days ago",
    unread: true,
  },
  {
    id: "n3",
    title: "Your May report was exported by the campsite admin.",
    time: "1 Jun",
  },
];

export function Topbar({
  title,
  user,
  profileHref = "#",
  notifications = DEFAULT_NOTIFICATIONS,
  help,
  onMenuClick,
}: {
  title: string;
  user: PortalUser;
  profileHref?: string;
  notifications?: PortalNotification[];
  help?: React.ReactNode;
  onMenuClick: () => void;
}) {
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-bg/85 px-5 backdrop-blur-md backdrop-saturate-150 sm:px-8 lg:px-10">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="grid h-10 w-10 flex-none place-items-center rounded-[9px] text-ink ring-1 ring-border transition-colors hover:bg-subtle lg:hidden"
        >
          <MenuIcon size={20} />
        </button>
        <h1 className="truncate font-heading text-[18px] font-semibold tracking-[-0.01em] text-ink">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* portal-specific help (only some portals supply this) */}
        {help}

        {/* notifications */}
        <Popover
          label="Notifications"
          panelClassName="w-[320px] max-w-[calc(100vw-2rem)] rounded-[14px] border border-border bg-surface p-1.5 shadow-lg"
          trigger={(open) => (
            <span
              className={`relative grid h-10 w-10 place-items-center rounded-[10px] ring-1 transition-colors duration-150 ${
                open
                  ? "bg-subtle text-ink ring-border-strong"
                  : "text-secondary ring-border hover:bg-subtle hover:text-ink"
              }`}
            >
              <BellIcon size={19} />
              {unread > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber ring-2 ring-bg" />
              )}
            </span>
          )}
        >
          {() => (
            <div>
              <div className="flex items-center justify-between px-3 py-2.5">
                <span className="font-heading text-[14px] font-semibold text-ink">
                  Notifications
                </span>
                {unread > 0 && (
                  <span className="rounded-full bg-amber/15 px-2 py-0.5 text-[11px] font-semibold text-amber-ink">
                    {unread} new
                  </span>
                )}
              </div>
              <ul className="flex flex-col">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full gap-3 rounded-[10px] px-3 py-2.5 text-left transition-colors duration-150 hover:bg-subtle"
                    >
                      <span
                        className={`mt-1.5 h-1.5 w-1.5 flex-none rounded-full ${
                          n.unread ? "bg-amber" : "bg-transparent"
                        }`}
                        aria-hidden
                      />
                      <span className="flex flex-col gap-0.5">
                        <span className="text-[13.5px] leading-snug text-ink">
                          {n.title}
                        </span>
                        <span className="text-[12px] text-muted">{n.time}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Popover>

        {/* user menu */}
        <Popover
          label="Account menu"
          panelClassName="w-[240px] rounded-[14px] border border-border bg-surface p-1.5 shadow-lg"
          trigger={(open) => (
            <span
              className={`flex items-center gap-2 rounded-[10px] py-1 pl-1 pr-2 ring-1 transition-colors duration-150 ${
                open
                  ? "bg-subtle ring-border-strong"
                  : "ring-border hover:bg-subtle"
              }`}
            >
              <span
                className="grid h-8 w-8 flex-none place-items-center rounded-[8px] bg-primary font-heading text-[12.5px] font-semibold text-white"
                aria-hidden
              >
                {user.initials}
              </span>
              <span className="hidden max-w-[120px] truncate text-[13.5px] font-semibold text-ink sm:block">
                {user.name.split(" ")[0]}
              </span>
              <ChevronDownIcon size={16} className="text-muted" />
            </span>
          )}
        >
          {(close) => (
            <div>
              <div className="px-3 py-2.5">
                <p className="truncate text-[13.5px] font-semibold text-ink">
                  {user.name}
                </p>
                <p className="truncate text-[12.5px] text-muted">
                  {user.email ?? user.role}
                </p>
              </div>
              <div className="my-1 h-px bg-border" />
              <Link
                href={profileHref}
                role="menuitem"
                onClick={close}
                className="flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-[13.5px] font-medium text-secondary transition-colors duration-150 hover:bg-subtle hover:text-ink"
              >
                <UserIcon size={17} /> Profile
              </Link>
              <Link
                href="#"
                role="menuitem"
                onClick={close}
                className="flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-[13.5px] font-medium text-secondary transition-colors duration-150 hover:bg-subtle hover:text-ink"
              >
                <SettingsIcon size={17} /> Settings
              </Link>
              <div className="my-1 h-px bg-border" />
              <Link
                href="/login"
                role="menuitem"
                onClick={close}
                className="flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-[13.5px] font-medium text-secondary transition-colors duration-150 hover:bg-subtle hover:text-ink"
              >
                <LogoutIcon size={17} /> Sign out
              </Link>
            </div>
          )}
        </Popover>
      </div>
    </header>
  );
}
