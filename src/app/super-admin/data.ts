/* Placeholder data for the Super Admin (Platform Console) portal demo.
   No backend. Touseef Zahid operating Pakkia — the platform owned by Growth
   Nexus — across every campsite tenant, mid-June 2026. Super Admin sits ABOVE
   individual campsites: it provisions tenants, appoints each campsite's
   Administrator, owns subscriptions and reads a platform-wide audit trail.
   Rairanta is Tenant #1. Mirrors the shape of the other portals. */

import type { PortalNotification } from "@/components/dashboard/types";

export const platform = { name: "Pakkia", scope: "Platform", owner: "Growth Nexus" };

export const admin = {
  name: "Touseef Zahid",
  firstName: "Touseef",
  role: "Super admin",
  initials: "TZ",
  email: "touseef@growthnexus.fi",
};

/* ---------- Shared badge tones ---------- */

type BadgeTone = "neutral" | "primary" | "amber" | "success" | "dark";

/* ---------- Campsites (tenants) ---------- */

export type PlanName = "Starter" | "Standard" | "Multi-site" | "Trial";
export type TenantStatus = "Active" | "Trial" | "Suspended";

export type Tenant = {
  /** Stable id used in the campsite detail route. */
  slug: string;
  name: string;
  initials: string;
  region: string;
  plan: PlanName;
  status: TenantStatus;
  pitches: number;
  users: number;
  nightsMTD: string;
  mrr: string;
  /** Appointed campsite Administrator. */
  admin: string;
  email: string;
  joined: string;
  nextInvoice: string;
};

/* Rairanta is Tenant #1 — listed first. */
export const tenants: Tenant[] = [
  { slug: "rairanta", name: "Rairanta", initials: "RA", region: "Lakeland · Savonlinna", plan: "Standard", status: "Active", pitches: 60, users: 6, nightsMTD: "1,284", mrr: "€39", admin: "Olli Virtanen", email: "olli@rairanta.fi", joined: "May 2026", nextInvoice: "01 Jul 2026" },
  { slug: "koli", name: "Koli Resort", initials: "KR", region: "North Karelia · Koli", plan: "Multi-site", status: "Active", pitches: 120, users: 11, nightsMTD: "2,940", mrr: "€79", admin: "Anna Mäkelä", email: "anna@koli.fi", joined: "Mar 2026", nextInvoice: "01 Jul 2026" },
  { slug: "inari", name: "Inari Lakeside", initials: "IL", region: "Lapland · Inari", plan: "Standard", status: "Active", pitches: 72, users: 7, nightsMTD: "1,610", mrr: "€39", admin: "Jukka Salo", email: "jukka@inari.fi", joined: "Feb 2026", nextInvoice: "01 Jul 2026" },
  { slug: "levi", name: "Levi Caravan Park", initials: "LV", region: "Lapland · Kittilä", plan: "Standard", status: "Active", pitches: 80, users: 8, nightsMTD: "1,980", mrr: "€39", admin: "Riikka Aho", email: "riikka@levi.fi", joined: "Jan 2026", nextInvoice: "01 Jul 2026" },
  { slug: "nuuksio", name: "Nuuksio Camping", initials: "NU", region: "Uusimaa · Espoo", plan: "Starter", status: "Active", pitches: 18, users: 2, nightsMTD: "520", mrr: "€19", admin: "Timo Koski", email: "timo@nuuksio.fi", joined: "Apr 2026", nextInvoice: "01 Jul 2026" },
  { slug: "saimaa", name: "Saimaa Camping", initials: "SC", region: "Lakeland · Lappeenranta", plan: "Trial", status: "Trial", pitches: 34, users: 3, nightsMTD: "410", mrr: "€0", admin: "Heikki Aalto", email: "heikki@saimaa.fi", joined: "Jun 2026", nextInvoice: "Trial · 2d left" },
  { slug: "turku", name: "Turku Seaside", initials: "TS", region: "Archipelago · Turku", plan: "Trial", status: "Trial", pitches: 40, users: 4, nightsMTD: "290", mrr: "€0", admin: "Sanna Lehto", email: "sanna@turku.fi", joined: "Jun 2026", nextInvoice: "Trial · 5d left" },
  { slug: "pyha", name: "Pyhä Camping", initials: "PC", region: "Lapland · Pelkosenniemi", plan: "Starter", status: "Suspended", pitches: 22, users: 2, nightsMTD: "0", mrr: "€19", admin: "Ville Räsänen", email: "ville@pyha.fi", joined: "Apr 2026", nextInvoice: "Overdue" },
];

