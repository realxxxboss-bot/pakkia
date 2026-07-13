import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  ClockIcon,
  FileTextIcon,
  GridIcon,
  SettingsIcon,
  TentIcon,
  UsersIcon,
} from "@/components/dashboard/icons";
import type { NavItem, PortalUser } from "@/components/dashboard/types";
import { admin, notifications, tenant } from "./data";

export const metadata: Metadata = {
  title: "Admin · Pakkia",
  // Portal routes must never be indexed until auth is live (PORTAL_SPEC
  // Security flag). Pairs with the X-Robots-Tag header in proxy.ts + robots.ts.
  robots: { index: false, follow: false },
};

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <GridIcon /> },
  { label: "Users & roles", href: "/admin/users", icon: <UsersIcon /> },
  { label: "Pitches", href: "/admin/pitches", icon: <TentIcon /> },
  { label: "Reports", href: "/admin/reports", icon: <FileTextIcon /> },
  { label: "Audit log", href: "/admin/audit", icon: <ClockIcon /> },
  { label: "Settings", href: "/admin/settings", icon: <SettingsIcon /> },
];

const USER: PortalUser = {
  name: admin.name,
  role: admin.role,
  initials: admin.initials,
  email: admin.email,
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      nav={NAV}
      user={USER}
      brandSub={`${tenant.name} · ${tenant.scope}`}
      profileHref="/admin/settings"
      notifications={notifications}
    >
      {children}
    </DashboardShell>
  );
}
