"use client";

/* Add-campsite drawer (PORTAL_SPEC B1.2d) — provisions a tenant and invites
   its Administrator. Live subdomain preview + availability check. Every
   submit writes an audit row + a success toast (the dashboard's inline form
   moved entirely into this drawer). Shared by the dashboard and campsites. */

import { useEffect, useMemo, useState } from "react";
import {
  Drawer,
  Field,
  RuledRadioGroup,
  SplitButton,
  UnderlineInput,
  useAudit,
  useToast,
} from "@/components/portal";
import { admin, tenants } from "../data";

const RESERVED = new Set(["www", "app", "admin", "api", "mail", "pakkia"]);
const taken = new Set(tenants.map((t) => t.slug));

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type Plan = "trial" | "starter" | "standard" | "multi";

export function AddCampsiteDrawer({
  open,
  onClose,
  prefill,
}: {
  open: boolean;
  onClose: () => void;
  prefill?: { name?: string; email?: string };
}) {
  const toast = useToast();
  const { log } = useAudit();
  const [name, setName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [subTouched, setSubTouched] = useState(false);
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<Plan>("trial");

  // Reset / apply prefill each time the drawer opens.
  useEffect(() => {
    if (!open) return;
    setName(prefill?.name ?? "");
    setSubdomain(prefill?.name ? slugify(prefill.name) : "");
    setSubTouched(false);
    setEmail(prefill?.email ?? "");
    setPlan("trial");
  }, [open, prefill]);

  // Subdomain tracks the name until the user edits it directly.
  const effectiveSub = subTouched ? subdomain : slugify(name);
  const availability = useMemo(() => {
    const s = effectiveSub;
    if (!s) return null;
    if (RESERVED.has(s) || taken.has(s)) return "taken" as const;
    return "available" as const;
  }, [effectiveSub]);

  const canSubmit = name.trim() && effectiveSub && email.trim() && availability === "available";

  const submit = () => {
    if (!canSubmit) return;
    log({
      actor: admin.name,
      actorInitials: admin.initials,
      event: "Provisioned tenant",
      target: name.trim(),
      detail: `subdomain ${effectiveSub}.pakkia.fi · ${plan}`,
      tone: "record",
    });
    log({
      actor: admin.name,
      actorInitials: admin.initials,
      event: "Appointed administrator",
      target: name.trim(),
      detail: `${email.trim()} invited`,
      tone: "record",
    });
    toast({ message: `${name.trim()} provisioned · invite sent`, variant: "success" });
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Add campsite"
      description="Provision a new tenant and invite its Administrator."
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="text-[0.9375rem] font-medium text-ink-900 underline decoration-line decoration-1 underline-offset-[6px] transition-colors hover:text-pine-700 hover:decoration-amber-500"
          >
            Cancel
          </button>
          <SplitButton size="compact" label="Create campsite" onClick={submit} disabled={!canSubmit} />
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <Field label="Campsite name" htmlFor="ac-name">
          <UnderlineInput
            id="ac-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Saimaa Camping"
          />
        </Field>

        <Field
          label="Subdomain"
          htmlFor="ac-sub"
          hint={
            <span className="flex items-center gap-2 font-spline">
              <span className="text-ink-muted">→ {effectiveSub || "your-site"}.pakkia.fi</span>
              {availability === "available" && (
                <span className="text-pine-700">✓ available</span>
              )}
              {availability === "taken" && <span className="text-terracotta">× taken</span>}
            </span>
          }
        >
          <UnderlineInput
            id="ac-sub"
            mono
            value={effectiveSub}
            onChange={(e) => {
              setSubTouched(true);
              setSubdomain(slugify(e.target.value));
            }}
            placeholder="saimaa"
          />
        </Field>

        <Field
          label="Administrator email"
          htmlFor="ac-email"
          hint="They'll receive an invite with a magic link to set up the campsite."
        >
          <UnderlineInput
            id="ac-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="owner@site.fi"
          />
        </Field>

        <Field label="Plan">
          <RuledRadioGroup
            name="ac-plan"
            legend="Plan"
            value={plan}
            onChange={setPlan}
            options={[
              { value: "trial", label: "Trial", hint: "30 days, no card required" },
              { value: "starter", label: "Starter", hint: "€19 / mo · up to 25 pitches" },
              { value: "standard", label: "Standard", hint: "€39 / mo · up to 80 pitches" },
              { value: "multi", label: "Multi-site", hint: "€79 / mo · unlimited pitches" },
            ]}
          />
        </Field>
      </div>
    </Drawer>
  );
}
