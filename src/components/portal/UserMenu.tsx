"use client";

/* UserMenu (PORTAL_SPEC A4) — opens from the sidebar user chip, anchored
   above it: name, email (mono), rule, Profile / Settings, rule, Sign out.
   Fixes the previously-dead "Settings → #" link (points to the role's
   settings/profile page). */

import { Menu, MenuItem, MenuMeta, MenuRule } from "./Menu";
import type { PortalUser } from "./types";

export function UserMenu({
  user,
  profileHref,
  settingsHref,
  onSignOut,
  collapsed = false,
}: {
  user: PortalUser;
  profileHref: string;
  settingsHref?: string;
  onSignOut: () => void;
  collapsed?: boolean;
}) {
  return (
    <Menu
      side="top"
      align="start"
      width={collapsed ? 200 : undefined}
      label="Account menu"
      trigger={({ open, toggle }) => (
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={toggle}
          className={`flex w-full items-center gap-2.5 rounded-[6px] px-2 py-2 text-left transition-colors duration-150 hover:bg-[rgba(245,242,234,0.06)] ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <span
            className="grid size-8 flex-none place-items-center rounded-[6px] bg-[rgba(245,242,234,0.1)] font-spline text-[12px] text-cream"
            aria-hidden
          >
            {user.initials}
          </span>
          {!collapsed && (
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[0.875rem] text-cream">{user.name}</span>
              <span className="block truncate font-spline text-[11px] text-cream-muted">
                {user.role}
              </span>
            </span>
          )}
        </button>
      )}
    >
      <MenuMeta>
        <span className="block text-[0.875rem] font-medium text-ink-900">{user.name}</span>
        {user.email}
      </MenuMeta>
      <MenuRule />
      <MenuItem href={profileHref}>Profile</MenuItem>
      {settingsHref && <MenuItem href={settingsHref}>Settings</MenuItem>}
      <MenuRule />
      <MenuItem destructive onClick={onSignOut}>
        Sign out
      </MenuItem>
    </Menu>
  );
}
