import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getProxySession, copyAuthCookies } from "@/lib/supabase/proxy";
import { AREA_BY_ROLE, dashboardPathFor, portalPrefixOf } from "@/lib/roles";
import type { Profile } from "@/lib/supabase/types";

/* ------------------------------------------------------------------
   Proxy (Next 16's renamed `middleware`). Two jobs, both real now:

   1. Refresh the Supabase session on every gated request (getProxySession →
      getUser revalidates + rotates tokens, written back as cookies).

   2. Real role + status gating at the network edge:
        - not signed in + portal/notice route → /login (portals keep ?next)
        - status 'pending'   → only /pending is reachable
        - status 'suspended' → only /suspended is reachable
        - status 'active'    → confined to their own role's area; signed-in
          users are bounced off /login, /signup and the notice pages
        - noindex header on every private surface (pairs with robots.ts +
          per-route robots metadata)

   Defence in depth: Server Functions can bypass this matcher (proxy.md
   "Execution order"), so every portal segment re-checks via
   requirePortalAccess() and Supabase RLS guards the data itself.
------------------------------------------------------------------ */

const AUTH_PAGES = new Set(["/login", "/signup"]);
const NOTICE_PAGES = new Set(["/pending", "/suspended"]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { supabase, user, response } = await getProxySession(request);
  const res = response();

  const isPortal = portalPrefixOf(pathname) !== null;
  const isNotice = NOTICE_PAGES.has(pathname);
  const isAuthPage = AUTH_PAGES.has(pathname);

  const redirectTo = (path: string, withNext = false) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = "";
    if (withNext) url.searchParams.set("next", pathname);
    return copyAuthCookies(res, NextResponse.redirect(url));
  };

  // noindex on the private surfaces whatever the outcome.
  if (isPortal || isNotice) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  // ---- unauthenticated ----
  if (!user) {
    if (isPortal || isNotice) return redirectTo("/login", isPortal);
    return res; // /login and /signup render normally
  }

  // ---- authenticated: load role + status for real gating ----
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .maybeSingle<Pick<Profile, "role" | "status">>();

  if (!profile) {
    // A session with no profile row can gate to nothing — allow the auth
    // pages, send everything else to /login.
    return isAuthPage ? res : redirectTo("/login");
  }

  if (profile.status === "pending") {
    return pathname === "/pending" ? res : redirectTo("/pending");
  }

  if (profile.status === "suspended") {
    return pathname === "/suspended" ? res : redirectTo("/suspended");
  }

  // ---- active ----
  const dash = dashboardPathFor(profile.role);

  // Signed-in active users have no business on the auth or notice screens.
  if (isAuthPage || isNotice) return redirectTo(dash);

  // Confine each role to its own portal area.
  if (isPortal && portalPrefixOf(pathname) !== AREA_BY_ROLE[profile.role]) {
    return redirectTo(dash);
  }

  return res;
}

export const config = {
  matcher: [
    "/super-admin",
    "/super-admin/:path*",
    "/admin",
    "/admin/:path*",
    "/power-user",
    "/power-user/:path*",
    "/pitch-holder",
    "/pitch-holder/:path*",
    "/pending",
    "/suspended",
    "/login",
    "/signup",
  ],
};
