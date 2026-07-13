import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  CalendarIcon,
  ChartIcon,
  HomeIcon,
  UserIcon,
} from "@/components/dashboard/icons";
import type { NavItem, PortalUser } from "@/components/dashboard/types";
import { HelpModal } from "@/components/pitch-holder/HelpModal";
import { holder, notifications, pitch } from "./data";

export const metadata: Metadata = {
  title: "Pitch Holder · Pakkia",
  // Portal routes must never be indexed until auth is live (PORTAL_SPEC
  // Security flag). Pairs with the X-Robots-Tag header in proxy.ts + robots.ts.
  robots: { index: false, follow: false },
};

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/pitch-holder/dashboard", icon: <HomeIcon /> },
  { label: "Calendar", href: "/pitch-holder/calendar", icon: <CalendarIcon /> },
  { label: "Summary", href: "/pitch-holder/summary", icon: <ChartIcon /> },
  { label: "Profile", href: "/pitch-holder/profile", icon: <UserIcon /> },
];

const USER: PortalUser = {
  name: holder.name,
  role: holder.role,
  initials: holder.initials,
  email: holder.email,
};

export default function PitchHolderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      nav={NAV}
      user={USER}
      brandSub={`${pitch.site} · ${pitch.code}`}
      profileHref="/pitch-holder/profile"
      notifications={notifications}
      help={<HelpModal />}
    >
      {children}
    </DashboardShell>
  );
}
