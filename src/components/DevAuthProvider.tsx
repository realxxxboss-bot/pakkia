"use client";

/* DEV-ONLY. Exposes the localStorage-backed mock role through context so any
   client component can call useDevAuth(). Reads the store with
   useSyncExternalStore: correct hydration, cross-tab sync, no effects.
   Rendered once in the root layout. Remove with the real auth. */

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  DevAuthContext,
  getRoleServerSnapshot,
  getRoleSnapshot,
  setRole,
  subscribe,
  type DevAuthValue,
  type Role,
} from "@/lib/devAuth";

// Resolves false on the server / during hydration, true once on the client —
// lets consumers avoid a "No session" flash before storage is read.
const subscribeNoop = () => () => {};

export function DevAuthProvider({ children }: { children: React.ReactNode }) {
  const role = useSyncExternalStore(
    subscribe,
    getRoleSnapshot,
    getRoleServerSnapshot,
  );
  const ready = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  const signInAs = useCallback((next: Role) => setRole(next), []);
  const signOut = useCallback(() => setRole(null), []);

  const value = useMemo<DevAuthValue>(
    () => ({ role, ready, signInAs, signOut }),
    [role, ready, signInAs, signOut],
  );

  return (
    <DevAuthContext.Provider value={value}>{children}</DevAuthContext.Provider>
  );
}
