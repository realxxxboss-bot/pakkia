/* Placeholder data for the Power User portal demo. No backend.

   Scope reminder: a Power User is STAFF inside one campsite (Rairanta). They sit
   below the Administrator and above the Pitch Holders. Their job is operational —
   they assign Pitch Holders to pitches, manage calendar events, watch the nights
   that holders log, and pull intermediate summaries. They do NOT create users,
   change campsite settings, or enter other people's counts: Pitch Holders log
   their own nights. Names stay consistent with the Admin / Pitch-Holder mocks
   (Rairanta, holders Aino, Mikko, Satu, Olli…). Mid-June 2026. */

import type { PortalNotification } from "@/components/portal/types";
import type { AuditEvent } from "@/components/portal/audit-store";

export const site = { name: "Rairanta", scope: "Staff" };

export const staff = {
  name: "Mikko Laine",
  firstName: "Mikko",
  role: "Power user",
  initials: "ML",
  email: "mikko.laine@rairanta.fi",
  phone: "+358 40 555 8842",
};

export const adminContact = { name: "Olli Virtanen", email: "olli@rairanta.fi" };

export const today = {
  label: "Tuesday · 19 June 2026",
  mono: "TUESDAY · 19 JUNE 2026",
  greeting: "Hei, Mikko.",
  dateISO: "2026-06-19",
  day: 19,
};

/* ---------- The June 2026 month grid ----------
   Monday-first. 1 June sits on a Friday, which puts the 19th on a Tuesday —
   consistent with the date line above. One source of truth for the events
   calendar, the heat view and the by-day report. */

export const MONTH = {
  label: "JUNE 2026",
  name: "June 2026",
  days: 30,
  /** Leading blank cells before day 1 (Monday-first). */
  startOffset: 4,
  today: 19,
};

export const DOW = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;

/** Saturday/Sunday in the June 2026 grid. */
export function isWeekend(day: number): boolean {
  return (MONTH.startOffset + day - 1) % 7 >= 5;
}

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
  "Tuomas Rinne",
  "Kaisa Salo",
] as const;

export function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* ---------- Assignments (pitch ↔ holder, per season) ----------
   The Power User links a Pitch Holder to a pitch for a season / agreement and
   can reassign or release them. These 24 pitches are the ones Mikko manages. */

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
  { code: "A-03", area: "Lakeside", holder: "Satu Niemi", season: "2026", agreement: "Short-stay", since: "12 Jun", status: "Ending soon" },
  { code: "A-05", area: "Lakeside", holder: "Liisa Hakala", season: "2026", agreement: "Seasonal", since: "1 May", status: "Active" },
  { code: "A-07", area: "Forest edge", holder: "Aino Korhonen", season: "2026", agreement: "Seasonal", since: "1 May", status: "Active" },
  { code: "A-12", area: "Lakeside", holder: "Olli Virtanen", season: "2026", agreement: "Seasonal", since: "1 May", status: "Active" },
  { code: "B-02", area: "Shoreline", holder: "Eero Mäkinen", season: "2026", agreement: "Seasonal", since: "3 May", status: "Active" },
  { code: "B-04", area: "Shoreline", holder: "Kaisa Salo", season: "2026", agreement: "Short-stay", since: "15 Jun", status: "Ending soon" },
  { code: "B-09", area: "Shoreline", holder: "Mikko Laine", season: "2026", agreement: "Seasonal", since: "3 May", status: "Active" },
  { code: "B-14", area: "Shoreline", holder: "Mikko Laine", season: "2026", agreement: "Seasonal", since: "3 May", status: "Active" },
  { code: "C-02", area: "Meadow", holder: "Satu Niemi", season: "2026", agreement: "Seasonal", since: "8 May", status: "Active" },
  { code: "C-04", area: "Meadow", holder: "Tuomas Rinne", season: "2026", agreement: "Seasonal", since: "8 May", status: "Active" },
  { code: "C-08", area: "Meadow", holder: null, season: "2026", agreement: null, since: null, status: "Unassigned" },
  { code: "C-11", area: "Meadow", holder: "Aino Korhonen", season: "2026", agreement: "Seasonal", since: "10 May", status: "Active" },
  { code: "D-01", area: "Riverside", holder: "Olli Virtanen", season: "2026", agreement: "Seasonal", since: "1 May", status: "Active" },
  { code: "D-03", area: "Riverside", holder: "Liisa Hakala", season: "2026", agreement: "Seasonal", since: "5 May", status: "Active" },
  { code: "D-05", area: "Riverside", holder: null, season: "2026", agreement: null, since: null, status: "Unassigned" },
  { code: "D-09", area: "Riverside", holder: "Eero Mäkinen", season: "2026", agreement: "Seasonal", since: "5 May", status: "Active" },
  { code: "E-02", area: "Forest edge", holder: "Kaisa Salo", season: "2026", agreement: "Seasonal", since: "2 May", status: "Active" },
  { code: "E-04", area: "Forest edge", holder: "Tuomas Rinne", season: "2026", agreement: "Seasonal", since: "2 May", status: "Active" },
  { code: "E-06", area: "Forest edge", holder: null, season: "2026", agreement: null, since: null, status: "Unassigned" },
  { code: "E-08", area: "Forest edge", holder: "Satu Niemi", season: "2026", agreement: "Seasonal", since: "9 May", status: "Active" },
  { code: "F-01", area: "Lakeside", holder: "Mikko Laine", season: "2026", agreement: "Seasonal", since: "1 May", status: "Active" },
  { code: "F-03", area: "Lakeside", holder: "Aino Korhonen", season: "2026", agreement: "Short-stay", since: "16 Jun", status: "Active" },
  { code: "F-05", area: "Meadow", holder: "Olli Virtanen", season: "2026", agreement: "Seasonal", since: "12 May", status: "Active" },
  { code: "F-07", area: "Shoreline", holder: "Liisa Hakala", season: "2026", agreement: "Seasonal", since: "12 May", status: "Active" },
];

