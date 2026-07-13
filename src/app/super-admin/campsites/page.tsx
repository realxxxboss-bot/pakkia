"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppliedTag,
  ContentHeader,
  EntityCell,
  FilterBar,
  FilterSearch,
  FilterSelect,
  Ledger,
  LedgerCount,
  Menu,
  MenuItem,
  MenuRule,
  RowMenuButton,
  SplitButton,
  StatusMark,
  useAudit,
  useToast,
  type LedgerColumn,
} from "@/components/portal";
import { ConfirmModal } from "@/components/portal/ConfirmModal";
import { AddCampsiteDrawer } from "../_components/AddCampsiteDrawer";
import { admin, tenants, tenantTotal, type TenantStatus, type Tenant } from "../data";

const STATUS_MARK: Record<TenantStatus, { variant: "active" | "trial" | "danger"; label: string }> = {
  Active: { variant: "active", label: "Active" },
  Trial: { variant: "trial", label: "Trial" },
  Suspended: { variant: "danger", label: "Suspended" },
};

export default function SuperAdminCampsites() {
  const router = useRouter();
  const toast = useToast();
  const { log } = useAudit();
  const [addOpen, setAddOpen] = useState(false);
  const [plan, setPlan] = useState("all");
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [suspendTarget, setSuspendTarget] = useState<Tenant | null>(null);

  const rows = useMemo(
    () =>
      tenants.filter((t) => {
        if (plan !== "all" && t.plan !== plan) return false;
        if (status !== "all" && t.status !== status) return false;
        if (query && !`${t.name} ${t.slug}`.toLowerCase().includes(query.toLowerCase()))
          return false;
        return true;
      }),
    [plan, status, query],
  );

  const columns: LedgerColumn<Tenant>[] = [
    {
      key: "campsite",
      header: "Campsite",
      render: (t) => (
        <EntityCell initials={t.initials} name={t.name} secondary={`${t.slug}.pakkia.fi`} />
      ),
    },
    { key: "plan", header: "Plan", cellClassName: "font-spline text-ink-900", render: (t) => t.plan },
    {
      key: "status",
      header: "Status",
      render: (t) => <StatusMark {...STATUS_MARK[t.status]} />,
    },
    { key: "pitches", header: "Pitches", numeric: true, render: (t) => t.pitches },
    { key: "users", header: "Users", numeric: true, render: (t) => t.users },
    { key: "nights", header: "Nights MTD", numeric: true, render: (t) => t.nightsMTD },
    { key: "mrr", header: "MRR", numeric: true, render: (t) => t.mrr },
    { key: "joined", header: "Joined", cellClassName: "font-spline text-ink-muted", render: (t) => t.joined },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (t) => {
        const suspended = t.status === "Suspended";
        return (
          <Menu
            trigger={({ open, toggle }) => <RowMenuButton open={open} toggle={toggle} label={`Actions for ${t.name}`} />}
          >
            <MenuItem href={`/super-admin/campsites/${t.slug}`}>Open</MenuItem>
            <MenuItem href={`/super-admin/campsites/${t.slug}`}>Change plan</MenuItem>
            <MenuItem href={`/super-admin/campsites/${t.slug}`}>Sign in as admin</MenuItem>
            <MenuRule />
            {suspended ? (
              <MenuItem
                onClick={() => {
                  log({
                    actor: admin.name,
                    actorInitials: admin.initials,
                    event: "Reactivated tenant",
                    target: t.name,
                    tone: "record",
                  });
                  toast({ message: `${t.name} reactivated`, variant: "success" });
                }}
              >
                Reactivate
              </MenuItem>
            ) : (
              <MenuItem destructive onClick={() => setSuspendTarget(t)}>
                Suspend
              </MenuItem>
            )}
          </Menu>
        );
      },
    },
  ];

  return (
    <>
      <ContentHeader
        title="Campsites"
        description="Every tenant on the platform. Open a campsite to drill into its pitches, team and usage, change its plan, or suspend it."
        action={<SplitButton size="compact" label="Add campsite" onClick={() => setAddOpen(true)} />}
      />

      <FilterBar>
        <FilterSelect
          label="Plan"
          value={plan}
          onChange={setPlan}
          options={[
            { value: "all", label: "All" },
            { value: "Starter", label: "Starter" },
            { value: "Standard", label: "Standard" },
            { value: "Multi-site", label: "Multi-site" },
            { value: "Trial", label: "Trial" },
          ]}
        />
        <FilterSelect
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "all", label: "All" },
            { value: "Active", label: "Active" },
            { value: "Trial", label: "Trial" },
            { value: "Suspended", label: "Suspended" },
          ]}
        />
        <FilterSearch value={query} onChange={setQuery} placeholder="Search name or subdomain…" width={260} />
        <div className="flex items-center gap-2">
          {plan !== "all" && <AppliedTag onRemove={() => setPlan("all")}>Plan: {plan}</AppliedTag>}
          {status !== "all" && <AppliedTag onRemove={() => setStatus("all")}>Status: {status}</AppliedTag>}
        </div>
      </FilterBar>

      <Ledger
        columns={columns}
        rows={rows}
        getKey={(t) => t.slug}
        caption="Campsites on the Pakkia platform"
        onRowClick={(t) => router.push(`/super-admin/campsites/${t.slug}`)}
        empty={{
          icon: null,
          title: "No campsites match these filters.",
          guidance: "Clear a filter to see more tenants.",
        }}
        footer={<LedgerCount shown={rows.length} total={tenantTotal} unit="campsites" />}
      />

      <AddCampsiteDrawer open={addOpen} onClose={() => setAddOpen(false)} />

      <ConfirmModal
        open={suspendTarget !== null}
        onClose={() => setSuspendTarget(null)}
        title="Suspend campsite"
        consequence={
          suspendTarget
            ? `${suspendTarget.name} loses access immediately. Its data is retained and the campsite can be reactivated later.`
            : ""
        }
        confirmLabel="Suspend campsite"
        onConfirm={() => {
          if (!suspendTarget) return;
          log({
            actor: admin.name,
            actorInitials: admin.initials,
            event: "Suspended tenant",
            target: suspendTarget.name,
            detail: "reason: manual",
            tone: "danger",
          });
          toast({ message: `${suspendTarget.name} suspended`, variant: "danger" });
        }}
      />
    </>
  );
}
