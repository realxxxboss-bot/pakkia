/* ------------------------------------------------------------------
   Pure role → portal-area routing. No server-only imports, so both the proxy
   (Node edge-of-app) and Server Components can share one source of truth for
   "which role owns which URL prefix".
------------------------------------------------------------------ */

import type { Role } from "./supabase/types";

/** The base URL prefix each role's portal lives under. */
export const AREA_BY_ROLE: Record<Role, string> = {
  super_admin: "/super-admin",
  tenant_admin: "/admin",
  power_user: "/power-user",
  pitch_holder: "/pitch-holder",
};

/** Every portal prefix — anything under these requires an active session. */
export const PORTAL_PREFIXES = Object.values(AREA_BY_ROLE);

/** Where a signed-in, active user of this role lands. */
export function dashboardPathFor(role: Role): string {
  return `${AREA_BY_ROLE[role]}/dashboard`;
}

/** True when `pathname` falls inside `prefix` (exact or nested). */
export function isUnder(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(prefix + "/");
}

/** The portal prefix a path belongs to, or null if it is not a portal path. */
export function portalPrefixOf(pathname: string): string | null {
  return PORTAL_PREFIXES.find((p) => isUnder(pathname, p)) ?? null;
}