export const agreements: Agreement[] = ["Seasonal", "Short-stay"];

export const unassignedList = assignments.filter((a) => a.holder === null);

/* ---------- Dashboard figures ----------
   Framed around oversight, not data entry: how many pitches Mikko looks after,
   how many holders have logged tonight, what still needs a holder, and how full
   the site is right now. */

export const pitchesManaged = assignments.length; // 24
export const loggedTonight = 19;
export const stillToLog = pitchesManaged - loggedTonight; // 5
export const pendingAssignments = unassignedList.length; // 3
export const occupancyTonight = 78;

/** The five pitches whose holders have not logged tonight yet — the whole point
    of the "Logged tonight" hero cell and its click-through. */
export const unloggedTonight = ["A-03", "B-14", "C-02", "D-01", "E-02"];

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

export const weekTotal = weekTrend.reduce((s, d) => s + d.value, 0); // 1,554
export const todayIndex = weekTrend.findIndex((d) => d.today);

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
  { id: "h6", pitch: "F-01", area: "Lakeside", holder: "Mikko Laine", persons: 8, time: "3h" },
  { id: "h7", pitch: "E-04", area: "Forest edge", holder: "Tuomas Rinne", persons: 2, time: "4h" },
];

/* ---------- Events ---------- */

export type EventScope = "Site-wide" | "A area" | "B area" | "C area";
export const eventScopes: EventScope[] = ["Site-wide", "A area", "B area", "C area"];

export type PortalEvent = {
  id: string;
  range: string;
  days: number[];
  name: string;
  scope: EventScope;
  visible: boolean;
};

export const events: PortalEvent[] = [
  { id: "e1", range: "20–22 JUN", days: [20, 21, 22], name: "Midsummer · Juhannus", scope: "Site-wide", visible: true },
  { id: "e2", range: "25 JUN", days: [25], name: "Sauna evening", scope: "A area", visible: true },
  { id: "e3", range: "28 JUN", days: [28], name: "Lakeside market day", scope: "Site-wide", visible: true },
  { id: "e4", range: "30 JUN", days: [30], name: "Pier maintenance", scope: "B area", visible: false },
  { id: "e5", range: "12–13 JUN", days: [12, 13], name: "Fishing competition", scope: "Site-wide", visible: true },
  { id: "e6", range: "6 JUN", days: [6], name: "Season safety walk", scope: "C area", visible: false },
];

export const eventDays = new Set(events.flatMap((e) => e.days));

/* ---------- Nightly heat view (read-only analytics) ----------
   Overnight data across the pitches for 1–19 June 2026. The Power User filters
   and reads this; the numbers are logged by the holders. Counts are
   deterministic so the view is stable across renders. `null` = the holder never
   logged that night — the hatched "unlogged" state, which is the compliance
   product's whole job to surface. */

export const HEAT_DAYS = 19;
export const HEAT_RANGE = "Jun 1–19, 2026";
export const PITCH_CAPACITY = 8;

