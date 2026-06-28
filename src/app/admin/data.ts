/* Placeholder data for the Admin (tenant) portal demo. No backend.
   Olli Virtanen administering the Rairanta campsite, mid-June 2026.
   Mirrors the shape of the other portal data files. */

import type { PortalNotification } from "@/components/dashboard/types";

export const tenant = {
  name: "Rairanta",
  subdomain: "rairanta.pakkia.fi",
  scope: "Admin",
};

export const admin = {
  name: "Olli Virtanen",
  firstName: "Olli",
  role: "Administrator",
  initials: "OV",
  email: "olli@rairanta.fi",
  phone: "+358 40 222 1180",
};

export const today = { label: "Good morning, Olli.", season: "2026" };

/* ---------- Dashboard KPIs ---------- */

export type Kpi = {
  label: string;
  value: string;
  unit?: string;
  hint: string;
  tone: "up" | "warn" | "flat";
};

export const dashboardKpis: Kpi[] = [
  { label: "Nights this month", value: "1,284", hint: "+12% vs May", tone: "up" },
  { label: "Occupancy rate", value: "68", unit: "%", hint: "+4 pts", tone: "up" },
  { label: "Active pitches", value: "54", unit: "/ 60", hint: "6 inactive this season", tone: "flat" },
  { label: "Entries pending today", value: "3", hint: "Needs attention", tone: "warn" },
];

/* ---------- Nights logged — daily bars for June 2026 ---------- */

export const nightsTrend = [
  28, 12, 34, 30, 46, 58, 40, 38, 22, 30, 52, 68, 72, 55, 82, 60, 18, 34, 46,
  38, 52, 64, 44, 40, 30, 48, 70, 58, 46, 42,
];

export const nightsAxis = ["Jun 1", "Jun 8", "Jun 15", "Jun 22", "Jun 30"];

/* ---------- Occupancy ---------- */

export const occupancy = {
  pct: 68,
  peak: "Sat 14 Jun · 92%",
};

/* ---------- Pitches needing today's entry ---------- */

export type PendingPitch = { code: string; area: string; holder: string };

export const pendingEntries: PendingPitch[] = [
  { code: "A-07", area: "Forest edge", holder: "Aino Korhonen" },
  { code: "B-14", area: "Shoreline", holder: "Mikko Laine" },
  { code: "C-02", area: "Meadow", holder: "Satu Niemi" },
];

/* ---------- Recent activity ---------- */

export type ActivityKind = "logged" | "edited" | "invited" | "exported";
export type ActivityItem = {
  id: string;
  kind: ActivityKind;
  highlight: string;
  text: string;
  tail?: string;
  time: string;
};

export const recentActivity: ActivityItem[] = [
  { id: "a1", kind: "logged", highlight: "A-12", text: "logged", tail: "7 persons for today", time: "2m" },
  { id: "a2", kind: "edited", highlight: "Mikko L.", text: "edited B-09 · 4 → 5", time: "1h" },
  { id: "a3", kind: "invited", highlight: "You", text: "invited", tail: "Satu Niemi as holder", time: "3h" },
  { id: "a4", kind: "exported", highlight: "You", text: "exported May monthly report", time: "Yesterday" },
];

/* ---------- Pitches ---------- */

export type PitchStatus = "Active" | "Inactive";
export type Pitch = {
  code: string;
  area: string;
  holder: string | null;
  holderEmail?: string;
  status: PitchStatus;
  nightsMTD: number;
};

export const pitches: Pitch[] = [
  { code: "A-12", area: "Lakeside", holder: "Olli Virtanen", holderEmail: "olli@rairanta.fi", status: "Active", nightsMTD: 112 },
  { code: "A-07", area: "Forest edge", holder: "Aino Korhonen", status: "Active", nightsMTD: 88 },
  { code: "B-09", area: "Shoreline", holder: "Mikko Laine", status: "Active", nightsMTD: 96 },
  { code: "B-14", area: "Shoreline", holder: "Mikko Laine", status: "Active", nightsMTD: 73 },
  { code: "C-02", area: "Meadow", holder: "Satu Niemi", status: "Active", nightsMTD: 54 },
  { code: "C-08", area: "Meadow", holder: null, status: "Inactive", nightsMTD: 0 },
  { code: "D-01", area: "Riverside", holder: "Janne Mäkinen", status: "Active", nightsMTD: 101 },
];

export const pitchTotal = 60;
export const areas = ["Lakeside", "Shoreline", "Forest edge", "Meadow", "Riverside"] as const;

/* ---------- Users & roles ---------- */

export type UserRole = "Administrator" | "Power user" | "Pitch holder";
export type UserStatus = "Active" | "Invited";
export type TenantUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  pitch: string;
  status: UserStatus;
};

export const users: TenantUser[] = [
  { id: "u1", name: "Olli Virtanen", email: "olli@rairanta.fi", role: "Administrator", pitch: "—", status: "Active" },
  { id: "u2", name: "Mikko Laine", email: "mikko.laine@rairanta.fi", role: "Power user", pitch: "B-09, B-14", status: "Active" },
  { id: "u3", name: "Aino Korhonen", email: "aino.k@rairanta.fi", role: "Pitch holder", pitch: "A-07", status: "Active" },
  { id: "u4", name: "Satu Niemi", email: "satu.niemi@rairanta.fi", role: "Pitch holder", pitch: "C-02", status: "Invited" },
  { id: "u5", name: "Janne Mäkinen", email: "janne.m@rairanta.fi", role: "Pitch holder", pitch: "D-01", status: "Active" },
];

