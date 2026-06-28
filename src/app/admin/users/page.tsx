"use client";

import { useState } from "react";
import {
  Badge,
  DataTable,
  PageHeader,
  type Column,
} from "@/components/dashboard/primitives";
import {
  ChevronDownIcon,
  MoreIcon,
  PlusIcon,
  SearchIcon,
} from "@/components/dashboard/icons";
import {
  Sheet,
  SheetCancel,
  SheetField,
  SheetSave,
  sheetControl,
} from "@/components/power-user/Sheet";
import {
  roleTone,
  users,
  userStatusTone,
  type TenantUser,
} from "../data";

const columns: Column<TenantUser>[] = [
  {
    key: "name",
    header: "Name",
    className: "font-semibold text-ink",
    render: (r) => r.name,
  },
  {
    key: "email",
    header: "Email",
    className: "text-muted text-[13px]",
    render: (r) => r.email,
  },
  {
    key: "role",
    header: "Role",
    render: (r) => <Badge tone={roleTone(r.role)}>{r.role}</Badge>,
  },
  {
    key: "pitch",
    header: "Pitch",
    className: "text-muted text-[13px]",
    render: (r) => r.pitch,
  },
  {
    key: "status",
    header: "Status",
    render: (r) => (
      <Badge tone={userStatusTone(r.status)} dot>
        {r.status}
      </Badge>
    ),
  },
  {
    key: "action",
    header: "",
    align: "right",
    render: () => (
      <button
        type="button"
        aria-label="User actions"
        className="grid h-8 w-8 place-items-center rounded-[9px] text-muted transition-colors duration-150 hover:bg-subtle hover:text-primary"
      >
        <MoreIcon size={16} />
      </button>
    ),
  },
];

const ROLES = ["Holder", "Power user", "Admin"] as const;

export default function AdminUsers() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [role, setRole] = useState<(typeof ROLES)[number]>("Holder");

  return (
    <>
      <PageHeader
        title="Users & roles"
        subtitle="Invite people and set what they can do. Roles are enforced everywhere — not just the menu."
        actions={
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-4 py-2.5 text-[14.5px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.98]"
          >
            <PlusIcon size={17} />
            Invite user
          </button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <label className="flex min-w-[200px] flex-1 items-center gap-2.5 rounded-[10px] bg-surface px-3.5 py-2.5 ring-1 ring-border focus-within:ring-2 focus-within:ring-primary/40 sm:max-w-[320px]">
          <SearchIcon size={16} className="flex-none text-muted" />
          <input
            type="search"
            placeholder="Search name or email…"
            className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-muted"
          />
        </label>
        <span className="inline-flex items-center gap-2 rounded-[10px] bg-surface px-3.5 py-2.5 text-[13.5px] font-medium text-secondary ring-1 ring-border">
          Role: All
          <ChevronDownIcon size={15} className="text-muted" />
        </span>
      </div>

      <DataTable
        columns={columns}
        rows={users}
        getRowKey={(r) => r.id}
        caption="Users and roles at Rairanta"
      />

      <Sheet
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite user"
        description="They receive an email invite to join this campsite."
        footer={
          <>
            <SheetCancel onClick={() => setInviteOpen(false)} />
            <SheetSave onClick={() => setInviteOpen(false)}>Send invite</SheetSave>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <SheetField label="Full name" htmlFor="iu-name">
            <input id="iu-name" className={sheetControl} placeholder="Aino Korhonen" />
          </SheetField>
          <SheetField label="Email" htmlFor="iu-email">
            <input
              id="iu-email"
              type="email"
              className={sheetControl}
              placeholder="name@site.fi"
            />
          </SheetField>
          <SheetField label="Role" htmlFor="iu-role">
            <div
              id="iu-role"
              role="radiogroup"
              aria-label="Role"
              className="flex gap-1.5 rounded-[12px] bg-subtle p-1.5"
            >
              {ROLES.map((r) => {
                const on = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setRole(r)}
                    className={`flex-1 rounded-[9px] px-3 py-2 text-[13.5px] font-semibold transition-colors duration-150 ${
                      on
                        ? "bg-primary text-white shadow-sm"
                        : "text-secondary hover:text-ink"
                    }`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </SheetField>
          <SheetField label="Assign pitch (optional)" htmlFor="iu-pitch">
            <select id="iu-pitch" className={sheetControl} defaultValue="">
              <option value="">Select a pitch</option>
              <option>A-07</option>
              <option>B-14</option>
              <option>C-02</option>
              <option>C-08</option>
            </select>
          </SheetField>
        </div>
      </Sheet>
    </>
  );
}