export const tenantTotal = 14;

export function getTenantBySlug(slug: string): Tenant | undefined {
  return tenants.find((t) => t.slug === slug);
}

/* ---------- Platform-wide totals (dashboard KPIs) ---------- */

export type Kpi = {
  label: string;
  value: string;
  unit?: string;
  hint: string;
  tone: "up" | "warn" | "flat";
};

export const overviewKpis: Kpi[] = [
  { label: "Campsites", value: "11", unit: "/ 14", hint: "+2 onboarded this month", tone: "up" },
  { label: "Total pitches", value: "1,240", hint: "across 14 tenants", tone: "flat" },
  { label: "Nights logged (all)", value: "18,420", hint: "+1,284 this month", tone: "up" },
  { label: "Active users", value: "182", hint: "+9 this week", tone: "up" },
];

/* ---------- Revenue trend (bar chart) ---------- */

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
  { name: "Saimaa Camping", slug: "saimaa", initials: "SC", flag: "Trial ends 2d", flagTone: "trial", action: "Convert" },
  { name: "Turku Seaside", slug: "turku", initials: "TS", flag: "Trial ends 5d", flagTone: "trial", action: "Convert" },
  { name: "Pyhä Camping", slug: "pyha", initials: "PC", flag: "Payment failed", flagTone: "danger", action: "Review" },
  { name: "Nuuksio Camping", slug: "nuuksio", initials: "NU", flag: "No entries 7d", flagTone: "warn", action: "Nudge" },
];

/* ---------- Recent platform activity ---------- */

export type ActivityKind = "upgrade" | "provision" | "export" | "invoice" | "admin";
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
  { id: "a2", kind: "admin", highlight: "Sanna Lehto", text: "appointed Administrator of", tail: "Turku Seaside", time: "4h" },
  { id: "a3", kind: "provision", highlight: "Turku Seaside", text: "new trial provisioned", time: "5h" },
  { id: "a4", kind: "export", highlight: "Koli Resort", text: "exported a seasonal report", time: "Yesterday" },
  { id: "a5", kind: "invoice", highlight: "Levi Caravan Park", text: "invoice paid · €39", time: "Yesterday" },
];

/* ---------- Recent signups (inbound leads from pakkia.fi) ---------- */

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
  { id: "l1", name: "Kuusamo Lakeside", contact: "Liisa Hämäläinen", email: "liisa@kuusamo.fi", note: "~40 pitches, on a spreadsheet today", received: "2h ago", status: "New" },
  { id: "l2", name: "Vaasa Marina Camp", contact: "Pekka Järvinen", email: "pekka@vaasa.fi", note: "Small site, 16 pitches", received: "1d ago", status: "Contacted" },
  { id: "l3", name: "Hossa Wilderness", contact: "Marja Niemelä", email: "marja@hossa.fi", note: "Wants compliance export", received: "3d ago", status: "New" },
];

export const openLeads = leads.filter((l) => l.status !== "Provisioned").length;

/* ---------- Administrators (one per campsite) ---------- */

export type AdminStatus = "Active" | "Invited" | "Blocked";

export type Administrator = {
  id: string;
  name: string;
  initials: string;
  email: string;
  campsite: string;
  campsiteSlug: string;
  status: AdminStatus;
  lastActive: string;
  twoFactor: boolean;
};