export const heatRanges = [HEAT_RANGE, "Jun 1–8, 2026", "May 2026"] as const;

function makeCounts(seed: number): (number | null)[] {
  const out: (number | null)[] = [];
  for (let d = 0; d < HEAT_DAYS; d++) {
    if ((d + seed * 3) % 11 === 5) {
      out.push(null); // a night the holder never logged
      continue;
    }
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
  counts: (number | null)[]; // length HEAT_DAYS, index 0 = 1 Jun
};

const RECORD_SEEDS: Array<[string, number]> = [
  ["A-03", 9],
  ["A-05", 4],
  ["A-07", 3],
  ["A-12", 1],
  ["B-02", 8],
  ["B-09", 5],
  ["B-14", 2],
  ["C-02", 7],
  ["C-04", 10],
  ["D-01", 6],
  ["E-02", 11],
  ["E-04", 12],
];

export const pitchRecords: PitchRecord[] = RECORD_SEEDS.map(([code, seed]) => {
  const a = assignments.find((x) => x.code === code)!;
  const counts = makeCounts(seed);
  // Tonight's five missing entries — the ones the dashboard hero cell counts.
  if (unloggedTonight.includes(code)) counts[HEAT_DAYS - 1] = null;
  return { code, area: a.area, holder: a.holder, counts };
});

export function recordNights(p: PitchRecord): number {
  return p.counts.filter((v) => v != null && v > 0).length;
}

export function recordPersonNights(p: PitchRecord): number {
  return p.counts.reduce<number>((s, v) => s + (v ?? 0), 0);
}

export function recordBusiest(p: PitchRecord): number {
  return p.counts.reduce<number>((m, v) => Math.max(m, v ?? 0), 0);
}

export function recordOccupancy(p: PitchRecord): number {
  return Math.round((recordNights(p) / HEAT_DAYS) * 100);
}

/** The last night with a logged count, or "—" when nothing was ever logged. */
export function recordLastLogged(p: PitchRecord): string {
  for (let d = HEAT_DAYS - 1; d >= 0; d--) {
    if (p.counts[d] != null) return `${d + 1} Jun`;
  }
  return "—";
}

/** True when the most recent night (or later) is still missing — the amber
    outline square in the "Last logged" cell. */
export function recordUnloggedRecently(p: PitchRecord): boolean {
  return p.counts[HEAT_DAYS - 1] == null;
}

/* ---------- Reports ---------- */

export type AreaSummary = {
  area: string;
  pitches: number;
  nights: number;
  personNights: number;
  occupancy: number;
};

/* June 2026, whole month: 60 pitches × 30 nights = 1,800 possible pitch-nights.
   1,190 logged = 66% average occupancy. The by-day view below is derived from
   these same totals, so both tabs always agree. */
export const areaSummary: AreaSummary[] = [
  { area: "Lakeside", pitches: 14, nights: 312, personNights: 1180, occupancy: 74 },
  { area: "Shoreline", pitches: 12, nights: 268, personNights: 980, occupancy: 71 },
  { area: "Forest edge", pitches: 10, nights: 204, personNights: 720, occupancy: 65 },
  { area: "Meadow", pitches: 12, nights: 176, personNights: 610, occupancy: 52 },
  { area: "Riverside", pitches: 12, nights: 230, personNights: 840, occupancy: 68 },
];

export const months = ["June 2026", "May 2026", "April 2026"] as const;
export type MonthName = (typeof months)[number];

const MONTH_DAYS: Record<MonthName, number> = {
  "June 2026": 30,
  "May 2026": 31,
  "April 2026": 30,
};

/* May and April are the same site, quieter: the shoulder season. */
function scaleAreas(rows: AreaSummary[], factor: number, days: number): AreaSummary[] {
  return rows.map((r) => {
    const nights = Math.round(r.nights * factor);
    return {
      ...r,
      nights,
      personNights: Math.round(r.personNights * factor),
      occupancy: Math.round((nights / (r.pitches * days)) * 100),
    };
  });
}

export const monthlyAreaSummary: Record<MonthName, AreaSummary[]> = {
  "June 2026": areaSummary,
  "May 2026": scaleAreas(areaSummary, 0.72, 31),
  "April 2026": scaleAreas(areaSummary, 0.41, 30),
};

export function monthDays(month: MonthName): number {
  return MONTH_DAYS[month];
}

export type DaySummary = {
  day: number;
  date: string;
  weekend: boolean;
  nights: number;
  personNights: number;
  occupancy: number;
};

/* Largest-remainder allocation: spreads a monthly total across days without
   drifting, so the by-day total row always equals the by-area total row. */
function allocate(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => (total * w) / sum);
  const out = raw.map(Math.floor);
  const remainder = total - out.reduce((a, b) => a + b, 0);
  const order = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  for (let k = 0; k < remainder; k++) out[order[k % order.length].i] += 1;
  return out;
}

