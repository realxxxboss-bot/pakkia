/* Placeholder data for the Admin (campsite / tenant) portal demo. No backend.
   Olli Virtanen administering the Rairanta campsite, mid-June 2026.

   Scope reminder: the Administrator runs ONE campsite (Rairanta). They manage
   this campsite's Power Users and Pitch Holders, configure pitches, set season
   and scoring rules, and export this campsite's reports. They never see other
   campsites, billing or platform settings — that is Super Admin territory.
   Names are kept consistent with the Super Admin mock (Rairanta = Tenant #1,
   admin Olli Virtanen). Mirrors the shape of the other portal data files. */

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

/* ---------- Shared badge tones ---------- */

type BadgeTone = "neutral" | "primary" | "amber" | "success" | "dark";

/* ---------- Dashboard KPIs ----------
   Framed around what an Administrator owns: pitches, the people running the
   campsite (Power Users + Pitch Holders) and the season's nights — not the
   day-to-day "who logged tonight" work that belongs to Power Users. */

export type Kpi = {
  label: string;
  value: string;
  unit?: string;
  hint: string;
  tone: "up" | "warn" | "flat";
  icon: "tent" | "shield" | "users" | "chart";
};

export const dashboardKpis: Kpi[] = [
  { label: "Active pitches", value: "54", unit: "/ 60", hint: "6 inactive this season", tone: "flat", icon: "tent" },
  { label: "Power users", value: "3", hint: "Front-desk staff · 1 invite pending", tone: "flat", icon: "shield" },
  { label: "Pitch holders", value: "41", hint: "38 active · 3 invited", tone: "flat", icon: "users" },
  { label: "Nights this season", value: "6,120", hint: "+12% vs 2025", tone: "up", icon: "chart" },
];

/* People in this campsite (counts behind the KPIs). */
export const teamCounts = {
  powerUsers: 3,
  pitchHolders: 41,
  invitesPending: 4,
};

/* ---------- Nights logged — daily bars for June 2026 ---------- */

export const nightsTrend = [
  28, 12, 34, 30, 46, 58, 40, 38, 22, 30, 52, 68, 72, 55, 82, 60, 18, 34, 46,
  38, 52, 64, 44, 40, 30, 48, 70, 58, 46, 42,
];

export const nightsAxis = ["Jun 1", "Jun 8", "Jun 15", "Jun 22", "Jun 30"];

/* ---------- Occupancy snapshot ---------- */

export const occupancy = {
  pct: 68,
  peak: "Sat 14 Jun · 92%",
};

/* Occupancy broken down by area — an Administrator's overview lens. */
export type AreaOccupancy = { area: string; pct: number; pitches: number };

export const areaOccupancy: AreaOccupancy[] = [
  { area: "Lakeside", pct: 82, pitches: 14 },
  { area: "Shoreline", pct: 74, pitches: 16 },
  { area: "Riverside", pct: 70, pitches: 10 },
  { area: "Forest edge", pct: 61, pitches: 12 },
  { area: "Meadow", pct: 48, pitches: 8 },
];

/* ---------- Recent activity ---------- */

export type ActivityKind = "logged" | "edited" | "invited" | "exported" | "config";
export type ActivityItem = {
  id: string;
  kind: ActivityKind;
  highlight: string;
  text: string;
  tail?: string;
  time: string;
};

export const recentActivity: ActivityItem[] = [
  { id: "a1", kind: "invited", highlight: "You", text: "created Power User", tail: "Eeva Salo", time: "2m" },
  { id: "a2", kind: "edited", highlight: "Mikko L.", text: "edited B-09 · 4 → 5", time: "1h" },
  { id: "a3", kind: "config", highlight: "You", text: "changed pitch capacity to", tail: "6 persons", time: "3h" },
  { id: "a4", kind: "logged", highlight: "A-12", text: "logged", tail: "7 persons for today", time: "5h" },
  { id: "a5", kind: "exported", highlight: "You", text: "exported May monthly report", time: "Yesterday" },
];

/* ---------- Pitches ---------- */

export type PitchStatus = "Active" | "Inactive";
export type Hookup = "Electric" | "None";
export type Surface = "Grass" | "Gravel";

export type Pitch = {
  code: string;
  area: string;
  holder: string | null;
  holderEmail?: string;
  status: PitchStatus;
  hookup: Hookup;
  surface: Surface;
  nightsMTD: number;
};

export const pitches: Pitch[] = [
  { code: "A-12", area: "Lakeside", holder: "Olli Virtanen", holderEmail: "olli@rairanta.fi", status: "Active", hookup: "Electric", surface: "Grass", nightsMTD: 112 },
  { code: "A-07", area: "Forest edge", holder: "Aino Korhonen", status: "Active", hookup: "Electric", surface: "Grass", nightsMTD: 88 },
  { code: "B-09", area: "Shoreline", holder: "Mikko Laine", status: "Active", hookup: "Electric", surface: "Gravel", nightsMTD: 96 },
  { code: "B-14", area: "Shoreline", holder: "Mikko Laine", status: "Active", hookup: "None", surface: "Grass", nightsMTD: 73 },
  { code: "C-02", area: "Meadow", holder: "Satu Niemi", status: "Active", hookup: "None", surface: "Grass", nightsMTD: 54 },
  { code: "C-08", area: "Meadow", holder: null, status: "Inactive", hookup: "None", surface: "Grass", nightsMTD: 0 },
  { code: "D-01", area: "Riverside", holder: "Janne Mäkinen", status: "Active", hookup: "Electric", surface: "Gravel", nightsMTD: 101 },
];

