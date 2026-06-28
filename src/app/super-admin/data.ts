/* Placeholder data for the Super Admin (Platform Console) portal demo.
   No backend. Touseef Zahid operating the Pakkia platform across every
   campsite tenant, mid-June 2026. Mirrors the shape of the other portals. */

import type { PortalNotification } from "@/components/dashboard/types";

export const platform = { name: "Pakkia", scope: "Platform" };

export const admin = {
  name: "Touseef Zahid",
  firstName: "Touseef",
  role: "Super admin",
  initials: "TZ",
  email: "touseef@pakkia.fi",
};

/* ---------- Dashboard KPIs ---------- */

export type Kpi = {
  label: string;
  value: string;
  unit?: string;
  hint: string;
  tone: "up" | "warn" | "flat";
};

export const overviewKpis: Kpi[] = [
  { label: "Active campsites", value: "11", unit: "/ 14", hint: "+2 this month", tone: "up" },
  { label: "Monthly recurring", value: "€512", hint: "+€78 vs May", tone: "up" },
  { label: "Nights logged (all)", value: "18,420", hint: "across 14 sites", tone: "flat" },
  { label: "Trials ending", value: "2", hint: "this week", tone: "warn" },
];

/* ---------- MRR trend (bar chart) ---------- */

export const mrrTrend = [
  { label: "Jan", value: 180 },
  { label: "Feb", value: 232 },
  { label: "Mar", value: 300 },
  { label: "Apr", value: 372 },
  { label: "May", value: 434 },
  { label: "Jun", value: 512 },
];

/* ---------- Plan mix (donut) ---------- */

export type PlanSlice = { label: string; count: number; color: string };

export const planMix: PlanSlice[] = [
  { label: "Standard", count: 5, color: "var(--color-primary)" },
  { label: "Starter", count: 4, color: "var(--color-occ-2)" },
  { label: "Multi-site", count: 2, color: "var(--color-amber)" },
];

export const planMixTotal = planMix.reduce((s, p) => s + p.count, 0);

/* ---------- Needs attention ---------- */

export type AttentionTone = "trial" | "warn" | "danger";
export type AttentionItem = {
  name: string;
  slug: string;
  initials: string;
  flag: string;
  flagTone: AttentionTone;
  action: string;
};

export const needsAttention: AttentionItem[] = [
  { name: "Saimaa Camping", slug: "saimaa.pakkia.fi", initials: "SC", flag: "Trial ends 2d", flagTone: "trial", action: "Convert" },
  { name: "Turku Seaside", slug: "turku.pakkia.fi", initials: "TS", flag: "Trial ends 5d", flagTone: "trial", action: "Convert" },
  { name: "Pyhä Camping", slug: "pyha.pakkia.fi", initials: "PC", flag: "Payment failed", flagTone: "danger", action: "Review" },
  { name: "Hossa Wilderness", slug: "hossa.pakkia.fi", initials: "HW", flag: "No entries 7d", flagTone: "warn", action: "Nudge" },
];

/* ---------- Recent platform activity ---------- */

export type ActivityKind = "upgrade" | "provision" | "export" | "invoice";
export type ActivityItem = {
  id: string;
  kind: ActivityKind;
  text: string;
  highlight: string;
  tail?: string;
  time: string;
};

export const recentActivity: ActivityItem[] = [
  { id: "a1", kind: "upgrade", highlight: "Rairanta", text: "upgraded to", tail: "Standard", time: "1h" },
  { id: "a2", kind: "provision", highlight: "Turku Seaside", text: "new trial provisioned", time: "5h" },
  { id: "a3", kind: "export", highlight: "Koli Resort", text: "exported a seasonal report", time: "Yesterday" },
  { id: "a4", kind: "invoice", highlight: "Levi Caravan Park", text: "invoice paid · €39", time: "Yesterday" },
];

/* ---------- Campsites (tenants) ---------- */

export type PlanName = "Starter" | "Standard" | "Multi-site" | "Trial";
export type TenantStatus = "Active" | "Trial" | "Suspended";

export type Tenant = {
  name: string;
  slug: string;
  initials: string;
  plan: PlanName;
  status: TenantStatus;
  pitches: number;
  users: number;
  nightsMTD: string;
  mrr: string;
  admin: string;
  email: string;
  joined: string;
  nextInvoice: string;
};

