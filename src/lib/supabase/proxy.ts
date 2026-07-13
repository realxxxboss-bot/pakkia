import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/* ------------------------------------------------------------------
   Proxy-side Supabase session bridge. Builds a server client wired to the
   incoming request cookies + an outgoing response, refreshes the session
   (getUser — always re-validates against the auth server, never trusts a
   cookie blindly), and returns everything the proxy needs.

   Cookie plumbing follows the @supabase/ssr contract exactly: every set is
   mirrored onto BOTH the request (so downstream reads in this same pass see
   the refreshed tokens) and the response (so the browser is updated). If the
   proxy replaces `response` with a redirect, it MUST copy these cookies over
   — see copyAuthCookies below.
------------------------------------------------------------------ */

export type ProxySession = Awaited<ReturnType<typeof getProxySession>>;

export async function getProxySession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // IMPORTANT: run getUser() immediately after creating the client and do not
  // run other logic between — it revalidates and refreshes the token.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user, response: () => response };
}

/** Move the refreshed-session Set-Cookie headers onto a redirect response so
    the browser still receives the rotated tokens when we short-circuit. */
export function copyAuthCookies(from: NextResponse, to: NextResponse) {
  for (const cookie of from.cookies.getAll()) {
    to.cookies.set(cookie);
  }
  return to;
}
