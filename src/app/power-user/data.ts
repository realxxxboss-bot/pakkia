/* Placeholder data for the Power User portal demo. No backend.

   Scope reminder: a Power User is STAFF inside one campsite (Rairanta). They sit
   below the Administrator and above the Pitch Holders. Their job is operational —
   they assign Pitch Holders to pitches, manage calendar events, watch the nights
   that holders log, and pull intermediate summaries. They do NOT create users,
   change campsite settings, or enter other people's counts: Pitch Holders log
   their own nights. Names stay consistent with the Admin / Pitch-Holder mocks
   (Rairanta, holders Aino, Mikko, Satu, Olli…). Mid-June 2026. */

import type { PortalNotification } from "@/components/dashboard/types";

export const site = { name: "Rairanta", scope: "Staff" };

export const staff = {
  name: "Mikko Laine",
  firstName: "Mikko",
  role: "Power user",
  initials: "ML",
  email: "mikko.laine@rairanta.fi",
  phone: "+358 40 555 8842",
};

export const today = {
  label: "Tuesday · 19 June 2026",
  greeting: "Hei, Mikko.",
  dateISO: "2026-06-19",
};

export const areas = [
  "Lakeside",
  "Shoreline",
  "Forest edge",
  "Meadow",
  "Riverside",
] as const;

/* Pitch holders this staff member can assign to pitches. Only an Administrator
   creates new holders — so the roster here is fixed. */
export const holders = [
  "Aino Korhonen",
  "Mikko Laine",
  "Satu Niemi",
  "Olli Virtanen",
  "Eero Mäkinen",
  "Liisa Hakala",
] as const;

/* ---------- Dashboard KPIs ----------
   Framed around oversight, not data entry: how many pitches Mikko looks after,
   how many holders have logged tonight, what still needs a holder, and how full
   the site is right now. */

export type Kpi = {
  label: string;
  value: string;
  unit?: string;
  hint: string;
  tone: "up" | "warn" | "flat";
  icon: "tent" | "check" | "link" | "chart";
};

export const dashboardKpis: Kpi[] = [
  { label: "Pitches managed", value: "24", hint: "Across 5 areas", tone: "flat", icon: "tent" },
  { label: "Logged tonight", value: "19", unit: "/ 24", hint: "5 holders still to log", tone: "warn", icon: "check" },
  { label: "Pending assignments", value: "3", hint: "Pitches without a holder", tone: "warn", icon: "link" },
  { label: "Occupancy tonight", value: "78", unit: "%", hint: "+6% vs last Tuesday", tone: "up", icon: "chart" },
];

/* ---------- This week — person-nights logged per day ----------
   Bars for the dashboard. June 19 (today) is still filling in. */

export type WeekDay = { label: string; value: number; today?: boolean };

export const weekTrend: WeekDay[] = [
  { label: "13", value: 196 },
  { label: "14", value: 242 },
  { label: "15", value: 268 },
  { label: "16", value: 224 },
  { label: "17", value: 210 },
  { label: "18", value: 236 },
  { label: "19", value: 178, today: true },
];

export const weekTotal = weekTrend.reduce((s, d) => s + d.value, 0);

/* ---------- Recent entries by pitch holders ----------
   Mikko watches these come in; he does not type them himself. */

export type HolderEntry = {
  id: string;
  pitch: string;
  area: string;
  holder: string;
  persons: number;
  time: string;
};

export const holderEntries: HolderEntry[] = [
  { id: "h1", pitch: "A-12", area: "Lakeside", holder: "Olli Virtanen", persons: 7, time: "2m" },
  { id: "h2", pitch: "D-01", area: "Riverside", holder: "Olli Virtanen", persons: 5, time: "18m" },
  { id: "h3", pitch: "A-07", area: "Forest edge", holder: "Aino Korhonen", persons: 4, time: "40m" },
  { id: "h4", pitch: "B-09", area: "Shoreline", holder: "Mikko Laine", persons: 6, time: "1h" },
  { id: "h5", pitch: "C-02", area: "Meadow", holder: "Satu Niemi", persons: 3, time: "2h" },
];

