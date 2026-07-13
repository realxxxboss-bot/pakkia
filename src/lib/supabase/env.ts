/* ------------------------------------------------------------------
   Supabase connection env. The URL + anon (publishable) key are public by
   design — they are safe to inline in client bundles; row-level security is
   the real guard. Resolved through one place so every client reads the same
   names. Supports the classic `ANON_KEY` name and the newer `PUBLISHABLE_KEY`
   name that recent Supabase/Vercel integrations emit.
------------------------------------------------------------------ */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export const SUPABASE_ANON_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!;
