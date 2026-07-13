"use client";

/* ------------------------------------------------------------------
   Browser Supabase client (@supabase/ssr). Reads/writes the auth session
   from cookies so it stays in lockstep with the server client and the proxy.
   Use in Client Components for auth calls (sign-out) and Realtime channels.
------------------------------------------------------------------ */

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
