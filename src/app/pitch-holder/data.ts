/* Placeholder data for the Pitch Holder portal demo. No backend.
   One holder (Aino, pitch A-07 at Rairanta) on the evening of Tuesday
   19 June 2026, mid-season. Everything the screens show is DERIVED from
   `seedEntries` — totals, streaks, weekly trend and the month ledger are
   computed, never hand-typed, so the numbers can't drift apart.

   All dates are fixed constants (never Date.now()), so the server and the
   client render the same grid. The one time-dependent rule — "is it past
   20:00?" — is resolved on the client after mount (see useAfterEight). */

export const pitch = {
  code: "A-07",
  area: "Forest edge",
  site: "Rairanta",
  /** Max persons per pitch — set by the campsite admin (PORTAL_SPEC B2.6).
      The stepper clamps to this and shows "MAX 9 PER PITCH". */
  capacity: 9,
  agreement: "Seasonal",
};

export const holder = {
  name: "Aino Korhonen",
  firstName: "Aino",
  role: "Pitch holder · A-07",
  initials: "AK",
  email: "aino.k@example.fi",
  phone: "+358 40 123 4567",
};

export const season = {
  year: 2026,
  startMonth: 5,
  endMonth: 10,
  /** The season closes mid-October — days after this are out of season. */
  endDay: 15,
  note: "SEASON: 1 MAY – 15 OCT",
  range: "1 May – 15 Oct",
};

export const today = {
  year: 2026,
  month: 6,
  day: 19,
  label: "Tuesday, 19 June 2026",
  mono: "TUESDAY · 19 JUNE 2026",
};

/* ---------------- calendar primitives ---------------- */

export const DOW = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"] as const;

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DOW_LONG = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export const seasonMonths = Array.from(
  { length: season.endMonth - season.startMonth + 1 },
  (_, i) => season.startMonth + i,
);

export function dateKey(month: number, day: number) {
  return `${month}-${day}`;
}

export function daysInMonth(month: number) {
  return new Date(Date.UTC(season.year, month, 0)).getUTCDate();
}

/** Leading blanks before day 1 in a Monday-first grid. */
export function startOffset(month: number) {
  const sunday0 = new Date(Date.UTC(season.year, month - 1, 1)).getUTCDay();
  return (sunday0 + 6) % 7;
}

/** "JUNE 2026" — the mono month-switcher label. */
export function monthLabel(month: number) {
  return `${MONTH_NAMES[month - 1].toUpperCase()} ${season.year}`;
}

/** "June 2026" — the spoken form, for aria-labels and the ledger. */
export function monthName(month: number) {
  return `${MONTH_NAMES[month - 1]} ${season.year}`;
}

/** "WED 19 JUN" — the stepper header and the "last few nights" rows. */
export function dayLabel(month: number, day: number) {
  const sunday0 = new Date(Date.UTC(season.year, month - 1, day)).getUTCDay();
  const dow = DOW_LONG[(sunday0 + 6) % 7];
  return `${dow} ${day} ${MONTH_NAMES[month - 1].slice(0, 3).toUpperCase()}`;
}

export function inSeason(month: number, day: number) {
  if (month < season.startMonth || month > season.endMonth) return false;
  return !(month === season.endMonth && day > season.endDay);
}

/** Tonight is loggable; anything after it (or past the season) is not. */
export function isFuture(month: number, day: number) {
  if (!inSeason(month, day)) return true;
  if (month !== today.month) return month > today.month;
  return day > today.day;
}

export function isToday(month: number, day: number) {
  return month === today.month && day === today.day;
}

/* ---------------- the logged nights ---------------- */

export type Entries = Record<string, number>;

/* May: a full month, one night missed (the 12th) — the hatch has to be real
   somewhere or the "missing night" state is just decoration. */
const MAY: Record<number, number> = {
  1: 3, 2: 5, 3: 4, 4: 1, 5: 0, 6: 2, 7: 3, 8: 6, 9: 7, 10: 5,
  11: 2, 13: 3, 14: 4, 15: 6, 16: 8, 17: 7, 18: 3, 19: 2, 20: 4,
  21: 5, 22: 6, 23: 9, 24: 8, 25: 4, 26: 2, 27: 3, 28: 5, 29: 6,
  30: 7, 31: 5,
};

/* June: logged through the 18th (the 9th was missed), tonight still open —
   which is the whole reason the holder opens this portal. */
const JUNE: Record<number, number> = {
  1: 2, 2: 0, 3: 4, 4: 3, 5: 6, 6: 8, 7: 5, 8: 2, 10: 3,
  11: 5, 12: 9, 13: 7, 14: 9, 15: 4, 16: 6, 17: 6, 18: 5,
};

export const seedEntries: Entries = {
  ...Object.fromEntries(Object.entries(MAY).map(([d, n]) => [dateKey(5, +d), n])),
  ...Object.fromEntries(Object.entries(JUNE).map(([d, n]) => [dateKey(6, +d), n])),
};

/* ---------------- events (the ones staff marked visible) ---------------- */

export type HolderEvent = {
  month: number;
  days: number[];
  range: string;
  name: string;
  /** Mono tag shown in the stepper header on an event day. */
  tag: string;
};

export const events: HolderEvent[] = [
  { month: 5, days: [1, 2], range: "1–2 May", name: "Vappu weekend", tag: "VAPPU" },
  { month: 6, days: [20, 21, 22], range: "20–22 Jun", name: "Midsummer · Juhannus weekend", tag: "MIDSUMMER" },
  { month: 6, days: [28], range: "28 Jun", name: "Lakeside market day", tag: "MARKET DAY" },
  { month: 7, days: [11, 12], range: "11–12 Jul", name: "Rairanta regatta", tag: "REGATTA" },
];

