import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  BuildingIcon,
  CardIcon,
  ClockIcon,
  GlobeIcon,
  GridIcon,
  ShieldIcon,
} from "@/components/dashboard/icons";
import type { NavItem, PortalUser } from "@/components/dashboard/types";
import { admin, notifications, platform } from "./data";

export const metadata: Metadata = {
  title: "Platform Console · Pakkia",
};

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/super-admin/dashboard", icon: <GridIcon /> },
  { label: "Campsites", href: "/super-admin/campsites", icon: <BuildingIcon /> },
  { label: "Administrators", href: "/super-admin/administrators", icon: <ShieldIcon /> },
  { label: "Subscriptions", href: "/super-admin/subscriptions", icon: <CardIcon /> },
  { label: "Audit log", href: "/super-admin/audit", icon: <ClockIcon /> },
  { label: "Platform settings", href: "/super-admin/settings", icon: <GlobeIcon /> },
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