export const pitchTotal = 60;
export const areas = ["Lakeside", "Shoreline", "Forest edge", "Meadow", "Riverside"] as const;

/* ---------- Users & roles ----------
   An Administrator manages Power Users (front-desk staff) and Pitch Holders
   within this campsite. They cannot create other Administrators — Super Admin
   appoints those. Olli is shown as the campsite owner (read-only). */

export type UserRole = "Administrator" | "Power user" | "Pitch holder";
export type UserStatus = "Active" | "Invited" | "Blocked";
export type TenantUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  /** Pitch holders own one pitch; power users cover all pitches. */
  scope: string;
  status: UserStatus;
};

export const users: TenantUser[] = [
  { id: "u1", name: "Olli Virtanen", email: "olli@rairanta.fi", role: "Administrator", scope: "—", status: "Active" },
  { id: "u2", name: "Mikko Laine", email: "mikko.laine@rairanta.fi", role: "Power user", scope: "All pitches", status: "Active" },
  { id: "u3", name: "Eeva Salo", email: "eeva.salo@rairanta.fi", role: "Power user", scope: "All pitches", status: "Active" },
  { id: "u4", name: "Jari Koivu", email: "jari.koivu@rairanta.fi", role: "Power user", scope: "All pitches", status: "Invited" },
  { id: "u5", name: "Aino Korhonen", email: "aino.k@rairanta.fi", role: "Pitch holder", scope: "A-07", status: "Active" },
  { id: "u6", name: "Janne Mäkinen", email: "janne.m@rairanta.fi", role: "Pitch holder", scope: "D-01", status: "Active" },
  { id: "u7", name: "Satu Niemi", email: "satu.niemi@rairanta.fi", role: "Pitch holder", scope: "C-02", status: "Invited" },
  { id: "u8", name: "Liisa Heikkinen", email: "liisa.h@rairanta.fi", role: "Pitch holder", scope: "B-22", status: "Blocked" },
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
  "Daily breakdown",
  "Monthly summary",
  "Seasonal total",
] as const;

export type ReportType = (typeof reportTypes)[number];

/* ---------- Audit log (scoped to this campsite) ---------- */

export type AuditEntry = {
  id: string;
  time: string;
  user: string;
  action: string;
  entity: string;
  detail: string;
};

export const auditLog: AuditEntry[] = [
  { id: "g1", time: "19 Jun · 09:20", user: "Olli Virtanen", action: "Created user", entity: "Eeva Salo", detail: "role = power user" },
  { id: "g2", time: "19 Jun · 08:14", user: "Aino Korhonen", action: "Entered record", entity: "A-07 · 19 Jun", detail: "set persons = 4" },
  { id: "g3", time: "19 Jun · 07:52", user: "Olli Virtanen", action: "Edited record", entity: "B-09 · 18 Jun", detail: "4 → 5" },
  { id: "g4", time: "18 Jun · 21:09", user: "Mikko Laine", action: "Entered record", entity: "B-14 · 18 Jun", detail: "set persons = 6" },
  { id: "g5", time: "18 Jun · 16:30", user: "Olli Virtanen", action: "Blocked user", entity: "Liisa Heikkinen", detail: "reason = left site" },
  { id: "g6", time: "18 Jun · 11:02", user: "Olli Virtanen", action: "Exported report", entity: "May 2026", detail: "format = CSV" },
  { id: "g7", time: "17 Jun · 14:41", user: "Olli Virtanen", action: "Updated settings", entity: "Scoring rules", detail: "pitch capacity 5 → 6" },
  { id: "g8", time: "17 Jun · 09:48", user: "Olli Virtanen", action: "Updated settings", entity: "Season 2026", detail: "end date 30 Sep → 15 Oct" },
];

/* ---------- Settings (season + scoring/occupancy rules) ---------- */

export const settings = {
  campsiteName: "Rairanta",
  subdomain: "rairanta.pakkia.fi",
  /* Season definition */
  seasonStart: "2026-05-01",
  seasonEnd: "2026-10-15",
  peakStart: "2026-06-15",
  peakEnd: "2026-08-15",
  /* Scoring & occupancy rules */
  pitchCapacity: 6,
  occupancyBasis: "Person-nights" as "Person-nights" | "Pitch-nights",
  countEmptyNights: true,
  autoRemind: true,
  reminderTime: "20:00",
};

export const occupancyBases = ["Person-nights", "Pitch-nights"] as const;

/* ---------- Notifications (admin-appropriate, no pitch-holder copy) ---------- */

export const notifications: PortalNotification[] = [
  {
    id: "an1",
    title: "Jari Koivu hasn't accepted his Power User invite yet.",
    time: "Today, 16:30",
    unread: true,
  },
  {
    id: "an2",
    title: "4 invites are still pending across this campsite.",
    time: "Today, 09:20",
    unread: true,
  },
  {
    id: "an3",
    title: "Occupancy hit a season peak of 92% on Sat 14 Jun.",
    time: "Yesterday",
    unread: true,
  },
  {
    id: "an4",
    title: "Your May monthly report finished exporting.",
    time: "2 days ago",
  },
];

/* ---------- Shared tone helpers ---------- */

export function roleTone(role: UserRole): BadgeTone {
  if (role === "Administrator") return "primary";
  if (role === "Power user") return "dark";
  return "neutral";
}

export function userStatusTone(status: UserStatus): BadgeTone {
  if (status === "Active") return "success";
  if (status === "Invited") return "amber";
  return "neutral";
}
