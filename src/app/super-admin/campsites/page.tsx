"use client";

import { useState } from "react";
import { Badge, Card, PageHeader } from "@/components/dashboard/primitives";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  SearchIcon,
} from "@/components/dashboard/icons";
import { TenantDrawer } from "@/components/super-admin/TenantDrawer";
import {
  planTone,
  statusTone,
  tenants,
  tenantTotal,
  type Tenant,
} from "../data";

function FilterPill({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-[10px] bg-surface px-3.5 py-2.5 text-[13.5px] font-medium text-secondary ring-1 ring-border transition-colors duration-150 hover:bg-subtle hover:text-ink"
    >
      {children}
      <ChevronDownIcon size={15} className="text-muted" />
    </button>
  );
}

export default function SuperAdminCampsites() {
  const [active, setActive] = useState<Tenant | null>(null);

  return (
    <>
      <PageHeader
        title="Campsites"
        subtitle="All tenants on the platform. Select a row to manage a campsite, change its plan, or log in as its admin."
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-4 py-2.5 text-[14.5px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.98]"
          >
            <PlusIcon size={17} />
            Add campsite
          </button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <label className="flex min-w-[200px] flex-1 items-center gap-2.5 rounded-[10px] bg-surface px-3.5 py-2.5 ring-1 ring-border focus-within:ring-2 focus-within:ring-primary/40 sm:max-w-[340px]">
          <SearchIcon size={16} className="flex-none text-muted" />
          <input
            type="search"
            placeholder="Search campsite or subdomain…"
            className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-muted"
          />
        </label>
        <FilterPill>Plan: All</FilterPill>
        <FilterPill>Status: All</FilterPill>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[14px]">
            <caption className="sr-only">
              Campsites on the Pakkia platform
            </caption>
            <thead>
              <tr className="border-b border-border">
                {[
                  "Campsite",
                  "Plan",
                  "Status",
                  "Pitches",
                  "Users",
                  "Nights MTD",
                  "MRR",
                  "Joined",
                  "",
                ].map((h, i) => (
                  <th
                    key={h || "chev"}
                    scope="col"
                    className={`px-5 py-3.5 font-eyebrow text-[10.5px] font-semibold tracking-[0.08em] text-muted uppercase ${
                      i >= 3 && i <= 6 ? "text-right" : "text-left"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => (
                <tr
                  key={t.slug}
                  onClick={() => setActive(t)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActive(t);
                    }
                  }}
                  aria-label={`Manage ${t.name}`}
                  className="cursor-pointer border-b border-border transition-colors duration-150 last:border-0 hover:bg-subtle/60 focus-visible:bg-subtle/60 focus-visible:outline-none"
                >
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-3">
                      <span
                        className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-subtle font-heading text-[12px] font-semibold text-primary"
                        aria-hidden
                      >
                        {t.initials}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-ink">
                          {t.name}
                        </span>
                        <span className="block truncate text-[12px] text-muted">
                          {t.slug}.pakkia.fi
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge tone={planTone(t.plan)}>{t.plan}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge tone={statusTone(t.status)} dot>
                      {t.status}
                    </Badge>
                  </td>
                  <td className="nums px-5 py-3.5 text-right font-mono text-secondary">
                    {t.pitches}
                  </td>
                  <td className="nums px-5 py-3.5 text-right font-mono text-secondary">
                    {t.users}
                  </td>
                  <td className="nums px-5 py-3.5 text-right font-mono text-secondary">
                    {t.nightsMTD}
                  </td>
                  <td className="nums px-5 py-3.5 text-right font-mono font-semibold text-primary">
                    {t.mrr}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-muted">
                    {t.joined}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <ChevronRightIcon
                      size={16}
                      className="inline text-muted"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border px-5 py-3.5 text-[12.5px] text-muted">
          Showing {tenants.length} of {tenantTotal} campsites
        </div>
      </Card>

      <TenantDrawer tenant={active} onClose={() => setActive(null)} />
    </>
  );
}
