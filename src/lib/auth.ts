import "server-only";

/* ------------------------------------------------------------------
   Server-side session + identity helpers. The single place a Server
   Component / Server Action loads "who is this and what may they see".

   Defence in depth: the proxy gates portal routes at the network edge, but
   Server Functions can bypass a proxy matcher (see proxy.md "Execution
   order"), so each portal segment ALSO calls requirePortalAccess(). Supabase
   RLS is the final backstop on the data itself.
------------------------------------------------------------------ */

import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import type { Profile, Role } from "./supabase/types";
import type { PortalUser } from "@/components/portal/types";
import { AREA_BY_ROLE, dashboardPathFor, isUnder } from "./roles";

/** Current auth user + their profile, or nulls when signed out. */
export async function getSessionProfile(): Promise<{
  userId: string | null;
  profile: Profile | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { userId: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  return { userId: user.id, profile: profile ?? null };
}

/**
 * Guard a portal segment. Pass the role that owns this area; returns the
 * profile once every check passes, otherwise redirects:
 *   - no session            → /login
 *   - status 'pending'      → /pending
 *   - status 'suspended'    → /suspended
 *   - active, wrong area    → their own dashboard
 */
export async function requirePortalAccess(area: Role): Promise<Profile> {
  const { profile } = await getSessionProfile();

  if (!profile) redirect("/login");
  if (profile.status === "pending") redirect("/pending");
  if (profile.status === "suspended") redirect("/suspended");
  if (profile.role !== area) redirect(dashboardPathFor(profile.role));

  return profile;
}

/** Where to send a freshly-authenticated user, honouring status then role. */
export function postAuthPath(profile: Profile): string {
  if (profile.status === "pending") return "/pending";
  if (profile.status === "suspended") return "/suspended";
  return dashboardPathFor(profile.role);
}

/** Initials for the sidebar chip — from full name, falling back to email. */
export function initialsOf(profile: Profile): string {
  const source = profile.full_name?.trim() || profile.email;
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

const ROLE_LABEL: Record<Role, string> = {
  super_admin: "Super admin",
  tenant_admin: "Administrator",
  power_user: "Power user",
  pitch_holder: "Pitch holder",
};

/** Map a DB profile to the shell's display-only user shape. */
export function toPortalUser(profile: Profile): PortalUser {
  return {
    name: profile.full_name?.trim() || profile.email,
    email: profile.email,
    role: ROLE_LABEL[profile.role],
    initials: initialsOf(profile),
  };
}

export { AREA_BY_ROLE, dashboardPathFor, isUnder };
