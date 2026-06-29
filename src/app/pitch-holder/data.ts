/* Placeholder data for the Pitch Holder portal demo. No backend.
   A single pitch holder (Aino, pitch A-07 at Rairanta) mid-June 2026. */

export const pitch = {
  code: "A-07",
  area: "Forest edge",
  site: "Rairanta",
  capacity: 9,
};

export const holder = {
  name: "Aino Korhonen",
  firstName: "Aino",
  role: "Pitch holder · A-07",
  initials: "AK",
  email: "aino.k@example.fi",
  phone: "+358 40 123 4567",
};

export const today = { day: 19, label: "Tuesday, 19 June 2026" };

export type DayEntry = { day: number; persons: number | null };

// June 2026 starts on a Monday. Nights logged through the 19th; rest are future.
const JUNE_COUNTS: Record<number, number> = {
  1: 2, 2: 0, 3: 4, 4: 3, 5: 6, 6: 8, 7: 5,
  8: 2, 9: 1, 10: 3, 11: 5, 12: 9, 13: 7, 14: 9,
  15: 4, 16: 6, 17: 6, 18: 5, 19: 0,
};

export const juneDays: DayEntry[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  return {
    day,
    persons: day in JUNE_COUNTS ? JUNE_COUNTS[day] : null,
  };
});

export type EventDay = { range: string; days: number[]; name: string };

export const events: EventDay[] = [
  { range: "20–22 Jun", days: [20, 21, 22], name: "Midsummer · Juhannus weekend" },
  { range: "28 Jun", days: [28], name: "Lakeside market day" },
];

export const eventDays = new Set(events.flatMap((e) => e.days));

/* Topbar notifications, scoped to a single pitch holder. */
export const notifications = [
  {
    id: "n1",
    title: "You haven't logged tonight's guests yet.",
    time: "Today, 21:00",
    unread: true,
  },
  {
    id: "n2",
    title: "Midsummer weekend (20–22 Jun) is almost here — expect a busy pitch.",
    time: "2 days ago",
    unread: true,
  },
  {
    id: "n3",
    title: "Your May report was exported by the campsite admin.",
    time: "1 Jun",
  },
];

export const recentNights = [
  { day: 18, label: "Mon 18 Jun", persons: 5 },
  { day: 17, label: "Sun 17 Jun", persons: 6 },
  { day: 16, label: "Sat 16 Jun", persons: 6 },
  { day: 15, label: "Fri 15 Jun", persons: 4 },
];

export const seasonStats = {
  personNights: 312,
  nightsLogged: 74,
  juneNights: 88,
  busiestNight: 9,
  avgPerNight: 4.2,
  occupancy: 70,
};

export const monthHistory = [
  { month: "June 2026", note: "in progress", personNights: 88, nights: 21 },
  { month: "May 2026", note: null, personNights: 124, nights: 28 },
  { month: "April 2026", note: null, personNights: 100, nights: 25 },
];

// Weekly person-night trend across the season so far (for the summary chart).
export const weeklyTrend = [
  { label: "W19", value: 38 },
  { label: "W20", value: 47 },
  { label: "W21", value: 56 },
  { label: "W22", value: 44 },
  { label: "W23", value: 53 },
  { label: "W24", value: 62 },
  { label: "W25", value: 50 },
];

export const monthTotals = {
  personNights: juneDays.reduce((sum, d) => sum + (d.persons ?? 0), 0),
  nightsLogged: juneDays.filter((d) => (d.persons ?? 0) > 0).length,
};

/* Map a night's person count to an occupancy heat level (teal scale). */
export type HeatLevel = "future" | "empty" | 1 | 2 | 3;

export function heatLevel(persons: number | null): HeatLevel {
  if (persons === null) return "future";
  if (persons === 0) return "empty";
  if (persons <= 3) return 1;
  if (persons <= 6) return 2;
  return 3;
}
