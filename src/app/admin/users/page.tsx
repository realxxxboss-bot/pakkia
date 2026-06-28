"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  DataTable,
  PageHeader,
  type Column,
} from "@/components/dashboard/primitives";
import {
  ChevronDownIcon,
  MailIcon,
  PlusIcon,
  SearchIcon,
  ShieldIcon,
  UsersIcon,
} from "@/components/dashboard/icons";
import {
  Sheet,
  SheetCancel,
  SheetField,
  SheetSave,
  sheetControl,
} from "@/components/power-user/Sheet";
import {
  pitches,
  roleTone,
  teamCounts,
  users as seedUsers,
  userStatusTone,
  type TenantUser,
  type UserRole,
} from "../data";

type SheetRole = Exclude<UserRole, "Administrator">;

const unassignedPitches = pitches
  .filter((p) => !p.holder || p.status === "Inactive")
  .map((p) => p.code);

const ghostAction =
  "rounded-[8px] px-2.5 py-1.5 text-[13px] font-semibold text-secondary ring-1 ring-border transition-colors duration-150 hover:bg-subtle hover:text-ink";

function RowActions({
  user,
  onToggleBlock,
}: {
  user: TenantUser;
  onToggleBlock: (id: string) => void;
}) {
  if (user.role === "Administrator") {
    return (
      <span className="font-eyebrow text-[10px] font-semibold tracking-[0.08em] text-muted uppercase">
        Owner
      </span>
    );
  }
  const blocked = user.status === "Blocked";
  return (
    <div className="flex items-center justify-end gap-1.5">
      <button type="button" className={ghostAction}>
        Edit
      </button>
      <button
        type="button"
        onClick={() => onToggleBlock(user.id)}
        aria-label={`${blocked ? "Unblock" : "Block"} ${user.name}`}
        className={`rounded-[8px] px-2.5 py-1.5 text-[13px] font-semibold ring-1 transition-colors duration-150 ${
          blocked
            ? "text-primary ring-primary/30 hover:bg-primary-tint"
            : "text-error ring-error/30 hover:bg-error/10"
        }`}
      >
        {blocked ? "Unblock" : "Block"}
      </button>
    </div>
  );
}

export default function AdminUsers() {
  const [list, setList] = useState<TenantUser[]>(seedUsers);
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [role, setRole] = useState<SheetRole>("Power user");

  const toggleBlock = (id: string) =>
    setList((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Blocked" ? "Active" : "Blocked" }
          : u,
      ),
    );

  const open = (r: SheetRole) => {
    setRole(r);
    setSheetOpen(true);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [list, query]);

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
      key: "scope",
      header: "Pitch",
      className: "text-muted text-[13px]",
      render: (r) => r.scope,
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
      render: (r) => <RowActions user={r} onToggleBlock={toggleBlock} />,
    },
  ];

  return (
    <>
      <PageHeader
        title="Users & roles"
        subtitle="Manage the Power Users and Pitch Holders who run Rairanta. Roles are enforced everywhere — not just the menu. Administrators are appointed by the platform."
        actions={
          <>
            <button
              type="button"
              onClick={() => open("Pitch holder")}
              className="inline-flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-[14.5px] font-semibold text-secondary ring-1 ring-border transition-colors duration-150 hover:bg-subtle hover:text-ink"
            >
              <MailIcon size={17} />
              <span className="hidden sm:inline">Invite holder</span>
              <span className="sm:hidden">Holder</span>
            </button>
            <button
              type="button"
              onClick={() => open("Power user")}
              className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-4 py-2.5 text-[14.5px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.98]"
            >
              <PlusIcon size={17} />
              <span className="hidden sm:inline">Create Power User</span>
              <span className="sm:hidden">Power User</span>
            </button>
          </>
        }
      />

      {/* people summary */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-[12px] border border-border bg-surface px-4 py-3 shadow-xs">
          <span className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-dark text-white" aria-hidden>
            <ShieldIcon size={17} />
          </span>
          <span className="leading-tight">
            <span className="nums block font-mono text-[18px] font-semibold text-ink">
              {teamCounts.powerUsers}
            </span>
            <span className="text-[12.5px] text-muted">Power users</span>
          </span>
        </div>
        <div className="flex items-center gap-3 rounded-[12px] border border-border bg-surface px-4 py-3 shadow-xs">
          <span className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-subtle text-primary" aria-hidden>
            <UsersIcon size={17} />
          </span>
          <span className="leading-tight">
            <span className="nums block font-mono text-[18px] font-semibold text-ink">
              {teamCounts.pitchHolders}
            </span>
            <span className="text-[12.5px] text-muted">Pitch holders</span>
          </span>
        </div>
        <div className="col-span-2 flex items-center gap-3 rounded-[12px] border border-border bg-surface px-4 py-3 shadow-xs sm:col-span-1">
          <span className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-amber/15 text-amber-ink" aria-hidden>
            <MailIcon size={17} />
          </span>
          <span className="leading-tight">
            <span className="nums block font-mono text-[18px] font-semibold text-ink">
              {teamCounts.invitesPending}
            </span>
            <span className="text-[12.5px] text-muted">Invites pending</span>
          </span>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <label className="flex min-w-[200px] flex-1 items-center gap-2.5 rounded-[10px] bg-surface px-3.5 py-2.5 ring-1 ring-border focus-within:ring-2 focus-within:ring-primary/40 sm:max-w-[320px]">
          <SearchIcon size={16} className="flex-none text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
        rows={filtered}
        getRowKey={(r) => r.id}
        caption="Users and roles at Rairanta"
        empty={
          <p className="px-4 py-10 text-center text-[14px] text-muted">
            No users match “{query}”.
          </p>
        }
      />

      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={role === "Power user" ? "Create Power User" : "Invite pitch holder"}
        description={
          role === "Power user"
            ? "Front-desk staff who can log nights for every pitch in this campsite."
            : "They receive an email invite to manage their own pitch."
        }
        footer={
          <>
            <SheetCancel onClick={() => setSheetOpen(false)} />
            <SheetSave onClick={() => setSheetOpen(false)}>
              {role === "Power user" ? "Create user" : "Send invite"}
            </SheetSave>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <SheetField label="Role" htmlFor="nu-role">
            <div
              id="nu-role"
              role="radiogroup"
              aria-label="Role"
              className="flex gap-1.5 rounded-[12px] bg-subtle p-1.5"
            >
              {(["Power user", "Pitch holder"] as const).map((r) => {
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

          <SheetField label="Full name" htmlFor="nu-name">
            <input id="nu-name" className={sheetControl} placeholder="Aino Korhonen" />
          </SheetField>

          <SheetField label="Email" htmlFor="nu-email">
            <input
              id="nu-email"
              type="email"
              className={sheetControl}
              placeholder="name@rairanta.fi"
            />
          </SheetField>

          {role === "Power user" ? (
            <p className="rounded-[10px] bg-subtle px-3.5 py-3 text-[13px] leading-snug text-secondary">
              <span className="font-semibold text-ink">Full campsite access.</span>{" "}
              Power users can log and edit nights for every pitch, but can&apos;t
              change settings or manage other users.
            </p>
          ) : (
            <SheetField label="Assign pitch" htmlFor="nu-pitch">
              <select id="nu-pitch" className={sheetControl} defaultValue="">
                <option value="" disabled>
                  Select a pitch
                </option>
                {unassignedPitches.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </SheetField>
          )}
        </div>
      </Sheet>
    </>
  );
}