/* ---------- Assignments (pitch ↔ holder, per season) ----------
   The Power User links a Pitch Holder to a pitch for a season / agreement and
   can reassign or release them. */

export type Agreement = "Seasonal" | "Short-stay";
export type AssignmentStatus = "Active" | "Unassigned" | "Ending soon";

export type Assignment = {
  code: string;
  area: string;
  holder: string | null;
  season: string;
  agreement: Agreement | null;
  /** Human date the agreement began, or null when unassigned. */
  since: string | null;
  status: AssignmentStatus;
};

export const assignments: Assignment[] = [
  { code: "A-12", area: "Lakeside", holder: "Olli Virtanen", season: "2026", agreement: "Seasonal", since: "1 May", status: "Active" },
  { code: "A-07", area: "Forest edge", holder: "Aino Korhonen", season: "2026", agreement: "Seasonal", since: "1 May", status: "Active" },
  { code: "A-03", area: "Lakeside", holder: "Satu Niemi", season: "2026", agreement: "Short-stay", since: "12 Jun", status: "Ending soon" },
  { code: "B-09", area: "Shoreline", holder: "Mikko Laine", season: "2026", agreement: "Seasonal", since: "3 May", status: "Active" },
  { code: "B-14", area: "Shoreline", holder: "Mikko Laine", season: "2026", agreement: "Seasonal", since: "3 May", status: "Active" },
  { code: "C-02", area: "Meadow", holder: "Satu Niemi", season: "2026", agreement: "Seasonal", since: "8 May", status: "Active" },
  { code: "C-08", area: "Meadow", holder: null, season: "2026", agreement: null, since: null, status: "Unassigned" },
  { code: "D-01", area: "Riverside", holder: "Olli Virtanen", season: "2026", agreement: "Seasonal", since: "1 May", status: "Active" },
  { code: "D-05", area: "Riverside", holder: null, season: "2026", agreement: null, since: null, status: "Unassigned" },
  { code: "E-06", area: "Forest edge", holder: null, season: "2026", agreement: null, since: null, status: "Unassigned" },
];

export const agreements: Agreement[] = ["Seasonal", "Short-stay"];

/* ---------- Events ---------- */

export type EventScope = "Site-wide" | "A area" | "B area" | "C area";
export type PortalEvent = {
  id: string;
  range: string;
  days: number[];
  name: string;
  scope: EventScope;
  visible: boolean;
};

export const events: PortalEvent[] = [
  { id: "e1", range: "20–22 Jun", days: [20, 21, 22], name: "Midsummer · Juhannus", scope: "Site-wide", visible: true },
  { id: "e2", range: "28 Jun", days: [28], name: "Lakeside market day", scope: "Site-wide", visible: true },
  { id: "e3", range: "30 Jun", days: [30], name: "Pier maintenance", scope: "B area", visible: false },
];

export const eventDays = new Set(events.flatMap((e) => e.days));

/* ---------- Multi-pitch viewer ----------
   Read-only overnight data across every pitch for Jun 1–16, 2026. The Power
   User filters and reads this; the numbers are logged by the holders. Counts
   are deterministic so the view is stable across renders. */

export const HEAT_DAYS = 16;
export const HEAT_RANGE = "Jun 1–16, 2026";
export const PITCH_CAPACITY = 8;

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

export type PitchRecord = {
  code: string;
  area: string;
  holder: string | null;
  counts: number[]; // length HEAT_DAYS, index 0 = Jun 1
};

