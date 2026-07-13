"use client";

/* ------------------------------------------------------------------
   AppShell (PORTAL_SPEC A1) — the shared portal shell, built ONCE and
   configured per portal: fixed 260px sidebar (collapsible to 68px,
   localStorage-persisted) + 60px sticky topbar + --paper main area
   (content max-width configurable, default 1280px).

   Configurable so Pitch Holder can later use a narrower width and a mobile
   bottom-tab-bar instead of the drawer.
------------------------------------------------------------------ */

import { useEffect, useMemo, useRef, useState } from "react";
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
  const drawerRef = useRef<HTMLDivElement>(null);

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

  // Close the drawer on any route change — a nav link handles itself via
  // onNavigate, but browser back/forward and in-page links do not.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Drawer: lock scroll, close on Esc, trap Tab inside the panel, and hand
  // focus back to the topbar trigger on close (Part C.8).
  useEffect(() => {
    if (!mobileOpen) return;

    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobileOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const el = drawerRef.current;
      if (!el) return;
      const items = Array.from(
        el.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ).filter((n) => n.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      document.removeEventListener("keydown", onKey);
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

            {/* mobile off-canvas drawer (drawer variant only). `inert` parks
                the off-screen panel out of the tab order while it is closed —
                without it, Tab walks through a sidebar nobody can see. */}
            {!isBottomTab && (
              <div className="lg:hidden">
                <div
                  aria-hidden
                  onClick={() => setMobileOpen(false)}
                  className={`fixed inset-0 z-40 bg-[rgba(20,52,43,0.4)] transition-opacity duration-200 ease-[var(--ease-out)] motion-reduce:transition-none ${
                    mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                />
                <div
                  ref={drawerRef}
                  id="portal-mobile-nav"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Menu"
                  inert={!mobileOpen}
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
              className="flex min-h-[100dvh] min-w-0 flex-col transition-[padding] duration-200 ease-[var(--ease-out)] lg:pl-[var(--rail)]"
              style={{ ["--rail" as string]: `${railWidth}px` }}
            >
              <Topbar
                notifications={notifications}
                onMenuClick={() => setMobileOpen(true)}
                showMenuButton={!isBottomTab}
                menuOpen={mobileOpen}
              />
              <main className="min-w-0 flex-1">
                <div
                  className={`mx-auto w-full min-w-0 px-4 py-5 sm:px-8 sm:py-8 ${isBottomTab ? "pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-8" : ""}`}
                  style={{ maxWidth: contentMaxWidth }}
                >
                  {children}
                </div>
              </main>
            </div>

            {/* mobile bottom tab bar (bottom-tab variant only) — the phone-first
                portals (holder) trade the off-canvas drawer for thumb-reach
                tabs. 56px, --paper, 1px --line top rule; the active tab is
                --pine-700 under a 2px --pine-700 top rule with radius 0. The
                safe-area pad keeps the tabs clear of the iOS home indicator
                without changing the 56px tap row itself. */}
            {isBottomTab && (
              <nav
                aria-label="Portal tabs"
                className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper pb-[env(safe-area-inset-bottom)] lg:hidden"
              >
                <div className="flex h-14">
                  {nav.map((item) => {
                    const on =
                      pathname === item.href || pathname.startsWith(item.href + "/");
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={on ? "page" : undefined}
                        className={`relative flex flex-1 flex-col items-center justify-center gap-1 font-spline text-[10px] uppercase tracking-[0.08em] transition-colors duration-150 ${
                          on ? "text-pine-700" : "text-ink-muted active:bg-paper-deep"
                        }`}
                      >
                        {on && (
                          <span className="absolute inset-x-0 top-0 h-[2px] bg-pine-700" aria-hidden />
                        )}
                        <Icon size={20} strokeWidth={1.5} aria-hidden />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </nav>
            )}
          </div>
        </ShellContext.Provider>
      </AuditProvider>
    </ToastProvider>
  );
}
