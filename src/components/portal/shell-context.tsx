"use client";

/* Shared shell state so the Topbar can swap its breadcrumb for the compact
   page title once the ContentHeader scrolls out of view (PORTAL_SPEC A1). */

import { createContext, useContext } from "react";

export type ShellContextValue = {
  contextLine: string;
  navLabel: string;
  pageTitle: string;
  setPageTitle: (t: string) => void;
  pastHeader: boolean;
  setPastHeader: (b: boolean) => void;
};

export const ShellContext = createContext<ShellContextValue | null>(null);

export function useShell() {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error("useShell must be used within <AppShell>.");
  return ctx;
}
