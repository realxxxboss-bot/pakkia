"use client";

/* Client shell wrapper for the Super Admin portal. The nav array carries
   Lucide icon *components* (functions), which cannot be passed across the
   server→client boundary — so the nav is constructed here, inside the
   client boundary, and the server layout only supplies metadata + children. */

import {
  LayoutGrid,
  Receipt,
  ScrollText,
  Settings2,
  Tent,
  UserCog,
} from "lucide-react";
import { AppShell } from "@/components/portal";
import type { NavItem, PortalUser } from "@/components/portal";
import { auditSeed } from "../data";

// Icons mapped exactly per PORTAL_SPEC A1.
const NAV: NavItem[] = [
  { label: "Dashboard", href: "/super-admin/dashboard", icon: LayoutGrid },
  { label: "Campsites", href: "/super-admin/campsites", icon: Tent },
  { label: "Administrators", href: "/super-admin/administrators", icon: UserCog },
  { label: "Subscriptions", href: "/super-admin/subscriptions", icon: Receipt },
  { label: "Audit log", href: "/super-admin/audit", icon: ScrollText },
  { label: "Platform settings", href: "/super-admin/settings", icon: Settings2 },
];

export function SuperAdminShell({
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
      contextLine="PLATFORM"
      brandTag="CONSOLE"
      auditSeed={auditSeed}
      profileHref="/super-admin/settings"
      settingsHref="/super-admin/settings"
    >
      {children}
    </AppShell>
  );
}
