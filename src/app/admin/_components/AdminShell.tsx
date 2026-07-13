"use client";

/* Client shell wrapper for the Admin (campsite) portal. The nav carries
   Lucide icon components, which cannot cross the server→client boundary —
   so it is constructed inside the client boundary and the server layout
   supplies only metadata + children. Same AppShell as every other portal;
   only the nav and the context line differ (PORTAL_SPEC Part D). */

import {
  FileBarChart2,
  LayoutGrid,
  Map,
  ScrollText,
  Settings2,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/portal";
import type { NavItem, PortalUser } from "@/components/portal";
import { auditSeed } from "../data";

// Icons mapped exactly per PORTAL_SPEC A1.
const NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
  { label: "Users & roles", href: "/admin/users", icon: Users },
  { label: "Pitches", href: "/admin/pitches", icon: Map },
  { label: "Reports", href: "/admin/reports", icon: FileBarChart2 },
  { label: "Audit log", href: "/admin/audit", icon: ScrollText },
  { label: "Settings", href: "/admin/settings", icon: Settings2 },
];

export function AdminShell({
  user,
  userId,
  children,
}: {
  user: PortalUser;
  userId: string;
  children: React.ReactNode;
}) {
  return (
    <AppShell
      nav={NAV}
      user={user}
      userId={userId}
      contextLine="RAIRANTA · ADMIN"
      auditSeed={auditSeed}
      profileHref="/admin/settings"
      settingsHref="/admin/settings"
    >
      {children}
    </AppShell>
  );
}
