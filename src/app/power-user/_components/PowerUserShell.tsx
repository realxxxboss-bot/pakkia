"use client";

/* Client shell wrapper for the Power User (staff) portal. The nav carries
   Lucide icon components, which cannot cross the server→client boundary — so
   it is constructed inside the client boundary and the server layout supplies
   only metadata + children. Same AppShell as every other portal; only the nav
   and the context line differ (PORTAL_SPEC Part D).

   No Settings item: staff do not configure the campsite (PORTAL_SPEC B3) —
   their profile is reachable from the sidebar user menu instead. */

import {
  CalendarRange,
  FileBarChart2,
  LayoutGrid,
  Link2,
  Map,
} from "lucide-react";
import { AppShell } from "@/components/portal";
import type { NavItem, PortalUser } from "@/components/portal";
import { auditSeed } from "../data";

// Icons mapped exactly per PORTAL_SPEC A1.
const NAV: NavItem[] = [
  { label: "Dashboard", href: "/power-user/dashboard", icon: LayoutGrid },
  { label: "Assignments", href: "/power-user/assignments", icon: Link2 },
  { label: "Events", href: "/power-user/events", icon: CalendarRange },
  { label: "Pitches", href: "/power-user/pitches", icon: Map },
  { label: "Reports", href: "/power-user/reports", icon: FileBarChart2 },
];

export function PowerUserShell({
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
      contextLine="RAIRANTA · STAFF"
      auditSeed={auditSeed}
      profileHref="/power-user/profile"
    >
      {children}
    </AppShell>
  );
}
