/* The four steps (spec §2.2) — copy carried over from the previous page.
   Shared by the hero's mini-timeline and the steps timeline itself. */

export type Step = {
  id: string;
  number: string;
  title: string;
  body: string;
  /** instrument-style time-cost tag, rendered after a 16px rule segment */
  time: string;
};

export const STEPS: Step[] = [
  {
    id: "step-01",
    number: "01",
    title: "Set up your pitches",
    body: "Add your pitch numbers and areas once. An admin assigns each holder to a pitch and defines the season dates.",
    time: "one afternoon",
  },
  {
    id: "step-02",
    number: "02",
    title: "Log the nights",
    body: "Staff or pitch holders open the calendar and enter the number of persons per night. One tap, one number — on any phone.",
    time: "daily · 10 seconds",
  },
  {
    id: "step-03",
    number: "03",
    title: "Pakkia does the maths",
    body: "Totals roll up per pitch, day, month and season automatically. Every entry is timestamped and logged for the audit trail.",
    time: "automatic",
  },
  {
    id: "step-04",
    number: "04",
    title: "Export & file",
    body: "At month end, download a Statistics Finland-ready CSV or a formatted PDF for the board. No re-typing, no reformatting.",
    time: "one click",
  },
];
