"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge, Card, PageHeader } from "@/components/dashboard/primitives";
import {
  CheckIcon,
  PlusIcon,
  SearchIcon,
  ShieldIcon,
} from "@/components/dashboard/icons";
import {
  Sheet,
  SheetCancel,
  SheetField,
  SheetSave,
  sheetControl,
} from "@/components/power-user/Sheet";
import {
  adminCounts,
  administrators,
  adminStatusTone,
  tenants,
  type Administrator,
} from "../data";

function CountCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "primary" | "amber" | "neutral";
}) {
  const ring =
    tone === "primary"
      ? "text-primary"
      : tone === "amber"
        ? "text-amber-ink"
        : "text-muted";
  return (
    <div className="rounded-[14px] border border-border bg-surface p-5 shadow-xs">
      <p className="font-eyebrow text-[10px] font-semibold tracking-[0.1em] text-muted uppercase">
        {label}
      </p>
      <p className={`nums mt-2 font-mono text-[28px] font-semibold tracking-[-0.02em] ${ring}`}>
        {value}
      </p>
    </div>
  );
}

export default function SuperAdminAdministrators() {
  const [appointOpen, setAppointOpen] = useState(false);
  const [blockTarget, setBlockTarget] = useState<Administrator | null>(null);

  return (
    <>
      <PageHeader
        title="Administrators"
        subtitle="Every campsite has one Administrator you appoint. They run their own site — pitches, staff and reporting — while you manage them here."
        actions={
          <button
            type="button"
            onClick={() => setAppointOpen(true)}
            className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-4 py-2.5 text-[14.5px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.98]"
          >
            <PlusIcon size={17} />
            Appoint administrator
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-3 gap-4">
        <CountCard label="Active" value={adminCounts.active} tone="primary" />
        <CountCard label="Invited" value={adminCounts.invited} tone="amber" />
        <CountCard label="Blocked" value={adminCounts.blocked} tone="neutral" />
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <label className="flex min-w-[200px] flex-1 items-center gap-2.5 rounded-[10px] bg-surface px-3.5 py-2.5 ring-1 ring-border focus-within:ring-2 focus-within:ring-primary/40 sm:max-w-[340px]">
          <SearchIcon size={16} className="flex-none text-muted" />
          <input
            type="search"
            placeholder="Search administrator, email or campsite…"
            className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-muted"
          />
        </label>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[14.5px]">
            <caption className="sr-only">Platform administrators</caption>
            <thead>
              <tr className="border-b border-border">
                {["Administrator", "Campsite", "2FA", "Last active", "Status", ""].map(
                  (h) => (
                    <th
                      key={h || "act"}
                      scope="col"
                      className="px-5 py-3.5 text-left font-eyebrow text-[10.5px] font-semibold tracking-[0.08em] text-muted uppercase"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {administrators.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-border last:border-0 transition-colors duration-150 hover:bg-subtle/60"
                >
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-3">
                      <span
                        className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-primary-tint font-heading text-[12px] font-semibold text-primary-dark"
                        aria-hidden
                      >
                        {a.initials}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-ink">
                          {a.name}
                        </span>
                        <span className="block truncate text-[12px] text-muted">
                          {a.email}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/super-admin/campsites/${a.campsiteSlug}`}
                      className="font-medium text-secondary transition-colors hover:text-primary"
                    >
                      {a.campsite}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5">
                    {a.twoFactor ? (
                      <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-success">
                        <CheckIcon size={15} /> On
                      </span>
                    ) : (
                      <span className="text-[13px] text-muted">Off</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-muted">
                    {a.lastActive}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge tone={adminStatusTone(a.status)} dot>
                      {a.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {a.status === "Blocked" ? (
                      <button
                        type="button"
                        className="rounded-[9px] px-3 py-1.5 text-[13px] font-semibold text-primary ring-1 ring-border transition-colors duration-150 hover:bg-subtle"
                      >
                        Unblock
                      </button>
                    ) : a.status === "Invited" ? (
                      <button
                        type="button"
                        className="rounded-[9px] px-3 py-1.5 text-[13px] font-semibold text-secondary ring-1 ring-border transition-colors duration-150 hover:bg-subtle hover:text-ink"
                      >
                        Resend
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setBlockTarget(a)}
                        className="rounded-[9px] px-3 py-1.5 text-[13px] font-semibold text-error ring-1 ring-border transition-colors duration-150 hover:bg-error hover:text-white"
                      >
                        Block
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* appoint administrator */}
      <Sheet
        open={appointOpen}
        onClose={() => setAppointOpen(false)}
        title="Appoint administrator"
        description="Invite a person to administer a campsite. They get full control of that one tenant."
        footer={
          <>
            <SheetCancel onClick={() => setAppointOpen(false)} />
            <SheetSave onClick={() => setAppointOpen(false)}>Send invite</SheetSave>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <SheetField label="Campsite" htmlFor="ap-site">
            <select id="ap-site" className={sheetControl} defaultValue={tenants[0].slug}>
              {tenants.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </select>
          </SheetField>
          <SheetField label="Full name" htmlFor="ap-name">
            <input id="ap-name" className={sheetControl} placeholder="Olli Virtanen" />
          </SheetField>
          <SheetField label="Email" htmlFor="ap-email">
            <input
              id="ap-email"
              type="email"
              className={sheetControl}
              placeholder="admin@site.fi"
            />
            <span className="text-[12px] text-muted">
              An invite with a magic link is sent immediately.
            </span>
          </SheetField>
        </div>
      </Sheet>

      {/* block confirm */}
      <Sheet
        open={blockTarget !== null}
        onClose={() => setBlockTarget(null)}
        title="Block administrator"
        description={
          blockTarget
            ? `${blockTarget.name} loses access to ${blockTarget.campsite} immediately.`
            : ""
        }
        footer={
          <>
            <SheetCancel onClick={() => setBlockTarget(null)} />
            <SheetSave onClick={() => setBlockTarget(null)}>Block access</SheetSave>
          </>
        }
      >
        <div className="flex items-start gap-3 rounded-[12px] border border-amber/30 bg-amber/[0.08] px-4 py-3.5">
          <span className="mt-0.5 grid h-8 w-8 flex-none place-items-center rounded-[9px] bg-amber/20 text-amber-ink">
            <ShieldIcon size={16} />
          </span>
          <p className="text-[13.5px] leading-snug text-ink">
            The campsite keeps running, but no one can administer it until you
            appoint a replacement or unblock this account.
          </p>
        </div>
      </Sheet>
    </>
  );
}
