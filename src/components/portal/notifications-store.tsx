"use client";

/* ------------------------------------------------------------------
   Realtime notifications channel (PORTAL_SPEC A3, real backend).

   Subscribes the portal bell to public.notifications for the CURRENT user via
   Supabase Realtime. There is no fake data: the initial list is a real query,
   and INSERT / UPDATE / DELETE events keep it live. RLS (notif_select_own)
   guarantees a user only ever sees their own rows. When there are none the
   panel shows its empty state.
------------------------------------------------------------------ */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { NotificationRow } from "@/lib/supabase/types";
import type { NotificationTone, PortalNotification } from "./types";

const TONES: NotificationTone[] = ["action", "info", "failure"];

function toneOf(type: string): NotificationTone {
  return (TONES as string[]).includes(type)
    ? (type as NotificationTone)
    : "info";
}

/** Compact relative timestamp for the notification rows. */
function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diffS = Math.round((Date.now() - then) / 1000);
  if (!Number.isFinite(diffS)) return "";
  if (diffS < 45) return "just now";
  const mins = Math.round(diffS / 60);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `${days} d ago`;
  return new Date(iso).toLocaleDateString();
}

function toPortalNotification(row: NotificationRow): PortalNotification {
  return {
    id: row.id,
    title: row.title,
    time: relativeTime(row.created_at),
    unread: !row.is_read,
    tone: toneOf(row.type),
    href: row.link ?? undefined,
  };
}

type NotificationsValue = {
  items: PortalNotification[];
  unread: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
};

const NotificationsContext = createContext<NotificationsValue | null>(null);

export function useNotifications(): NotificationsValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx)
    throw new Error("useNotifications must be used within <NotificationsProvider>.");
  return ctx;
}

export function NotificationsProvider({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  const [rows, setRows] = useState<NotificationRow[]>([]);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    // Initial load — most recent first.
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30)
      .then(({ data }) => {
        if (!cancelled && data) setRows(data as NotificationRow[]);
      });

    // Live updates for this user's rows only.
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setRows((prev) => {
            if (payload.eventType === "INSERT") {
              const row = payload.new as NotificationRow;
              if (prev.some((r) => r.id === row.id)) return prev;
              return [row, ...prev];
            }
            if (payload.eventType === "UPDATE") {
              const row = payload.new as NotificationRow;
              return prev.map((r) => (r.id === row.id ? row : r));
            }
            if (payload.eventType === "DELETE") {
              const old = payload.old as Partial<NotificationRow>;
              return prev.filter((r) => r.id !== old.id);
            }
            return prev;
          });
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const markRead = useCallback(
    (id: string) => {
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_read: true } : r)),
      );
      const supabase = createClient();
      void supabase.from("notifications").update({ is_read: true }).eq("id", id);
    },
    [],
  );

  const markAllRead = useCallback(() => {
    const unreadIds = rows.filter((r) => !r.is_read).map((r) => r.id);
    if (unreadIds.length === 0) return;
    setRows((prev) => prev.map((r) => ({ ...r, is_read: true })));
    const supabase = createClient();
    void supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);
  }, [rows, userId]);

  const value = useMemo<NotificationsValue>(() => {
    const items = rows.map(toPortalNotification);
    return {
      items,
      unread: items.filter((n) => n.unread).length,
      markRead,
      markAllRead,
    };
  }, [rows, markRead, markAllRead]);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}