const MONTH_ABBR: Record<MonthName, string> = {
  "June 2026": "Jun",
  "May 2026": "May",
  "April 2026": "Apr",
};

/** Derive the by-day ledger for a month (optionally scoped to one area) from
    the monthly area totals — busier at weekends, gently waving otherwise. */
export function daySummaryFor(month: MonthName, area: string | "all"): DaySummary[] {
  const rows = monthlyAreaSummary[month];
  const scoped = area === "all" ? rows : rows.filter((r) => r.area === area);
  const days = MONTH_DAYS[month];
  const pitches = scoped.reduce((s, r) => s + r.pitches, 0);
  const nightsTotal = scoped.reduce((s, r) => s + r.nights, 0);
  const pnTotal = scoped.reduce((s, r) => s + r.personNights, 0);

  const weights = Array.from({ length: days }, (_, i) => {
    const day = i + 1;
    return 1 + Math.sin(day * 0.7) * 0.12 + (isWeekend(day) ? 0.16 : 0);
  });
  const nights = allocate(nightsTotal, weights);
  const personNights = allocate(pnTotal, weights);

  return Array.from({ length: days }, (_, i) => {
    const day = i + 1;
    return {
      day,
      date: `${day} ${MONTH_ABBR[month]}`,
      weekend: isWeekend(day),
      nights: nights[i],
      personNights: personNights[i],
      occupancy: pitches ? Math.round((nights[i] / pitches) * 100) : 0,
    };
  });
}

/* The 7-day slice the dashboard/reports "this week" figures come from. */
export const daySummary = daySummaryFor("June 2026", "all").slice(12, 19);

/* ---------- Notifications ---------- */

export const notifications: PortalNotification[] = [
  {
    id: "pn1",
    title: "5 holders still need to log tonight before reporting closes.",
    time: "Today, 21:00",
    unread: true,
    tone: "action",
    href: "/power-user/pitches?filter=unlogged",
  },
  {
    id: "pn2",
    title: "C-08, D-05 and E-06 are unassigned — link a holder when you can.",
    time: "Today, 14:20",
    unread: true,
    tone: "action",
    href: "/power-user/assignments?status=Unassigned",
  },
  {
    id: "pn3",
    title: "Olli Virtanen logged 7 persons on A-12.",
    time: "2 min ago",
    unread: true,
    tone: "info",
    href: "/power-user/pitches",
  },
  {
    id: "pn4",
    title: "Midsummer weekend (20–22 Jun) is now visible to all holders.",
    time: "Yesterday",
    tone: "info",
    href: "/power-user/events",
  },
];

/* ---------- Audit seed ----------
   Staff-scoped slice of the campsite's audit trail. Every mutating action in
   this portal appends to it (PORTAL_SPEC Part C.5). */

export const auditSeed: AuditEvent[] = [
  { id: "a1", time: "2m", actor: "Olli Virtanen", actorInitials: "OV", event: "Logged night", target: "A-12 · 19 Jun", detail: "7 persons", tone: "record" },
  { id: "a2", time: "18m", actor: "Olli Virtanen", actorInitials: "OV", event: "Logged night", target: "D-01 · 19 Jun", detail: "5 persons", tone: "record" },
  { id: "a3", time: "40m", actor: "Aino Korhonen", actorInitials: "AK", event: "Logged night", target: "A-07 · 19 Jun", detail: "4 persons", tone: "record" },
  { id: "a4", time: "1h", actor: "Mikko Laine", actorInitials: "ML", event: "Edited night", target: "B-09 · 18 Jun", detail: "5 → 6", tone: "record" },
  { id: "a5", time: "3h", actor: "Mikko Laine", actorInitials: "ML", event: "Assigned holder", target: "F-03 · Lakeside", detail: "Aino Korhonen", tone: "settings" },
  { id: "a6", time: "Yesterday", actor: "Mikko Laine", actorInitials: "ML", event: "Published event", target: "Midsummer · Juhannus", detail: "Visible to holders", tone: "settings" },
];
