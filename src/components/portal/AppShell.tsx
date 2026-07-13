"use client";

/* ------------------------------------------------------------------
   AppShell (PORTAL_SPEC A1) — the shared portal shell, built ONCE and
   configured per portal: fixed 260px sidebar (collapsible to 68px,
   localStorage-persisted) + 60px sticky topbar + --paper main area
   (content max-width configurable, default 1280px).

   Configurable so Pitch Holder can later use a narrower width and a mobile
   bottom-tab-bar instead of the drawer.
------------------------------------------------------------------ */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { setRole } from "@/lib/devAuth";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ToastProvider } from "./Toast";
import { AuditProvider, type AuditEvent } from "./audit-store";
import { ShellContext, type ShellContextValue } from "./shell-context";
import type { MobileVariant, NavItem, PortalNotification, PortalUser } from "./types";

const COLLAPSE_KEY = "pakkia.portal.sidebarCollapsed";

export function AppShell({
  nav,
  user,
  contextLine,
  brandTag,
  notifications = [],
  auditSeed = [],
  profileHref,
  settingsHref,
  onSignOut,
  contentMaxWidth = 1280,
  mobileVariant = "drawer",
  collapsible = true,
  children,
}: {
  nav: NavItem[];
  user: PortalUser;
  contextLine: string;
  brandTag?: string;
  notifications?: PortalNotification[];
  auditSeed?: AuditEvent[];
  profileHref: string;
  settingsHref?: string;
  onSignOut?: () => void;
  contentMaxWidth?: number;
  mobileVariant?: MobileVariant;
  collapsible?: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [pastHeader, setPastHeader] = useState(false);

  // Restore + persist collapse preference (client-only, no hydration flash).
  useEffect(() => {
    try {
      if (localStorage.getItem(COLLAPSE_KEY) === "1") setCollapsed(true);
    } catch {}
  }, []);
  const toggleCollapse = () => {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {}
      return next;
    });
  };

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const active = useMemo(
    () =>
      nav.find((n) => pathname === n.href || pathname.startsWith(n.href + "/")) ?? nav[0],
    [nav, pathname],
  );

  const handleSignOut = () => {
    if (onSignOut) return onSignOut();
    setRole(null);
    router.push("/login");
  };

  const shellValue: ShellContextValue = {
    contextLine,
    navLabel: (active?.label ?? "").toUpperCase(),
    pageTitle,
    setPageTitle,
    pastHeader,
    setPastHeader,
  };

  const isBottomTab = mobileVariant === "bottom-tab";
  const railWidth = collapsed ? 68 : 260;

  const sidebar = (mobile: boolean) => (
    <Sidebar
      nav={nav}
      user={user}
      contextLine={contextLine}
      brandTag={brandTag}
      collapsed={collapsed}
      onCollapseToggle={collapsible ? toggleCollapse : undefined}
      mobile={mobile}
      onNavigate={() => setMobileOpen(false)}
      profileHref={profileHref}
      settingsHref={settingsHref}
      onSignOut={handleSignOut}
    />
  );

  return (
    <ToastProvider>
      <AuditProvider seed={auditSeed}>
        <ShellContext.Provider value={shellValue}>
          <div className="portal-nordic min-h-[100dvh]">
            {/* desktop sidebar */}
            <div
              className="fixed inset-y-0 left-0 z-40 hidden transition-[width] duration-200 ease-[var(--ease-out)] lg:block"
              style={{ width: railWidth }}
            >
              {sidebar(false)}
            </div>

            {/* mobile off-canvas drawer (drawer variant only) */}
            {!isBottomTab && (
              <div className="lg:hidden">
                <div
                  aria-hidden
                  onClick={() => setMobileOpen(false)}
                  className={`fixed inset-0 z-40 bg-[rgba(20,52,43,0.4)] transition-opacity duration-200 motion-reduce:transition-none ${
                    mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                />
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Menu"
                  className={`fixed inset-y-0 left-0 z-50 w-[280px] max-w-[82vw] transition-transform duration-300 ease-[var(--ease-out)] motion-reduce:transition-none ${
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                  }`}
                >
                  {sidebar(true)}
                </div>
              </div>
            )}

            {/* content column */}
            <div
              className="flex min-h-[100dvh] flex-col transition-[padding] duration-200 ease-[var(--ease-out)] lg:pl-[var(--rail)]"
              style={{ ["--rail" as string]: `${railWidth}px` }}
            >
              <Topbar
                notifications={notifications}
                onMenuClick={() => setMobileOpen(true)}
                showMenuButton={!isBottomTab}
              />
              <main className="flex-1">
                <div
                  className={`mx-auto w-full px-4 py-5 sm:px-8 sm:py-8 ${isBottomTab ? "pb-24 lg:pb-8" : ""}`}
                  style={{ maxWidth: contentMaxWidth }}
                >
                  {children}
                </div>
              </main>
            </div>

            {/* mobile bottom tab bar (bottom-tab variant only) */}
            {isBottomTab && (
              <nav
                aria-label="Portal"
                className="fixed inset-x-0 bottom-0 z-40 flex h-14 border-t border-line bg-paper lg:hidden"
              >
                {nav.map((item) => {
                  const on =
                    pathname === item.href || pathname.startsWith(item.href + "/");
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={on ? "page" : undefined}
                      className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] ${
                        on ? "text-pine-700" : "text-ink-muted"
                      }`}
                    >
                      {on && <span className="absolute inset-x-6 top-0 h-[2px] bg-pine-700" aria-hidden />}
                      <Icon size={20} strokeWidth={1.5} aria-hidden />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>
        </ShellContext.Provider>
      </AuditProvider>
    </ToastProvider>
  );
}
