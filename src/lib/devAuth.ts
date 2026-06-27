"use client";

/* ------------------------------------------------------------------
   DEV-ONLY mock auth.

   A throwaway, localStorage-backed "session" so we can walk into every
   portal before a real backend exists. There is NO security here and no
   server involvement — it only decides which placeholder portal to show.
   Delete this file (and DevAuthProvider) once Supabase auth lands.
------------------------------------------------------------------ */

import { createContext, useContext } from "react";

export type Role = "super_admin" | "tenant_admin" | "power_user" | "pitch_holder";

export type RoleMeta = {
  key: Role;
  /** Short label for badges / buttons. */
  label: string;
  /** One-line description of what this role does. */
  blurb: string;
  /** Base path the role lands on after a dev login. */
  path: string;
};

/* Catalogue of roles, in descending order of scope. The `path` here is the
   single source of truth for the dev role-router. */
export const ROLES: RoleMeta[] = [
  {
    key: "super_admin",
    label: "Super admin",
    blurb: "Platform owner — every campsite tenant, billing and config.",
    path: "/super-admin",
  },
  {
    key: "tenant_admin",
    label: "Campsite admin",
    blurb: "Runs one campsite: pitches, staff, exports and reporting.",
    path: "/admin",
  },
  {
    key: "power_user",
    label: "Power user",
    blurb: "Front-desk staff logging nights across all pitches.",
    path: "/power-user",
  },
  {
    key: "pitch_holder",
    label: "Pitch holder",
    blurb: "A single holder entering nights for their own pitch.",
    path: "/pitch-holder",
  },
];

export const ROLE_BY_KEY = Object.fromEntries(
  ROLES.map((r) => [r.key, r]),
) as Record<Role, RoleMeta>;

export const DEV_AUTH_STORAGE_KEY = "pakkia.devAuth.role";

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && value in ROLE_BY_KEY;
}

/** Read the current mock role from localStorage (SSR-safe). */
export function readStoredRole(): Role | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(DEV_AUTH_STORAGE_KEY);
    return isRole(v) ? v : null;
  } catch {
    return null;
  }
}

/** Persist (or clear, when null) the mock role. */
export function writeStoredRole(role: Role | null): void {
  if (typeof window === "undefined") return;
  try {
    if (role) window.localStorage.setItem(DEV_AUTH_STORAGE_KEY, role);
    else window.localStorage.removeItem(DEV_AUTH_STORAGE_KEY);
  } catch {
    /* storage unavailable (private mode / quota) — ignore */
  }
}

/* ------------------------------------------------------------------
   External store, so the provider can read it with useSyncExternalStore —
   correct SSR/hydration, cross-tab sync, and no setState-in-effect.
------------------------------------------------------------------ */

const listeners = new Set<() => void>();

/** Subscribe to role changes (same tab via setRole, other tabs via storage). */
export function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key === DEV_AUTH_STORAGE_KEY) onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** Current role for the active tab. Primitive return → stable snapshot. */
export function getRoleSnapshot(): Role | null {
  return readStoredRole();
}

/** Server render and first hydration pass: no session yet. */
export function getRoleServerSnapshot(): Role | null {
  return null;
}

/** Mutate the role and notify subscribers in this tab. */
export function setRole(role: Role | null): void {
  writeStoredRole(role);
  listeners.forEach((l) => l());
}

export type DevAuthValue = {
  /** Active mock role, or null when signed out. */
  role: Role | null;
  /** True once the role has been hydrated from storage on the client. */
  ready: boolean;
  /** Set the mock role (does not navigate — callers route themselves). */
  signInAs: (role: Role) => void;
  /** Clear the mock session. */
  signOut: () => void;
};

export const DevAuthContext = createContext<DevAuthValue | null>(null);

export function useDevAuth(): DevAuthValue {
  const ctx = useContext(DevAuthContext);
  if (!ctx) {
    throw new Error("useDevAuth must be used within <DevAuthProvider>.");
  }
  return ctx;
}
