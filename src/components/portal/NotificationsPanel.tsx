"use client";

/* NotificationsPanel (PORTAL_SPEC A3) — a right drawer of ruled notification
   rows fed by the real realtime channel (useNotifications). 7px status square
   (amber = needs action, pine = info, terracotta = failure) + text + mono
   timestamp. Unread rows sit on --paper-deep; a row click marks it read and
   deep-links to the relevant screen. Empty state when the user has none. */

import Link from "next/link";
import { Drawer } from "./Drawer";
import { UnderlineLink } from "./buttons";
import type { NotificationTone } from "./types";
import { useNotifications } from "./notifications-store";

const TONE_SQUARE: Record<NotificationTone, string> = {
  action: "bg-amber-500",
  info: "bg-pine-700",
  failure: "bg-terracotta",
};

export function NotificationsPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, unread, markRead, markAllRead } = useNotifications();
  const isEmpty = items.length === 0;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={400}
      title="Notifications"
      description={
        isEmpty || unread > 0 ? undefined : "You're all caught up."
      }
      footer={
        !isEmpty ? (
          <UnderlineLink onClick={markAllRead}>Mark all read</UnderlineLink>
        ) : undefined
      }
    >
      {isEmpty ? (
        <div className="py-10 text-center">
          <p className="text-[0.875rem] text-ink-muted">No notifications yet.</p>
          <p className="mt-1 font-spline text-[11px] text-ink-muted">
            You&apos;ll see approvals, reports and alerts here.
          </p>
        </div>
      ) : (
        <>
          {unread > 0 && (
            <p className="mb-3 font-spline text-[11px] uppercase tracking-[0.12em] text-amber-500">
              {unread} new
            </p>
          )}
          <ul className="-mx-5">
            {items.map((n) => {
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
                n.unread ? "bg-paper-deep" : ""
              } ${n.href ? "hover:bg-paper-deep" : ""}`;
              return (
                <li key={n.id}>
                  {n.href ? (
                    <Link
                      href={n.href}
                      className={cls}
                      onClick={() => markRead(n.id)}
                    >
                      {body}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => markRead(n.id)}
                      className={`w-full text-left ${cls}`}
                    >
                      {body}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </Drawer>
  );
}
