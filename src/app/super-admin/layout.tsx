import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  ActivityIcon,
  BuildingIcon,
  CardIcon,
  ClockIcon,
  GridIcon,
  SettingsIcon,
  UsersIcon,
} from "@/components/dashboard/icons";
import type { NavItem, PortalUser } from "@/components/dashboard/types";
import { admin, notifications, platform } from "./data";

export const metadata: Metadata = {
  title: "Platform Console · Pakkia",
};

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/super-admin/dashboard", icon: <GridIcon /> },
  { label: "Campsites", href: "/super-admin/campsites", icon: <BuildingIcon /> },
  { label: "Billing", href: "/super-admin/billing", icon: <CardIcon /> },
  { label: "Signups", href: "/super-admin/signups", icon: <ActivityIcon /> },
  { label: "Users", href: "/super-admin/users", icon: <UsersIcon /> },
  { label: "System log", href: "/super-admin/log", icon: <ClockIcon /> },
  { label: "Platform settings", href: "/super-admin/settings", icon: <SettingsIcon /> },
];

const USER: PortalUser = {
  name: admin.name,
  role: admin.role,
  initials: admin.initials,
  email: admin.email,
};

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      nav={NAV}
      user={USER}
      brandSub={`${platform.name} · ${platform.scope}`}
      profileHref="/super-admin/settings"
      notifications={notifications}
    >
      {children}
    </DashboardShell>
  );
}
