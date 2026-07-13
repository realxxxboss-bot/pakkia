import "server-only";

/* ------------------------------------------------------------------
   Server Supabase client (@supabase/ssr) for Server Components, Server
   Actions and Route Handlers. Bridges Supabase's session to Next's cookie
   store so token refreshes persist. A fresh client is created per request —
   never share one across requests (see createServerClient docs).

   In a plain Server Component, cookies() is read-only; the try/catch around
   setAll swallows the write attempt (the proxy refreshes the session there
   instead). In Server Actions / Route Handlers the writes go through.

   `remember` controls session persistence: when false, the auth cookies are
   written as session cookies (no maxAge/expires) so they clear when the
   browser closes — this is how "keep me signed in" is honoured server-side.
------------------------------------------------------------------ */

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

export async function createClient(options?: { remember?: boolean }) {
  const cookieStore = await cookies();
  const persist = options?.remember ?? true;

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            const opts = persist
              ? options
              : { ...options, maxAge: undefined, expires: undefined };
            cookieStore.set(name, value, opts);
          }
        } catch {
          // Called from a Server Component render — cookies are read-only
          // here. Safe to ignore: the proxy handles session refresh writes.
        }
      },
    },
  });
}