function adminStatusFor(t: Tenant): AdminStatus {
  if (t.status === "Suspended") return "Blocked";
  if (t.status === "Trial") return "Invited";
  return "Active";
}

const LAST_ACTIVE = ["12 min ago", "2h ago", "Today, 08:14", "Yesterday", "3 days ago", "5 days ago"];

export const administrators: Administrator[] = tenants.map((t, i) => {
  const status = adminStatusFor(t);
  return {
    id: `adm-${t.slug}`,
    name: t.admin,
    initials: t.admin
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    email: t.email,
    campsite: t.name,
    campsiteSlug: t.slug,
    status,
    lastActive:
      status === "Invited" ? "Invite pending" : status === "Blocked" ? "—" : LAST_ACTIVE[i % LAST_ACTIVE.length],
    twoFactor: status === "Active" && i % 4 !== 0,
  };
});

export const adminCounts = {
  active: administrators.filter((a) => a.status === "Active").length,
  invited: administrators.filter((a) => a.status === "Invited").length,
  blocked: administrators.filter((a) => a.status === "Blocked").length,
};

/* ---------- Subscriptions ---------- */

export const subscriptionKpis: Kpi[] = [
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

/* ---------- Audit log (platform-wide) ---------- */

export type AuditEntry = {
  id: string;
  time: string;
  actor: string;
  event: string;
  campsite: string;
  detail: string;
};

export const auditLog: AuditEntry[] = [
  { id: "g1", time: "19 Jun · 09:31", actor: "Touseef Zahid", event: "Signed in as admin", campsite: "Saimaa Camping", detail: "support session · 12 min" },
  { id: "g2", time: "19 Jun · 08:02", actor: "System", event: "Plan changed", campsite: "Rairanta", detail: "Starter → Standard" },
  { id: "g3", time: "18 Jun · 17:44", actor: "Touseef Zahid", event: "Provisioned tenant", campsite: "Turku Seaside", detail: "subdomain turku.pakkia.fi" },
  { id: "g4", time: "18 Jun · 17:46", actor: "Touseef Zahid", event: "Appointed administrator", campsite: "Turku Seaside", detail: "sanna@turku.fi invited" },
  { id: "g5", time: "18 Jun · 11:20", actor: "System", event: "Payment failed", campsite: "Pyhä Camping", detail: "retry scheduled" },
  { id: "g6", time: "17 Jun · 14:05", actor: "Touseef Zahid", event: "Suspended tenant", campsite: "Pyhä Camping", detail: "reason: payment overdue" },
  { id: "g7", time: "16 Jun · 10:12", actor: "System", event: "Backup completed", campsite: "All tenants", detail: "EU · Frankfurt · nightly" },
];

/* ---------- Per-tenant detail (campsite drill-down) ---------- */

export type UserRole = "Administrator" | "Power user" | "Pitch holder";

export type AreaRow = { name: string; pitches: number; occupied: number };
export type TeamMember = {
  name: string;
  email: string;
  role: UserRole;
  status: AdminStatus;
};
export type TenantDetail = {
  areas: AreaRow[];
  team: TeamMember[];
  roleBreakdown: { admins: number; power: number; holders: number };
  usageTrend: { label: string; value: number }[];
  summary: {
    nightsAllTime: string;
    occupancy: number;
    peakNight: number;
    lastEntry: string;
  };
};

const WEEK_LABELS = ["W20", "W21", "W22", "W23", "W24", "W25"];

/* Hand-authored team for Rairanta (Tenant #1) — real names shared with the
   Admin / Power User / Pitch Holder portals so the platform reads coherently. */
const RAIRANTA_TEAM: TeamMember[] = [
  { name: "Olli Virtanen", email: "olli@rairanta.fi", role: "Administrator", status: "Active" },
  { name: "Mikko Laine", email: "mikko.laine@rairanta.fi", role: "Power user", status: "Active" },
  { name: "Aino Korhonen", email: "aino.k@rairanta.fi", role: "Pitch holder", status: "Active" },
  { name: "Satu Niemi", email: "satu.niemi@rairanta.fi", role: "Pitch holder", status: "Invited" },
  { name: "Janne Mäkinen", email: "janne.m@rairanta.fi", role: "Pitch holder", status: "Active" },
];

function defaultTeam(t: Tenant): TeamMember[] {
  const adminStatus = adminStatusFor(t);
  const liveStatus: AdminStatus = t.status === "Suspended" ? "Blocked" : "Active";
  const team: TeamMember[] = [
    { name: t.admin, email: t.email, role: "Administrator", status: adminStatus },
  ];
  if (t.users >= 3) {
    team.push({
      name: "Front-desk staff",
      email: `desk@${t.slug}.fi`,
      role: "Power user",
      status: liveStatus,
    });
  }
  return team;
}

function buildDetail(t: Tenant): TenantDetail {
  const occ = t.status === "Suspended" ? 0 : t.status === "Trial" ? 0.42 : 0.64;

  const areaNames =
    t.pitches >= 90
      ? ["A · Lakeside", "B · Forest edge", "C · Meadow", "D · Riverside"]
      : t.pitches >= 45
        ? ["A · Lakeside", "B · Forest edge", "C · Meadow"]
        : ["A · Lakeside", "B · Forest edge"];

  const base = Math.floor(t.pitches / areaNames.length);
  let rem = t.pitches - base * areaNames.length;
  const areas: AreaRow[] = areaNames.map((name) => {
    const pitches = base + (rem-- > 0 ? 1 : 0);
    return { name, pitches, occupied: Math.round(pitches * occ) };
  });

  const admins = 1;
  const power = t.users >= 3 ? 1 : 0;
  const holders = Math.max(0, t.users - admins - power);

  const nightsMTD = Number(t.nightsMTD.replace(/,/g, "")) || 0;
  const usageTrend = WEEK_LABELS.map((label, i) => ({
    label,
    value: t.status === "Suspended" ? 0 : Math.round((nightsMTD / 4) * (0.72 + 0.1 * i)),
  }));

  const allTime = Math.round(nightsMTD * (t.status === "Active" ? 7.5 : 1.4));

  return {
    areas,
    team: t.slug === "rairanta" ? RAIRANTA_TEAM : defaultTeam(t),
    roleBreakdown: { admins, power, holders },
    usageTrend,
    summary: {
      nightsAllTime: allTime.toLocaleString("en-US"),
      occupancy: Math.round(occ * 100),
      peakNight: t.status === "Suspended" ? 0 : Math.max(4, Math.round(t.pitches * occ * 0.18)),
      lastEntry:
        t.status === "Suspended" ? "No entries · suspended" : t.status === "Trial" ? "Yesterday" : "Today, 21:14",
    },
  };
}

export function getTenantDetail(t: Tenant): TenantDetail {
  return buildDetail(t);
}

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
    title: "Sanna Lehto accepted the Administrator invite for Turku Seaside.",
    time: "5h ago",
    unread: true,
  },
  {
    id: "sn4",
    title: "Rairanta upgraded from Starter to Standard.",
    time: "Yesterday",
  },
];

/* ---------- Tone helpers ---------- */

export function planTone(plan: PlanName): BadgeTone {
  if (plan === "Multi-site") return "amber";
  if (plan === "Standard") return "primary";
  if (plan === "Trial") return "amber";
  return "neutral";
}

export function statusTone(status: TenantStatus): BadgeTone {
  if (status === "Active") return "success";
  if (status === "Trial") return "amber";
  return "neutral"; // Suspended
}

export function adminStatusTone(status: AdminStatus): BadgeTone {
  if (status === "Active") return "success";
  if (status === "Invited") return "amber";
  return "neutral"; // Blocked
}

export const ROLE_TONE: Record<UserRole, BadgeTone> = {
  Administrator: "primary",
  "Power user": "neutral",
  "Pitch holder": "neutral",
};
