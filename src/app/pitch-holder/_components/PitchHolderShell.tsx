"use client";

/* The Pitch Holder portal's shell — the same AppShell as the other three,
   configured phone-first (PORTAL_SPEC B4):

   - content max-w-[720px]: intentionally narrow even on desktop. This portal
     is one number a day, not a console.
   - mobileVariant "bottom-tab": below 1024px the sidebar is replaced by a
     56px bottom tab bar. Holders are phone users standing at a pitch; a
     hamburger that hides the calendar behind two taps would be a design bug.
   - desktop keeps the standard sidebar, context line "RAIRANTA · A-07".

   The HolderProvider sits INSIDE AppShell so it can reach the shared toast
   and audit providers, and it renders the stepper once — the dashboard and
   the calendar both open that same sheet.

   Nav icons are the ones mapped in PORTAL_SPEC A1. */

import { Activity, CalendarDays, LayoutGrid, UserCircle2 } from "lucide-react";
import { AppShell, type NavItem, type PortalUser } from "@/components/portal";
import { HolderProvider } from "./holder-store";
import { StepperSheet } from "./StepperSheet";
import { pitch } from "../data";

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/pitch-holder/dashboard", icon: LayoutGrid },
  { label: "Calendar", href: "/pitch-holder/calendar", icon: CalendarDays },
  { label: "Summary", href: "/pitch-holder/summary", icon: Activity },
  { label: "Profile", href: "/pitch-holder/profile", icon: UserCircle2 },
];

export function PitchHolderShell({
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
      contextLine={`${pitch.site.toUpperCase()} · ${pitch.code}`}
      profileHref="/pitch-holder/profile"
      contentMaxWidth={720}
      mobileVariant="bottom-tab"
    >
      <HolderProvider>
        {children}
        <StepperSheet />
      </HolderProvider>
    </AppShell>
  );
}
