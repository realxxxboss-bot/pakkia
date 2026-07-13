import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* ------------------------------------------------------------------
   Portal gate (PORTAL_SPEC Security flag + Part C.1).

   NOTE ON THE FILE NAME: Next.js 16 deprecated the `middleware` convention
   and renamed it to `proxy` (see node_modules/next/dist/docs/.../proxy.md).
   This is the same feature the security flag calls "middleware".

   Two jobs, both of which must ship before the portals go public:

   1. noindex — every portal response carries `X-Robots-Tag: noindex,
      nofollow` so the statically-rendered demo screens (tenant names, MRR,
      admin emails) can never be indexed while they render publicly. This
      pairs with robots.ts and the per-route `robots` metadata.

   2. Auth gate STRUCTURE (not real auth yet) — keyed to an env flag so the
      portals stay viewable with mock data during development, and real
      enforcement flips on the day Supabase auth lands. We do NOT fake a
      session here.

   TODO(auth phase): when Supabase auth lands —
     - validate the real session cookie / JWT here (Edge-safe read only),
     - AND enforce role-based checks server-side inside each portal segment
       (layout/page/Server Action), never trusting the proxy alone
       (Server Functions can bypass a matcher — see proxy.md "Execution
       order"). Supabase RLS remains the data backstop.
     - remove the dev quick-login mechanism entirely (already gated to
       dev-only via DEV_LOGIN_ENABLED in src/lib/devAuth.ts).
------------------------------------------------------------------ */

const PORTAL_PREFIXES = [
  "/super-admin",
  "/admin",
  "/power-user",
  "/pitch-holder",
];

// Flip to "true" (server env) to enforce the gate once real auth exists.
const AUTH_ENFORCED = process.env.PORTAL_AUTH_ENFORCED === "true";

// The session cookie the auth phase will set. Structure only — its mere
// presence is NOT trusted as real auth; see TODO above.
const SESSION_COOKIE = "pakkia-session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPortal = PORTAL_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  if (!isPortal) return NextResponse.next();

  // 2. Gate structure — real enforcement only when the flag is on.
  if (AUTH_ENFORCED && !request.cookies.has(SESSION_COOKIE)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // 1. noindex header on every portal response.
  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: [
    "/super-admin/:path*",
    "/admin/:path*",
    "/power-user/:path*",
    "/pitch-holder/:path*",
  ],
};
