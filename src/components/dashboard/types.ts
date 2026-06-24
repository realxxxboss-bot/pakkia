import type { ReactNode } from "react";

/* Shared shapes for the portal shell. Kept generic so every portal
   (Pitch Holder, Power User, Admin, Super Admin) configures the same shell. */

export type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

export type PortalUser = {
  name: string;
  role: string;
  initials: string;
  email?: string;
};