/* ---------- Reports preview (June 2026 monthly summary) ---------- */

export type ReportRow = {
  code: string;
  area: string;
  nights: number;
  personNights: number;
  occupancy: number;
};

export const reportRows: ReportRow[] = [
  { code: "A-12", area: "Lakeside", nights: 24, personNights: 112, occupancy: 80 },
  { code: "A-07", area: "Forest edge", nights: 21, personNights: 88, occupancy: 70 },
  { code: "B-09", area: "Shoreline", nights: 23, personNights: 96, occupancy: 77 },
  { code: "B-14", area: "Shoreline", nights: 19, personNights: 73, occupancy: 63 },
  { code: "C-02", area: "Meadow", nights: 16, personNights: 54, occupancy: 53 },
  { code: "D-01", area: "Riverside", nights: 22, personNights: 101, occupancy: 73 },
];

export const reportTotals = { personNights: 1284, occupancy: 68 };

export const reportTypes = [
  "Monthly summary",
  "Daily breakdown",
  "Seasonal total",
  "Statistics Finland format",
] as const;

/* ---------- Audit log ---------- */

export type AuditEntry = {
  id: string;
  time: string;
  user: string;
  action: string;
  entity: string;
  detail: string;
};

export const auditLog: AuditEntry[] = [
  { id: "g1", time: "19 Jun · 08:14", user: "Aino Korhonen", action: "Entered record", entity: "A-07 · 19 Jun", detail: "set persons = 4" },
  { id: "g2", time: "19 Jun · 07:52", user: "Olli Virtanen", action: "Edited record", entity: "B-09 · 18 Jun", detail: "4 → 5" },
  { id: "g3", time: "18 Jun · 21:09", user: "Mikko Laine", action: "Entered record", entity: "B-14 · 18 Jun", detail: "set persons = 6" },
  { id: "g4", time: "18 Jun · 16:30", user: "Olli Virtanen", action: "Invited user", entity: "Satu Niemi", detail: "role = holder · pitch C-02" },
  { id: "g5", time: "18 Jun · 11:02", user: "Olli Virtanen", action: "Exported report", entity: "May 2026", detail: "format = CSV" },
  { id: "g6", time: "17 Jun · 09:48", user: "Olli Virtanen", action: "Updated settings", entity: "Season 2026", detail: "end date 30 Sep → 15 Oct" },
];

/* ---------- Settings ---------- */

export const settings = {
  campsiteName: "Rairanta",
  subdomain: "rairanta.pakkia.fi",
  seasonStart: "2026-05-01",
  seasonEnd: "2026-10-15",
  retention: "Keep records for 6 years",
};

/* ---------- Records heatmap (per pitch, Jun 1–16, 2026) ----------
   Deterministic counts so the page is stable across renders. */

export const HEAT_DAYS = 16;

export type HeatPitch = { code: string; area: string; counts: number[] };

function makeCounts(seed: number): number[] {
  const out: number[] = [];
  for (let d = 0; d < HEAT_DAYS; d++) {
    const wave = Math.sin((d + seed) * 0.9) * 3 + Math.cos((d + seed * 2) * 0.5) * 2;
    const base = Math.round(4 + wave);
    const empty = (d + seed) % 7 === 3;
    out.push(empty ? 0 : Math.max(0, Math.min(9, base)));
  }
  return out;
}

export const heatPitches: HeatPitch[] = [
  { code: "A-12", area: "Lakeside", counts: makeCounts(1) },
  { code: "A-07", area: "Forest edge", counts: makeCounts(3) },
  { code: "B-09", area: "Shoreline", counts: makeCounts(5) },
  { code: "B-14", area: "Shoreline", counts: makeCounts(2) },
  { code: "C-02", area: "Meadow", counts: makeCounts(7) },
  { code: "D-01", area: "Riverside", counts: makeCounts(6) },
];

export function rowTotal(p: HeatPitch): number {
  return p.counts.reduce((s, v) => s + v, 0);
}

export type HeatLevel = 0 | 1 | 2 | 3 | 4;

export function heatLevel(persons: number): HeatLevel {
  if (persons === 0) return 0;
  if (persons <= 2) return 1;
  if (persons <= 4) return 2;
  if (persons <= 6) return 3;
  return 4;
}

/* ---------- Notifications (admin-appropriate) ---------- */

export const notifications: PortalNotification[] = [
  {
    id: "an1",
    title: "3 pitches still need today's entry — A-07, B-14 and C-02.",
    time: "Today, 21:00",
    unread: true,
  },
  {
    id: "an2",
    title: "Satu Niemi hasn't accepted her holder invite yet.",
    time: "Today, 16:30",
    unread: true,
  },
  {
    id: "an3",
    title: "Mikko Laine edited B-09 for 18 Jun · 4 → 5.",
    time: "1h ago",
    unread: true,
  },
  {
    id: "an4",
    title: "Your May monthly report finished exporting.",
    time: "Yesterday",
  },
];

/* ---------- Shared tone helpers ---------- */

type BadgeTone = "neutral" | "primary" | "amber" | "success" | "dark";

export function roleTone(role: UserRole): BadgeTone {
  if (role === "Administrator") return "primary";
  if (role === "Power user") return "neutral";
  return "neutral";
}

export function userStatusTone(status: UserStatus): BadgeTone {
  return status === "Active" ? "success" : "amber";
}
