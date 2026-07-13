"use client";

import { useMemo, useState } from "react";
import {
  ContentHeader,
  Drawer,
  EntityCell,
  Field,
  FilterBar,
  FilterSearch,
  FilterSelect,
  InstrumentRow,
  Ledger,
  Menu,
  MenuItem,
  MenuRule,
  RowMenuButton,
  RuledRadioGroup,
  SplitButton,
  StatusMark,
  UnderlineInput,
  UnderlineLink,
  UnderlineSelect,
  useAudit,
  useToast,
  type LedgerColumn,
} from "@/components/portal";
import { ConfirmModal } from "@/components/portal/ConfirmModal";
import {
  admin,
  pitches,
  teamCounts,
  users as seedUsers,
  type TenantUser,
  type UserRole,
  type UserStatus,
} from "../data";

type NewRole = Exclude<UserRole, "Administrator">;

const STATUS_MARK: Record<UserStatus, { variant: "active" | "pending" | "danger"; label: string }> = {
  Active: { variant: "active", label: "Active" },
  Invited: { variant: "pending", label: "Invited" },
  Blocked: { variant: "danger", label: "Blocked" },
};

/* Pitches a new holder could be given: active and not already assigned. */
const assignablePitches = pitches
  .filter((p) => p.status === "Active" && !p.holder)
  .map((p) => p.code);