export function eventsInMonth(month: number) {
  return events.filter((e) => e.month === month);
}

export function eventOn(month: number, day: number) {
  return events.find((e) => e.month === month && e.days.includes(day)) ?? null;
}

/** The events a holder should see next, most imminent first ("What's on"). */
export function upcomingEvents(limit = 3) {
  return events
    .filter((e) => {
      const last = e.days[e.days.length - 1];
      return e.month > today.month || (e.month === today.month && last >= today.day);
    })
    .slice(0, limit);
}

/* ---------------- derived figures ---------------- */

export type MonthTotals = { personNights: number; nightsLogged: number };

export function monthTotals(entries: Entries, month: number): MonthTotals {
  let personNights = 0;
  let nightsLogged = 0;
  for (let day = 1; day <= daysInMonth(month); day++) {
    const n = entries[dateKey(month, day)];
    if (n === undefined) continue;
    personNights += n;
    nightsLogged += 1;
  }
  return { personNights, nightsLogged };
}

export function seasonTotals(entries: Entries) {
  let personNights = 0;
  let nightsLogged = 0;
  let busiest = 0;
  for (const month of seasonMonths) {
    const t = monthTotals(entries, month);
    personNights += t.personNights;
    nightsLogged += t.nightsLogged;
    for (let day = 1; day <= daysInMonth(month); day++) {
      const n = entries[dateKey(month, day)];
      if (n !== undefined && n > busiest) busiest = n;
    }
  }
  const avgPerNight = nightsLogged ? personNights / nightsLogged : 0;
  // How full the pitch ran on the nights it was used, against its capacity.
  const occupancy = nightsLogged
    ? Math.round((personNights / (nightsLogged * pitch.capacity)) * 100)
    : 0;
  return { personNights, nightsLogged, busiest, avgPerNight, occupancy };
}

/** Past nights with an entry, newest first — the dashboard's "Last few nights". */
export function recentNights(entries: Entries, limit = 4) {
  const out: { month: number; day: number; label: string; persons: number }[] = [];
  for (let month = today.month; month >= season.startMonth && out.length < limit; month--) {
    const from = month === today.month ? today.day : daysInMonth(month);
    for (let day = from; day >= 1 && out.length < limit; day--) {
      const n = entries[dateKey(month, day)];
      if (n === undefined) continue;
      out.push({ month, day, label: dayLabel(month, day), persons: n });
    }
  }
  return out;
}

/** Nights that are past, in season, and still have no entry — the compliance
    product's whole job is making these impossible to miss. */
export function unloggedPast(entries: Entries) {
  const out: { month: number; day: number }[] = [];
  for (const month of seasonMonths) {
    for (let day = 1; day <= daysInMonth(month); day++) {
      if (isFuture(month, day) || isToday(month, day)) continue;
      if (entries[dateKey(month, day)] === undefined) out.push({ month, day });
    }
  }
  return out;
}

function isoWeek(month: number, day: number) {
  const date = new Date(Date.UTC(season.year, month - 1, day));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3); // the week's Thursday
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const fDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - fDayNum + 3);
  return 1 + Math.round((date.getTime() - firstThursday.getTime()) / (7 * 86_400_000));
}

/** Person-nights bucketed by ISO week, season start → tonight. The last bar
    is the current week (rendered --amber by the shared chart). */
export function weeklyPersonNights(entries: Entries) {
  const buckets = new Map<number, number>();
  for (const month of seasonMonths) {
    for (let day = 1; day <= daysInMonth(month); day++) {
      if (isFuture(month, day)) continue;
      const week = isoWeek(month, day);
      const n = entries[dateKey(month, day)] ?? 0;
      buckets.set(week, (buckets.get(week) ?? 0) + n);
    }
  }
  return [...buckets.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([week, value]) => ({ label: `W${week}`, value }));
}

export type MonthRow = {
  month: number;
  name: string;
  inProgress: boolean;
  nightsLogged: number;
  personNights: number;
};

/** The by-month ledger — only months the season has actually reached. */
export function monthHistory(entries: Entries): MonthRow[] {
  return seasonMonths
    .filter((m) => m <= today.month)
    .map((m) => ({
      month: m,
      name: monthName(m),
      inProgress: m === today.month,
      ...monthTotals(entries, m),
    }))
    .reverse();
}

/* Topbar notifications, scoped to a single pitch holder. */
export const notifications = [
  {
    id: "n1",
    title: "You haven't logged tonight's guests yet.",
    time: "Today, 21:00",
    unread: true,
    tone: "action" as const,
    href: "/pitch-holder/dashboard",
  },
  {
    id: "n2",
    title: "Midsummer weekend (20–22 Jun) is almost here — expect a busy pitch.",
    time: "2 days ago",
    unread: true,
    tone: "info" as const,
    href: "/pitch-holder/calendar",
  },
  {
    id: "n3",
    title: "Your May report was exported by the campsite admin.",
    time: "1 Jun",
    tone: "info" as const,
    href: "/pitch-holder/summary",
  },
];

/* Signed-in sessions (Profile → Security). */
export const sessions = [
  { id: "s1", device: "iPhone 14 · Safari", place: "Rairanta, FI", last: "Now", current: true },
  { id: "s2", device: "MacBook Air · Chrome", place: "Kuopio, FI", last: "14 Jun, 19:40", current: false },
];
