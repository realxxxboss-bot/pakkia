/* Placeholder data for the Power User portal demo. No backend.
   Front-desk staff (Mikko) logging nights across all pitches at Rairanta,
   mid-June 2026. Mirrors the shape of the pitch-holder data file. */

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
  day: 19,
  label: "Today — 19 June 2026",
  dateISO: "2026-06-19",
};

/* ---------- Today / KPIs ---------- */

export const kpis = {
  loggedToday: 51,
  activePitches: 54,
  pendingToday: 3,
  personsTonight: 248,
  weekNights: 1610,
  weekDeltaPct: 8,
};

export const completionPct = Math.round(
  (kpis.loggedToday / kpis.activePitches) * 100,
);

/* ---------- Pitches needing today's entry ---------- */

export type PendingPitch = { code: string; area: string; holder: string };

export const pendingPitches: PendingPitch[] = [
  { code: "A-07", area: "Forest edge", holder: "Aino Korhonen" },
  { code: "B-14", area: "Shoreline", holder: "Mikko Laine" },
  { code: "C-02", area: "Meadow", holder: "Satu Niemi" },
];

/* ---------- Recent activity feed ---------- */

export type FeedKind = "logged" | "edited" | "event";
export type FeedItem = {
  id: string;
  kind: FeedKind;
  text: string;
  highlight: string;
  time: string;
};

export const recentActivity: FeedItem[] = [
  { id: "f1", kind: "logged", highlight: "A-12", text: "· 7 persons logged", time: "2m" },
  { id: "f2", kind: "logged", highlight: "D-01", text: "· 5 persons logged", time: "18m" },
  { id: "f3", kind: "edited", highlight: "You", text: "edited B-09 · 4 → 5", time: "1h" },
  { id: "f4", kind: "event", highlight: "You", text: "added event · Midsummer", time: "Yesterday" },
];

/* ---------- Assignments (pitch ↔ holder) ---------- */

export type Assignment = {
  code: string;
  area: string;
  holder: string | null;
};

export const assignments: Assignment[] = [
  { code: "A-12", area: "Lakeside", holder: "Olli Virtanen" },
  { code: "A-07", area: "Forest edge", holder: "Aino Korhonen" },
  { code: "C-08", area: "Meadow", holder: null },
  { code: "D-05", area: "Riverside", holder: null },
  { code: "B-09", area: "Shoreline", holder: "Mikko Laine" },
  { code: "A-03", area: "Lakeside", holder: "Satu Niemi" },
  { code: "B-14", area: "Shoreline", holder: "Mikko Laine" },
  { code: "C-02", area: "Meadow", holder: "Satu Niemi" },
  { code: "D-01", area: "Riverside", holder: "Olli Virtanen" },
  { code: "E-06", area: "Forest edge", holder: null },
];

/* Holders that staff can reassign to (admins create new ones). */
export const holders = [
  "Aino Korhonen",
  "Mikko Laine",
  "Satu Niemi",
  "Olli Virtanen",
  "Eero Mäkinen",
  "Liisa Hakala",
];

export const areas = [
  "Lakeside",
  "Shoreline",
  "Forest edge",
  "Meadow",
  "Riverside",
] as const;

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
  {
    id: "e1",
    range: "20–22 Jun",
    days: [20, 21, 22],
    name: "Midsummer · Juhannus",
    scope: "Site-wide",
    visible: true,
  },
  {
    id: "e2",
    range: "28 Jun",
    days: [28],
    name: "Lakeside market day",
    scope: "Site-wide",
    visible: true,
  },
  {
    id: "e3",
    range: "30 Jun",
    days: [30],
    name: "Pier maintenance",
    scope: "B area",
    visible: false,
  },
];

export const eventDays = new Set(events.flatMap((e) => e.days));

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

export const areaTotals = areaSummary.reduce(
  (acc, a) => ({
    pitches: acc.pitches + a.pitches,
    nights: acc.nights + a.nights,
    personNights: acc.personNights + a.personNights,
  }),
  { pitches: 0, nights: 0, personNights: 0 },
);

export const totalOccupancy = Math.round(
  areaSummary.reduce((s, a) => s + a.occupancy, 0) / areaSummary.length,
);

/* ---------- Records heatmap ----------
   Nightly person counts per pitch for Jun 1–16, 2026. Deterministic so the
   page is stable across renders (unlike the random mockup). */

export const HEAT_DAYS = 16;

export type HeatPitch = {
  code: string;
  area: string;
  counts: number[]; // length HEAT_DAYS, index 0 = Jun 1
};

/* Small deterministic pseudo-pattern per pitch so totals look organic. */
function makeCounts(seed: number): number[] {
  const out: number[] = [];
  for (let d = 0; d < HEAT_DAYS; d++) {
    const wave = Math.sin((d + seed) * 0.9) * 3 + Math.cos((d + seed * 2) * 0.5) * 2;
    const base = Math.round(4 + wave);
    // Scatter the odd empty night.
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
  { code: "C-08", area: "Meadow", counts: makeCounts(4) },
  { code: "D-01", area: "Riverside", counts: makeCounts(6) },
  { code: "D-05", area: "Riverside", counts: makeCounts(8) },
];

export function rowTotal(p: HeatPitch): number {
  return p.counts.reduce((s, v) => s + v, 0);
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

/* ---------- Notifications (power-user appropriate) ---------- */

export const notifications: PortalNotification[] = [
  {
    id: "pn1",
    title: "3 pitches still need tonight's count before reporting closes.",
    time: "Today, 21:00",
    unread: true,
  },
  {
    id: "pn2",
    title: "C-08 and D-05 are unassigned — link a holder when you can.",
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

/* ---------- Profile ---------- */

export const monthHistory = [
  { month: "June 2026", note: "in progress", personNights: 4330, nights: 1190 },
  { month: "May 2026", note: null, personNights: 5120, nights: 1402 },
  { month: "April 2026", note: null, personNights: 3680, nights: 1014 },
];