/* Holders mirror the assignment roster; unassigned pitches have no logged data. */
export const pitchRecords: PitchRecord[] = [
  { code: "A-12", area: "Lakeside", holder: "Olli Virtanen", counts: makeCounts(1) },
  { code: "A-07", area: "Forest edge", holder: "Aino Korhonen", counts: makeCounts(3) },
  { code: "A-03", area: "Lakeside", holder: "Satu Niemi", counts: makeCounts(9) },
  { code: "B-09", area: "Shoreline", holder: "Mikko Laine", counts: makeCounts(5) },
  { code: "B-14", area: "Shoreline", holder: "Mikko Laine", counts: makeCounts(2) },
  { code: "C-02", area: "Meadow", holder: "Satu Niemi", counts: makeCounts(7) },
  { code: "C-08", area: "Meadow", holder: null, counts: Array(HEAT_DAYS).fill(0) },
  { code: "D-01", area: "Riverside", holder: "Olli Virtanen", counts: makeCounts(6) },
];

export function recordNights(p: PitchRecord): number {
  return p.counts.filter((v) => v > 0).length;
}

export function recordPersonNights(p: PitchRecord): number {
  return p.counts.reduce((s, v) => s + v, 0);
}

export function recordBusiest(p: PitchRecord): number {
  return p.counts.reduce((m, v) => Math.max(m, v), 0);
}

export function recordOccupancy(p: PitchRecord): number {
  return Math.round((recordNights(p) / HEAT_DAYS) * 100);
}

export function recordLastLogged(p: PitchRecord): string {
  for (let d = HEAT_DAYS - 1; d >= 0; d--) {
    if (p.counts[d] > 0) return `${d + 1} Jun`;
  }
  return "—";
}

/* Map a night's person count to a 0–4 heat level (SAGE → MOSS ramp). */
export type HeatLevel = 0 | 1 | 2 | 3 | 4;

export function heatLevel(persons: number): HeatLevel {
  if (persons === 0) return 0;
  if (persons <= 2) return 1;
  if (persons <= 4) return 2;
  if (persons <= 6) return 3;
  return 4;
}

/* ---------- Reports — summary by area ---------- */

export type AreaSummary = {
  area: string;
  pitches: number;
  nights: number;
  personNights: number;
  occupancy: number;
};

export const areaSummary: AreaSummary[] = [
  { area: "Lakeside", pitches: 14, nights: 312, personNights: 1180, occupancy: 74 },
  { area: "Shoreline", pitches: 12, nights: 268, personNights: 980, occupancy: 71 },
  { area: "Forest edge", pitches: 10, nights: 204, personNights: 720, occupancy: 65 },
  { area: "Meadow", pitches: 12, nights: 176, personNights: 610, occupancy: 52 },
  { area: "Riverside", pitches: 12, nights: 230, personNights: 840, occupancy: 68 },
];

/* Daily breakdown for the reports' day-range mode (Jun 13–19). */
export type DaySummary = { date: string; nights: number; personNights: number; occupancy: number };

export const daySummary: DaySummary[] = [
  { date: "13 Jun", nights: 44, personNights: 196, occupancy: 71 },
  { date: "14 Jun", nights: 49, personNights: 242, occupancy: 79 },
  { date: "15 Jun", nights: 51, personNights: 268, occupancy: 83 },
  { date: "16 Jun", nights: 47, personNights: 224, occupancy: 76 },
  { date: "17 Jun", nights: 45, personNights: 210, occupancy: 73 },
  { date: "18 Jun", nights: 48, personNights: 236, occupancy: 78 },
  { date: "19 Jun", nights: 38, personNights: 178, occupancy: 62 },
];

export const months = ["June 2026", "May 2026", "April 2026"] as const;

/* ---------- Notifications (power-user appropriate, no entry copy) ---------- */

export const notifications: PortalNotification[] = [
  {
    id: "pn1",
    title: "5 holders still need to log tonight before reporting closes.",
    time: "Today, 21:00",
    unread: true,
  },
  {
    id: "pn2",
    title: "C-08, D-05 and E-06 are unassigned — link a holder when you can.",
    time: "Today, 14:20",
    unread: true,
  },
  {
    id: "pn3",
    title: "Olli Virtanen logged 7 persons on A-12.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: "pn4",
    title: "Midsummer weekend (20–22 Jun) is now visible to all holders.",
    time: "Yesterday",
  },
];
