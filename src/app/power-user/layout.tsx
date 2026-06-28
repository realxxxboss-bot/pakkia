import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  CalendarIcon,
  ClockIcon,
  FileTextIcon,
  GridIcon,
  TentIcon,
  UserIcon,
} from "@/components/dashboard/icons";
import type { NavItem, PortalUser } from "@/components/dashboard/types";
import { notifications, site, staff } from "./data";

export const metadata: Metadata = {
  title: "Power User · Pakkia",
};

const NAV: NavItem[] = [
  { label: "Today", href: "/power-user/today", icon: <ClockIcon /> },
  { label: "Records", href: "/power-user/records", icon: <GridIcon /> },
  { label: "Assignments", href: "/power-user/assignments", icon: <TentIcon /> },
  { label: "Events", href: "/power-user/events", icon: <CalendarIcon /> },
  { label: "Reports", href: "/power-user/reports", icon: <FileTextIcon /> },
  { label: "Profile", href: "/power-user/profile", icon: <UserIcon /> },
];

const USER: PortalUser = {
  name: staff.name,
  role: staff.role,
  initials: staff.initials,
  email: staff.email,
};

export default function PowerUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      nav={NAV}
      user={USER}
      brandSub={`${site.name} · ${site.scope}`}
      profileHref="/power-user/profile"
      notifications={notifications}
    >
      {children}
    </DashboardShell>
  );
}