function initialsOf(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export default function AdminUsers() {
  const toast = useToast();
  const { log } = useAudit();

  const [list, setList] = useState<TenantUser[]>(seedUsers);
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newRole, setNewRole] = useState<NewRole>("Power user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pitch, setPitch] = useState("");

  const [blockTarget, setBlockTarget] = useState<TenantUser | null>(null);

  const rows = useMemo(
    () =>
      list.filter((u) => {
        if (role !== "all" && u.role !== role) return false;
        if (status !== "all" && u.status !== status) return false;
        if (query && !`${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase()))
          return false;
        return true;
      }),
    [list, role, status, query],
  );

  const openDrawer = () => {
    setNewRole("Power user");
    setName("");
    setEmail("");
    setPitch("");
    setDrawerOpen(true);
  };

  const createUser = () => {
    if (!name.trim() || !email.trim()) return;
    const user: TenantUser = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role: newRole,
      scope: newRole === "Power user" ? "All pitches" : pitch || "Assign later",
      status: "Invited",
    };
    setList((l) => [...l, user]);
    log({
      actor: admin.name,
      actorInitials: admin.initials,
      event: "Created user",
      target: user.name,
      detail: `role = ${newRole.toLowerCase()}`,
      tone: "record",
    });
    toast({
      message: `${user.name} invited`,
      variant: "success",
      action: {
        label: "Copy invite link",
        onClick: () => toast({ message: "Invite link copied", variant: "info" }),
      },
    });
    setDrawerOpen(false);
  };

  const toggleBlock = (u: TenantUser) => {
    const blocked = u.status === "Blocked";
    setList((l) =>
      l.map((x) => (x.id === u.id ? { ...x, status: blocked ? "Active" : "Blocked" } : x)),
    );
    log({
      actor: admin.name,
      actorInitials: admin.initials,
      event: blocked ? "Unblocked user" : "Blocked user",
      target: u.name,
      detail: blocked ? "access restored" : "reason = manual",
      tone: blocked ? "record" : "danger",
    });
    toast({
      message: `${u.name} ${blocked ? "unblocked" : "blocked"}`,
      variant: blocked ? "success" : "danger",
    });
  };

  const columns: LedgerColumn<TenantUser>[] = [
    {
      key: "name",
      header: "Name",
      // Blocked users are NEVER struck through — the terracotta status mark
      // carries the state (PORTAL_SPEC B2.2).
      render: (u) => <EntityCell initials={initialsOf(u.name)} name={u.name} secondary={u.email} />,
    },
    { key: "role", header: "Role", cellClassName: "font-spline text-ink-900", render: (u) => u.role },
    { key: "scope", header: "Pitch", cellClassName: "font-spline text-ink-muted", render: (u) => u.scope },
    { key: "status", header: "Status", render: (u) => <StatusMark {...STATUS_MARK[u.status]} /> },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (u) =>
        u.role === "Administrator" ? (
          // The owner isn't managed here — Super Admin appoints Administrators.
          <span className="font-spline text-[11px] uppercase tracking-[0.1em] text-pine-700">
            Owner
          </span>
        ) : (
          <Menu trigger={({ open, toggle }) => <RowMenuButton open={open} toggle={toggle} label={`Actions for ${u.name}`} />}>
            <MenuItem onClick={() => toast({ message: `Editing ${u.name}`, variant: "info" })}>
              Edit
            </MenuItem>
            {u.status === "Invited" && (
              <MenuItem
                onClick={() => {
                  log({ actor: admin.name, actorInitials: admin.initials, event: "Resent invite", target: u.name, detail: u.email, tone: "info" });
                  toast({ message: `Invite resent to ${u.email}`, variant: "info" });
                }}
              >
                Resend invite
              </MenuItem>
            )}
            <MenuItem onClick={() => toast({ message: "Magic link copied", variant: "info" })}>
              Copy magic link
            </MenuItem>
            <MenuRule />
            {u.status === "Blocked" ? (
              <MenuItem onClick={() => toggleBlock(u)}>Unblock</MenuItem>
            ) : (
              <MenuItem destructive onClick={() => setBlockTarget(u)}>
                Block
              </MenuItem>
            )}
          </Menu>
        ),
    },
  ];

  return (
    <>
      <ContentHeader
        title="Users & roles"
        description="Manage the Power Users and Pitch Holders who run Rairanta. Roles are enforced everywhere — not just the menu. Administrators are appointed by the platform."
        action={<SplitButton size="compact" label="Create user" onClick={openDrawer} />}
        secondary={
          <UnderlineLink onClick={() => toast({ message: "Invite links copied", variant: "info" })}>
            Invite links
          </UnderlineLink>
        }
      />

      <div className="mb-8">
        <InstrumentRow
          cells={[
            { label: "Power users", value: String(teamCounts.powerUsers) },
            { label: "Pitch holders", value: String(teamCounts.pitchHolders) },
            { label: "Invites pending", value: String(teamCounts.invitesPending) },
          ]}
        />
      </div>

      <FilterBar>
        <FilterSelect
          label="Role"
          value={role}
          onChange={setRole}
          options={[
            { value: "all", label: "All" },
            { value: "Administrator", label: "Administrator" },
            { value: "Power user", label: "Power user" },
            { value: "Pitch holder", label: "Pitch holder" },
          ]}
        />
        <FilterSelect
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "all", label: "All" },
            { value: "Active", label: "Active" },
            { value: "Invited", label: "Invited" },
            { value: "Blocked", label: "Blocked" },
          ]}
        />
        <FilterSearch value={query} onChange={setQuery} placeholder="Search name or email…" width={260} />
      </FilterBar>

      <Ledger
        columns={columns}
        rows={rows}
        getKey={(u) => u.id}
        caption="Users and roles at Rairanta"
        empty={{ icon: null, title: "No users match these filters.", guidance: "Clear a filter to see everyone." }}
      />

      {/* One drawer — the two old buttons collapse into a Role ruled-radio. */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Create user"
        description="Add someone to Rairanta. Their role decides what they can reach."
        footer={
          <>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="tap-target text-[0.9375rem] font-medium text-ink-900 underline decoration-line decoration-1 underline-offset-[6px] hover:text-pine-700 hover:decoration-amber-500"
            >
              Cancel
            </button>
            <SplitButton
              size="compact"
              label="Create user"
              disabled={!name.trim() || !email.trim()}
              onClick={createUser}
            />
          </>
        }
      >
        <div className="flex flex-col gap-6">
          <Field label="Role">
            <RuledRadioGroup
              name="new-role"
              legend="Role"
              value={newRole}
              onChange={(v) => setNewRole(v as NewRole)}
              options={[
                { value: "Power user", label: "Power user", hint: "Front-desk staff who can log nights for every pitch in this campsite." },
                { value: "Pitch holder", label: "Pitch holder", hint: "They receive an email invite to manage their own pitch." },
              ]}
            />
          </Field>

          <Field label="Full name" htmlFor="nu-name">
            <UnderlineInput id="nu-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Aino Korhonen" />
          </Field>

          <Field label="Email" htmlFor="nu-email">
            <UnderlineInput id="nu-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@rairanta.fi" />
          </Field>

          {newRole === "Pitch holder" && (
            <Field label="Assign pitch" htmlFor="nu-pitch" hint="Optional — you can assign a pitch later.">
              <UnderlineSelect id="nu-pitch" value={pitch} onChange={(e) => setPitch(e.target.value)}>
                <option value="">Assign later</option>
                {assignablePitches.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </UnderlineSelect>
            </Field>
          )}

          {/* Both role helper paragraphs, kept verbatim — they are the clearest
              role documentation in the product. */}
          <div className="rounded-[6px] border border-line bg-paper-deep px-4 py-3 text-[0.8125rem] leading-snug text-ink-muted">
            {newRole === "Power user" ? (
              <>
                <span className="font-medium text-ink-900">Full campsite access.</span> Power
                users can log and edit nights for every pitch, but can&apos;t change settings or
                manage other users.
              </>
            ) : (
              <>
                <span className="font-medium text-ink-900">One pitch only.</span> They receive an
                email invite to manage their own pitch.
              </>
            )}
          </div>
        </div>
      </Drawer>

      <ConfirmModal
        open={blockTarget !== null}
        onClose={() => setBlockTarget(null)}
        title="Block user"
        consequence={
          blockTarget
            ? `${blockTarget.name} loses access to Rairanta immediately. Their logged records are kept — nothing is deleted.`
            : ""
        }
        confirmLabel="Block user"
        onConfirm={() => blockTarget && toggleBlock(blockTarget)}
      />
    </>
  );
}
