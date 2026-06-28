import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  CalendarIcon,
  FileTextIcon,
  GridIcon,
  HomeIcon,
  LinkIcon,
} from "@/components/dashboard/icons";
import type { NavItem, PortalUser } from "@/components/dashboard/types";
import { notifications, site, staff } from "./data";

export const metadata: Metadata = {
  title: "Power User · Pakkia",
};

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/power-user/dashboard", icon: <HomeIcon /> },
  { label: "Assignments", href: "/power-user/assignments", icon: <LinkIcon /> },
  { label: "Events", href: "/power-user/events", icon: <CalendarIcon /> },
  { label: "Pitches", href: "/power-user/pitches", icon: <GridIcon /> },
  { label: "Reports", href: "/power-user/reports", icon: <FileTextIcon /> },
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
