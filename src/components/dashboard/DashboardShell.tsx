"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import type {
  NavItem,
  PortalNotification,
  PortalUser,
} from "@/components/dashboard/types";

/* Reusable portal shell: collapsible desktop sidebar, off-canvas mobile drawer,
   and a sticky topbar. Every portal passes its own nav + user; the shell derives
   the active page title from the route. */

export function DashboardShell({
  nav,
  user,
  brandSub,
  profileHref,
  notifications,
  help,
  children,
}: {
  nav: NavItem[];
  user: PortalUser;
  brandSub?: string;
  profileHref?: string;
  notifications?: PortalNotification[];
  help?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const active =
    nav.find(
      (n) => pathname === n.href || pathname.startsWith(n.href + "/"),
    ) ?? nav[0];
  const title = active?.label ?? "Dashboard";

  return (
    <div className="min-h-[100dvh] bg-bg">
      {/* desktop sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 hidden transition-[width] duration-200 ease-[var(--ease-out)] lg:block ${
          collapsed ? "w-[76px]" : "w-[256px]"
        }`}
      >
        <Sidebar
          nav={nav}
          user={user}
          brandSub={brandSub}
          collapsed={collapsed}
          onCollapseToggle={() => setCollapsed((c) => !c)}
        />
      </div>

      {/* mobile drawer */}
      <div className="lg:hidden">
        <div
          onClick={() => setMobileOpen(false)}
          aria-hidden
          className={`fixed inset-0 z-40 bg-dark/40 backdrop-blur-[2px] transition-opacity duration-200 ease-[var(--ease-out)] motion-reduce:transition-none ${
            mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={`fixed inset-y-0 left-0 z-50 w-[272px] max-w-[82vw] transition-transform duration-200 ease-[var(--ease-out)] motion-reduce:transition-none ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar
            nav={nav}
            user={user}
            brandSub={brandSub}
            mobile
            onClose={() => setMobileOpen(false)}
            onNavigate={() => setMobileOpen(false)}
          />
        </div>
      </div>

      {/* content */}
      <div
        className={`flex min-h-[100dvh] flex-col transition-[padding] duration-200 ease-[var(--ease-out)] ${
          collapsed ? "lg:pl-[76px]" : "lg:pl-[256px]"
        }`}
      >
        <Topbar
          title={title}
          user={user}
          profileHref={profileHref}
          notifications={notifications}
          help={help}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1">
          <div className="mx-auto w-full max-w-[1080px] px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
