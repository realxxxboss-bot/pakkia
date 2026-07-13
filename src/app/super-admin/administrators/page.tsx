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
  SplitButton,
  StatusMark,
  TwoFactorMark,
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
  adminCounts,
  administrators,
  tenants,
  type Administrator,
  type AdminStatus,
} from "../data";

const STATUS_MARK: Record<AdminStatus, { variant: "active" | "pending" | "danger"; label: string }> = {
  Active: { variant: "active", label: "Active" },
  Invited: { variant: "pending", label: "Invited" },
  Blocked: { variant: "danger", label: "Blocked" },
};

export default function SuperAdminAdministrators() {
  const toast = useToast();
  const { log } = useAudit();
  const [appointOpen, setAppointOpen] = useState(false);
  const [blockTarget, setBlockTarget] = useState<Administrator | null>(null);
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(
    () =>
      administrators.filter((a) => {
        if (status !== "all" && a.status !== status) return false;
        if (query && !`${a.name} ${a.email} ${a.campsite}`.toLowerCase().includes(query.toLowerCase()))
          return false;
        return true;
      }),
    [status, query],
  );

  const columns: LedgerColumn<Administrator>[] = [
    {
      key: "admin",
      header: "Administrator",
      render: (a) => <EntityCell initials={a.initials} name={a.name} secondary={a.email} />,
    },
    {
      key: "campsite",
      header: "Campsite",
      render: (a) => (
        <UnderlineLink href={`/super-admin/campsites/${a.campsiteSlug}`}>{a.campsite}</UnderlineLink>
      ),
    },
    { key: "twofa", header: "2FA", render: (a) => <TwoFactorMark on={a.twoFactor} /> },
    {
      key: "last",
      header: "Last active",
      cellClassName: "font-spline text-ink-muted",
      render: (a) => a.lastActive,
    },
    { key: "status", header: "Status", render: (a) => <StatusMark {...STATUS_MARK[a.status]} /> },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (a) => (
        <Menu trigger={({ open, toggle }) => <RowMenuButton open={open} toggle={toggle} label={`Actions for ${a.name}`} />}>
          {a.status === "Invited" && (
            <MenuItem
              onClick={() => {
                log({ actor: admin.name, actorInitials: admin.initials, event: "Resent invite", target: a.campsite, detail: a.email, tone: "info" });
                toast({ message: `Invite resent to ${a.email}`, variant: "info" });
              }}
            >
              Resend invite
            </MenuItem>
          )}
          <MenuItem
            onClick={() => toast({ message: "Invite link copied", variant: "info" })}
          >
            Copy invite link
          </MenuItem>
          <MenuRule />
          {a.status === "Blocked" ? (
            <MenuItem
              onClick={() => {
                log({ actor: admin.name, actorInitials: admin.initials, event: "Unblocked administrator", target: a.campsite, detail: a.email, tone: "record" });
                toast({ message: `${a.name} unblocked`, variant: "success" });
              }}
            >
              Unblock
            </MenuItem>
          ) : (
            <MenuItem destructive onClick={() => setBlockTarget(a)}>
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
        title="Administrators"
        description="Every campsite has one Administrator you appoint. They run their own site — pitches, staff and reporting — while you manage them here."
        action={<SplitButton size="compact" label="Appoint administrator" onClick={() => setAppointOpen(true)} />}
      />

      <div className="mb-8">
        <InstrumentRow
          cells={[
            { label: "Active", value: String(adminCounts.active) },
            { label: "Invited", value: String(adminCounts.invited) },
            { label: "Blocked", value: String(adminCounts.blocked) },
          ]}
        />
      </div>

      <FilterBar>
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
        <FilterSearch value={query} onChange={setQuery} placeholder="Search name, email or campsite…" width={280} />
      </FilterBar>

      <Ledger
        columns={columns}
        rows={rows}
        getKey={(a) => a.id}
        caption="Platform administrators"
      />

      {/* Appoint administrator */}
      <Drawer
        open={appointOpen}
        onClose={() => setAppointOpen(false)}
        title="Appoint administrator"
        description="Invite a person to administer a campsite. They get full control of that one tenant."
        footer={
          <>
            <button
              type="button"
              onClick={() => setAppointOpen(false)}
              className="tap-target text-[0.9375rem] font-medium text-ink-900 underline decoration-line decoration-1 underline-offset-[6px] hover:text-pine-700 hover:decoration-amber-500"
            >
              Cancel
            </button>
            <SplitButton
              size="compact"
              label="Send invite"
              onClick={() => {
                log({ actor: admin.name, actorInitials: admin.initials, event: "Appointed administrator", target: tenants[0].name, detail: "invite sent", tone: "record" });
                toast({ message: "Invite sent", variant: "success" });
                setAppointOpen(false);
              }}
            />
          </>
        }
      >
        <div className="flex flex-col gap-6">
          <Field label="Campsite" htmlFor="ap-site">
            <UnderlineSelect id="ap-site" defaultValue={tenants[0].slug}>
              {tenants.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </UnderlineSelect>
          </Field>
          <Field label="Full name" htmlFor="ap-name">
            <UnderlineInput id="ap-name" placeholder="Olli Virtanen" />
          </Field>
          <Field label="Email" htmlFor="ap-email" hint="An invite with a magic link is sent immediately.">
            <UnderlineInput id="ap-email" type="email" placeholder="admin@site.fi" />
          </Field>
        </div>
      </Drawer>

      {/* Block confirm */}
      <ConfirmModal
        open={blockTarget !== null}
        onClose={() => setBlockTarget(null)}
        title="Block administrator"
        consequence={
          blockTarget
            ? `${blockTarget.name} loses access to ${blockTarget.campsite} immediately. The campsite keeps running, but no one can administer it until you appoint a replacement or unblock this account.`
            : ""
        }
        confirmLabel="Block access"
        onConfirm={() => {
          if (!blockTarget) return;
          log({ actor: admin.name, actorInitials: admin.initials, event: "Blocked administrator", target: blockTarget.campsite, detail: blockTarget.email, tone: "danger" });
          toast({ message: `${blockTarget.name} blocked`, variant: "danger" });
        }}
      />
    </>
  );
}
