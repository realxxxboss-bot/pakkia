"use client";

/* NotificationsPanel (PORTAL_SPEC A3) — a right drawer of ruled notification
   rows. 7px status square (amber = needs action, pine = info, terracotta =
   failure) + text + mono timestamp. Unread rows sit on --paper-deep; a row
   click deep-links to the relevant screen. */

import Link from "next/link";
import { useState } from "react";
import { Drawer } from "./Drawer";
import { UnderlineLink } from "./buttons";
import type { NotificationTone, PortalNotification } from "./types";

const TONE_SQUARE: Record<NotificationTone, string> = {
  action: "bg-amber-500",
  info: "bg-pine-700",
  failure: "bg-terracotta",
};

export function NotificationsPanel({
  open,
  onClose,
  notifications,
}: {
  open: boolean;
  onClose: () => void;
  notifications: PortalNotification[];
}) {
  const [read, setRead] = useState<Set<string>>(new Set());
  const isUnread = (n: PortalNotification) => n.unread && !read.has(n.id);
  const unreadCount = notifications.filter(isUnread).length;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={400}
      title="Notifications"
      description={
        unreadCount > 0 ? undefined : "You're all caught up."
      }
      footer={
        <UnderlineLink
          onClick={() => setRead(new Set(notifications.map((n) => n.id)))}
        >
          Mark all read
        </UnderlineLink>
      }
    >
      {unreadCount > 0 && (
        <p className="mb-3 font-spline text-[11px] uppercase tracking-[0.12em] text-amber-500">
          {unreadCount} new
        </p>
      )}
      <ul className="-mx-5">
        {notifications.map((n) => {
          const unread = isUnread(n);
          const body = (
            <span className="flex items-start gap-3">
              <span
                className={`mt-1.5 size-[7px] flex-none ${TONE_SQUARE[n.tone ?? "info"]}`}
                aria-hidden
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[0.875rem] leading-snug text-ink-900">
                  {n.title}
                </span>
                <span className="mt-1 block font-spline text-[11px] text-ink-muted">
                  {n.time}
                </span>
              </span>
            </span>
          );
          const cls = `block border-b border-line px-5 py-3.5 transition-colors ${
            unread ? "bg-paper-deep" : ""
          } ${n.href ? "hover:bg-paper-deep" : ""}`;
          return (
            <li key={n.id}>
              {n.href ? (
                <Link href={n.href} className={cls} onClick={() => setRead((s) => new Set(s).add(n.id))}>
                  {body}
                </Link>
              ) : (
                <div className={cls}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </Drawer>
  );
}

export function unreadCountOf(notifications: PortalNotification[]) {
  return notifications.filter((n) => n.unread).length;
}