export const tenants: Tenant[] = [
  { name: "Rairanta", slug: "rairanta", initials: "RA", plan: "Standard", status: "Active", pitches: 60, users: 6, nightsMTD: "1,284", mrr: "€39", admin: "Olli Virtanen", email: "olli@rairanta.fi", joined: "May 2026", nextInvoice: "01 Jul 2026" },
  { name: "Koli Resort", slug: "koli", initials: "KR", plan: "Multi-site", status: "Active", pitches: 120, users: 11, nightsMTD: "2,940", mrr: "€79", admin: "Anna Mäkelä", email: "anna@koli.fi", joined: "Mar 2026", nextInvoice: "01 Jul 2026" },
  { name: "Inari Lakeside", slug: "inari", initials: "IL", plan: "Standard", status: "Active", pitches: 72, users: 7, nightsMTD: "1,610", mrr: "€39", admin: "Jukka Salo", email: "jukka@inari.fi", joined: "Feb 2026", nextInvoice: "01 Jul 2026" },
  { name: "Levi Caravan Park", slug: "levi", initials: "LV", plan: "Standard", status: "Active", pitches: 80, users: 8, nightsMTD: "1,980", mrr: "€39", admin: "Riikka Aho", email: "riikka@levi.fi", joined: "Jan 2026", nextInvoice: "01 Jul 2026" },
  { name: "Nuuksio Camping", slug: "nuuksio", initials: "NU", plan: "Starter", status: "Active", pitches: 18, users: 2, nightsMTD: "520", mrr: "€19", admin: "Timo Koski", email: "timo@nuuksio.fi", joined: "Apr 2026", nextInvoice: "01 Jul 2026" },
  { name: "Saimaa Camping", slug: "saimaa", initials: "SC", plan: "Trial", status: "Trial", pitches: 34, users: 3, nightsMTD: "410", mrr: "€0", admin: "Heikki Aalto", email: "heikki@saimaa.fi", joined: "Jun 2026", nextInvoice: "Trial · 2d left" },
  { name: "Turku Seaside", slug: "turku", initials: "TS", plan: "Trial", status: "Trial", pitches: 40, users: 4, nightsMTD: "290", mrr: "€0", admin: "Sanna Lehto", email: "sanna@turku.fi", joined: "Jun 2026", nextInvoice: "Trial · 5d left" },
  { name: "Pyhä Camping", slug: "pyha", initials: "PC", plan: "Starter", status: "Suspended", pitches: 22, users: 2, nightsMTD: "0", mrr: "€19", admin: "Ville Räsänen", email: "ville@pyha.fi", joined: "Apr 2026", nextInvoice: "Overdue" },
];

export const tenantTotal = 14;

/* ---------- Billing ---------- */

export const billingKpis: Kpi[] = [
  { label: "MRR", value: "€512", hint: "+18% MoM", tone: "up" },
  { label: "ARR (run-rate)", value: "€6,144", hint: "projected", tone: "flat" },
  { label: "Paid subscriptions", value: "11", hint: "+2 this quarter", tone: "up" },
  { label: "Trial → paid", value: "64", unit: "%", hint: "last 90 days", tone: "up" },
];

export type InvoiceStatus = "Paid" | "Payment due";
export type Invoice = {
  id: string;
  tenant: string;
  initials: string;
  plan: PlanName;
  amount: string;
  date: string;
  status: InvoiceStatus;
};

export const invoices: Invoice[] = [
  { id: "i1", tenant: "Rairanta", initials: "RA", plan: "Standard", amount: "€39.00", date: "01 Jun 2026", status: "Paid" },
  { id: "i2", tenant: "Koli Resort", initials: "KR", plan: "Multi-site", amount: "€79.00", date: "01 Jun 2026", status: "Paid" },
  { id: "i3", tenant: "Levi Caravan Park", initials: "LV", plan: "Standard", amount: "€39.00", date: "01 Jun 2026", status: "Paid" },
  { id: "i4", tenant: "Nuuksio Camping", initials: "NU", plan: "Starter", amount: "€19.00", date: "01 Jun 2026", status: "Paid" },
  { id: "i5", tenant: "Pyhä Camping", initials: "PC", plan: "Starter", amount: "€19.00", date: "01 Jun 2026", status: "Payment due" },
];

/* ---------- Signups (leads) ---------- */

export type LeadStatus = "New" | "Contacted" | "Provisioned";
export type Lead = {
  id: string;
  name: string;
  contact: string;
  email: string;
  note: string;
  received: string;
  status: LeadStatus;
};

