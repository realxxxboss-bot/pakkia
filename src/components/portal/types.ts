import type { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type PortalUser = {
  name: string;
  role: string;
  initials: string;
  email: string;
};

export type NotificationTone = "action" | "info" | "failure";

export type PortalNotification = {
  id: string;
  title: string;
  time: string;
  unread?: boolean;
  tone?: NotificationTone;
  href?: string;
};

export type MobileVariant = "drawer" | "bottom-tab";
