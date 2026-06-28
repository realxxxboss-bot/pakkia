"use client";

import { useState } from "react";
import {
  Badge,
  DataTable,
  PageHeader,
  type Column,
} from "@/components/dashboard/primitives";
import {
  Sheet,
  SheetCancel,
  SheetField,
  SheetSave,
  sheetControl,
} from "@/components/power-user/Sheet";
import { leads, type Lead, type LeadStatus } from "../data";

const STATUS_TONE: Record<LeadStatus, "neutral" | "primary" | "amber" | "success"> = {
  New: "amber",
  Contacted: "primary",
  Provisioned: "success",
};

export default function SuperAdminSignups() {
  const [lead, setLead] = useState<Lead | null>(null);

  const columns: Column<Lead>[] = [
    {
      key: "name",
      header: "Campsite",
      className: "font-semibold text-ink",
      render: (r) => r.name,
    },
    { key: "contact", header: "Contact", render: (r) => r.contact },
    {
      key: "email",
      header: "Email",
      className: "text-muted text-[13px]",
      render: (r) => r.email,
    },
    {
      key: "note",
      header: "Note",
      className: "text-muted text-[13px]",
      render: (r) => r.note,
    },
    {
      key: "received",
      header: "Received",
      className: "text-muted text-[13px]",
      render: (r) => r.received,
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <Badge tone={STATUS_TONE[r.status]} dot>{r.status}</Badge>,
    },
    {
      key: "action",
      header: "",
      align: "right",
      render: (r) =>
        r.status === "Provisioned" ? (
          <button
            type="button"
            className="rounded-[9px] px-3 py-1.5 text-[13px] font-semibold text-secondary ring-1 ring-border transition-colors duration-150 hover:bg-subtle hover:text-ink"
          >
            View site
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setLead(r)}
            className="rounded-[9px] bg-primary px-3 py-1.5 text-[13px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.98]"
          >
            Provision
          </button>
        ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Signups"
        subtitle='Requests from the "Start free" form on pakkia.fi. Provision a tenant to turn a lead into a live campsite.'
      />

      <DataTable
        columns={columns}
        rows={leads}
        getRowKey={(r) => r.id}
        caption="Inbound signup requests"
      />

      <Sheet
        open={lead !== null}
        onClose={() => setLead(null)}
        title="Provision tenant"
        description="A trial tenant is created and an invite email is sent to the admin automatically."
        footer={
          <>
            <SheetCancel onClick={() => setLead(null)} />
            <SheetSave onClick={() => setLead(null)}>Provision &amp; invite</SheetSave>
          </>
        }
      >
        <div key={lead?.id ?? "empty"} className="flex flex-col gap-4">
          <SheetField label="Campsite name" htmlFor="pv-name">
            <input
              id="pv-name"
              className={sheetControl}
              defaultValue={lead?.name ?? ""}
            />
          </SheetField>
          <SheetField label="Subdomain" htmlFor="pv-sub">
            <input
              id="pv-sub"
              className={sheetControl}
              defaultValue={lead?.name.split(" ")[0].toLowerCase() ?? ""}
            />
            <span className="text-[12px] text-muted">
              → {lead?.name.split(" ")[0].toLowerCase() ?? "site"}.pakkia.fi
            </span>
          </SheetField>
          <SheetField label="Admin email" htmlFor="pv-email">
            <input
              id="pv-email"
              type="email"
              className={sheetControl}
              defaultValue={lead?.email ?? ""}
            />
          </SheetField>
        </div>
      </Sheet>
    </>
  );
}
