"use client";

/* Holder export (PORTAL_SPEC B4.3 + Part D "dead links fixed").

   The old "Export report" pointed at "#". It now produces a real file, scoped
   to THIS holder's own pitch and nothing else — a holder can export their own
   nights, never the campsite's. The full Statistics Finland export stays with
   the administrator (role boundary, B3.5).

   CSV is generated and downloaded in-page. PDF opens the browser's own
   print-to-PDF over a board-ready sheet (Pakkia logotype, mono figures,
   generated timestamp) — the same document either way, no server round-trip. */

import { useState } from "react";
import {
  Drawer,
  Field,
  RuledRadioGroup,
  SplitButton,
  UnderlineLink,
  useAudit,
  useToast,
} from "@/components/portal";
import {
  dateKey,
  dayLabel,
  daysInMonth,
  holder,
  monthName,
  monthTotals,
  pitch,
  season,
  seasonMonths,
  today,
  type Entries,
} from "../data";

type Format = "csv" | "pdf";

type Night = { iso: string; day: string; persons: number };

function nightsFor(entries: Entries, months: number[]): Night[] {
  const out: Night[] = [];
  for (const month of months) {
    for (let day = 1; day <= daysInMonth(month); day++) {
      const persons = entries[dateKey(month, day)];
      if (persons === undefined) continue;
      out.push({
        iso: `${season.year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        day: dayLabel(month, day),
        persons,
      });
    }
  }
  return out;
}

function download(name: string, body: string, mime: string) {
  const url = URL.createObjectURL(new Blob([body], { type: mime }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportDrawer({
  open,
  onClose,
  entries,
}: {
  open: boolean;
  onClose: () => void;
  entries: Entries;
}) {
  const toast = useToast();
  const { log } = useAudit();
  const [period, setPeriod] = useState<string>("season");
  const [format, setFormat] = useState<Format>("csv");

  const loggedMonths = seasonMonths.filter(
    (m) => m <= today.month && monthTotals(entries, m).nightsLogged > 0,
  );

  const months = period === "season" ? loggedMonths : [Number(period)];
  const periodLabel = period === "season" ? `Season ${season.year}` : monthName(Number(period));

  const run = () => {
    const nights = nightsFor(entries, months);
    const personNights = nights.reduce((s, n) => s + n.persons, 0);
    const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
    const slug = `pakkia-${pitch.code.toLowerCase()}-${periodLabel.toLowerCase().replace(/\s+/g, "-")}`;

    if (format === "csv") {
      const rows = [
        ["Pakkia — pitch report"],
        ["Pitch", pitch.code],
        ["Area", pitch.area],
        ["Campsite", pitch.site],
        ["Holder", holder.name],
        ["Period", periodLabel],
        ["Generated", stamp],
        [],
        ["Date", "Night", "Persons"],
        ...nights.map((n) => [n.iso, n.day, String(n.persons)]),
        [],
        ["Nights logged", String(nights.length)],
        ["Person-nights", String(personNights)],
      ];
      download(
        `${slug}.csv`,
        rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n"),
        "text/csv;charset=utf-8",
      );
    } else {
      const win = window.open("", "_blank", "width=820,height=1000");
      if (!win) {
        toast({ message: "Allow pop-ups to export a PDF.", variant: "danger" });
        return;
      }
      const rows = nights
        .map(
          (n) =>
            `<tr><td>${n.iso}</td><td>${n.day}</td><td class="n">${n.persons}</td></tr>`,
        )
        .join("");
      win.document.write(`<!doctype html><html><head><meta charset="utf-8">
<title>${slug}</title><style>
  @page { margin: 22mm; }
  body { font: 13px/1.6 ui-sans-serif, system-ui, sans-serif; color: #1C2420; }
  h1 { font-size: 20px; letter-spacing: -0.02em; color: #14342B; margin: 0 0 2px; }
  .meta, td.n, th.n, .fig { font-family: ui-monospace, "SF Mono", Menlo, monospace; font-variant-numeric: tabular-nums; }
  .meta { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #5C6660; }
  table { width: 100%; border-collapse: collapse; margin-top: 22px; }
  th, td { border-bottom: 1px solid #E3DDD1; padding: 7px 4px; text-align: left; }
  th { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #5C6660; font-weight: 500; }
  td.n, th.n { text-align: right; }
  tfoot td { border-top: 2px solid #1E4D3F; border-bottom: 0; font-weight: 600; }
  .rule { border-top: 1px solid #E3DDD1; margin-top: 18px; }
  footer { margin-top: 26px; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #5C6660; }
</style></head><body>
  <p class="meta">Pakkia · ${pitch.site}</p>
  <h1>Pitch ${pitch.code} · ${periodLabel}</h1>
  <p class="meta">${pitch.area} · ${holder.name} · Generated ${stamp}</p>
  <div class="rule"></div>
  <table>
    <thead><tr><th>Date</th><th>Night</th><th class="n">Persons</th></tr></thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr><td>Total</td><td class="fig">${nights.length} nights logged</td><td class="n">${personNights}</td></tr>
    </tfoot>
  </table>
  <footer>Person-nights · maps to Statistics Finland figures · logged to audit trail</footer>
</body></html>`);
      win.document.close();
      win.focus();
      win.print();
    }

    log({
      actor: holder.name,
      actorInitials: holder.initials,
      event: "Exported report",
      target: `${pitch.code} · ${periodLabel}`,
      detail: format.toUpperCase(),
      tone: "record",
    });
    toast({ message: `${periodLabel} ${format.toUpperCase()} exported.`, variant: "success" });
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Export report"
      description={`Your pitch ${pitch.code} only.`}
      footer={
        <>
          <UnderlineLink onClick={onClose} className="text-[0.875rem]">
            Cancel
          </UnderlineLink>
          <SplitButton
            size="compact"
            label={`Export ${format.toUpperCase()}`}
            onClick={run}
          />
        </>
      }
    >
      <div className="flex flex-col gap-7">
        <Field label="Period">
          <RuledRadioGroup
            name="period"
            legend="Period"
            value={period}
            onChange={setPeriod}
            options={[
              { value: "season", label: `Season ${season.year}`, hint: season.range },
              ...loggedMonths
                .slice()
                .reverse()
                .map((m) => ({ value: String(m), label: monthName(m) })),
            ]}
          />
        </Field>

        <Field label="Format">
          <RuledRadioGroup
            name="format"
            legend="Format"
            value={format}
            onChange={(v) => setFormat(v as Format)}
            options={[
              { value: "csv", label: "CSV", hint: "One row per night." },
              { value: "pdf", label: "PDF", hint: "A printable sheet of the same figures." },
            ]}
          />
        </Field>

        <p className="font-spline text-[11px] uppercase tracking-[0.1em] leading-relaxed text-ink-muted">
          Maps to Statistics Finland figures · logged to audit trail
        </p>
      </div>
    </Drawer>
  );
}