export const leads: Lead[] = [
  { id: "l1", name: "Saimaa Camping", contact: "Heikki Aalto", email: "heikki@saimaa.fi", note: "~40 pitches, using Excel", received: "2h ago", status: "New" },
  { id: "l2", name: "Kuusamo Lakeside", contact: "Liisa Hämäläinen", email: "liisa@kuusamo.fi", note: "Wants compliance export", received: "1d ago", status: "Contacted" },
  { id: "l3", name: "Vaasa Marina Camp", contact: "Pekka Järvinen", email: "pekka@vaasa.fi", note: "Small site, 16 pitches", received: "3d ago", status: "Provisioned" },
];

export const openLeads = leads.filter((l) => l.status !== "Provisioned").length;

/* ---------- Users (across all campsites) ---------- */

export type UserRole = "Administrator" | "Power user" | "Pitch holder";
export type UserStatus = "Active" | "Trial";
export type PlatformUser = {
  id: string;
  name: string;
  email: string;
  campsite: string;
  role: UserRole;
  status: UserStatus;
};

export const platformUsers: PlatformUser[] = [
  { id: "u1", name: "Olli Virtanen", email: "olli@rairanta.fi", campsite: "Rairanta", role: "Administrator", status: "Active" },
  { id: "u2", name: "Heikki Aalto", email: "heikki@saimaa.fi", campsite: "Saimaa Camping", role: "Administrator", status: "Trial" },
  { id: "u3", name: "Mikko Laine", email: "mikko.laine@rairanta.fi", campsite: "Rairanta", role: "Power user", status: "Active" },
  { id: "u4", name: "Anna Mäkelä", email: "anna@koli.fi", campsite: "Koli Resort", role: "Administrator", status: "Active" },
  { id: "u5", name: "Aino Korhonen", email: "aino.k@rairanta.fi", campsite: "Rairanta", role: "Pitch holder", status: "Active" },
];

/* ---------- System log ---------- */

export type LogEntry = {
  id: string;
  time: string;
  actor: string;
  event: string;
  campsite: string;
  detail: string;
};

export const systemLog: LogEntry[] = [
  { id: "g1", time: "19 Jun · 09:31", actor: "Touseef Zahid", event: "Logged in as admin", campsite: "Saimaa Camping", detail: "support session · 12 min" },
  { id: "g2", time: "19 Jun · 08:02", actor: "System", event: "Plan changed", campsite: "Rairanta", detail: "Starter → Standard" },
  { id: "g3", time: "18 Jun · 17:44", actor: "Touseef Zahid", event: "Provisioned tenant", campsite: "Turku Seaside", detail: "subdomain turku.pakkia.fi" },
  { id: "g4", time: "18 Jun · 11:20", actor: "System", event: "Payment failed", campsite: "Pyhä Camping", detail: "retry scheduled" },
  { id: "g5", time: "17 Jun · 14:05", actor: "Touseef Zahid", event: "Suspended tenant", campsite: "Demo Camp", detail: "reason: trial expired" },
];

/* ---------- Platform settings ---------- */

export type PlanConfig = { name: PlanName; price: string; pitchLimit: string };

export const planConfigs: PlanConfig[] = [
  { name: "Starter", price: "19", pitchLimit: "25" },
  { name: "Standard", price: "39", pitchLimit: "80" },
  { name: "Multi-site", price: "79", pitchLimit: "∞" },
];

export const platformSettings = {
  retention: "6 years",
  emailSender: "hello@pakkia.fi",
  trialDays: "30",
  footerCredit: "Powered by Growth Nexus",
};

/* ---------- Notifications (platform-appropriate) ---------- */

export const notifications: PortalNotification[] = [
  {
    id: "sn1",
    title: "Saimaa Camping's trial ends in 2 days — worth converting.",
    time: "Today, 09:40",
    unread: true,
  },
  {
    id: "sn2",
    title: "Payment failed for Pyhä Camping — a retry is scheduled.",
    time: "Today, 08:15",
    unread: true,
  },
  {
    id: "sn3",
    title: "Turku Seaside was provisioned as a new trial tenant.",
    time: "5h ago",
    unread: true,
  },
  {
    id: "sn4",
    title: "Rairanta upgraded from Starter to Standard.",
    time: "Yesterday",
  },
];

/* ---------- Shared tone helpers ---------- */

type BadgeTone = "neutral" | "primary" | "amber" | "success" | "dark";

export function planTone(plan: PlanName): BadgeTone {
  if (plan === "Multi-site") return "amber";
  if (plan === "Standard") return "primary";
  if (plan === "Trial") return "amber";
  return "neutral";
}

export function statusTone(status: TenantStatus | UserStatus): BadgeTone {
  if (status === "Active") return "success";
  if (status === "Trial") return "amber";
  return "neutral"; // Suspended
}
