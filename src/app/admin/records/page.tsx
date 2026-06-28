import Link from "next/link";
import { Card, PageHeader } from "@/components/dashboard/primitives";
import { ChevronDownIcon, DownloadIcon } from "@/components/dashboard/icons";
import {
  HEAT_DAYS,
  heatLevel,
  heatPitches,
  rowTotal,
  type HeatLevel,
} from "../data";

const LEVEL_CLASS: Record<HeatLevel, string> = {
  0: "bg-subtle text-muted",
  1: "bg-occ-1 text-primary-dark",
  2: "bg-occ-2 text-primary-dark",
  3: "bg-occ-3 text-white",
  4: "bg-dark text-white",
};

const LEGEND_SWATCHES = ["bg-subtle", "bg-occ-1", "bg-occ-2", "bg-occ-3", "bg-dark"];

function FilterPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-[10px] bg-surface px-3.5 py-2.5 text-[13.5px] font-medium text-secondary ring-1 ring-border">
      {children}
      <ChevronDownIcon size={15} className="text-muted" />
    </span>
  );
}

export default function AdminRecords() {
  return (
    <>
      <PageHeader
        title="Records"
        subtitle="Overnight counts across all pitches. Each cell is the number of persons that night."
        actions={
          <Link
            href="/admin/reports"
            className="inline-flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-[14.5px] font-semibold text-secondary ring-1 ring-border transition-colors duration-150 hover:bg-subtle hover:text-ink"
          >
            <DownloadIcon size={17} />
            Export this view
          </Link>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <FilterPill>Jun 1 – 16, 2026</FilterPill>
        <FilterPill>Area: All</FilterPill>
        <FilterPill>Pitch: All</FilterPill>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto p-4 sm:p-5">
          <table className="w-full min-w-[720px] border-separate border-spacing-[3px]">
            <caption className="sr-only">
              Nightly person counts per pitch, June 1–16 2026
            </caption>
            <thead>
              <tr>
                <th className="w-[130px] pb-2 pl-1 text-left font-eyebrow text-[10px] font-semibold tracking-[0.06em] text-muted uppercase">
                  Pitch
                </th>
                {Array.from({ length: HEAT_DAYS }, (_, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="nums pb-2 text-center font-eyebrow text-[10.5px] font-semibold text-muted"
                  >
                    {i + 1}
                  </th>
                ))}
                <th className="w-[64px] pb-2 pr-1 text-right font-eyebrow text-[10px] font-semibold tracking-[0.06em] text-muted uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {heatPitches.map((p) => (
                <tr key={p.code}>
                  <td className="py-1 pl-1 pr-2 align-middle">
                    <span className="font-heading text-[13.5px] font-semibold text-ink">
                      {p.code}
                    </span>
                    <span className="block text-[11px] text-muted">{p.area}</span>
                  </td>
                  {p.counts.map((v, d) => {
                    const day = d + 1;
                    return (
                      <td key={day} className="p-0 text-center align-middle">
                        <span
                          title={`${p.code}, ${day} June — ${v} persons`}
                          className={`nums grid h-7 w-7 place-items-center rounded-[7px] text-[11px] font-semibold ${LEVEL_CLASS[heatLevel(v)]}`}
                        >
                          {v > 0 ? v : ""}
                        </span>
                      </td>
                    );
                  })}
                  <td className="nums py-1 pr-1 text-right align-middle font-heading text-[14px] font-semibold text-primary">
                    {rowTotal(p)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-border px-5 py-3.5 text-[12.5px] text-secondary">
          <span>Fewer</span>
          {LEGEND_SWATCHES.map((c) => (
            <span key={c} className={`h-4 w-4 rounded-[5px] ${c}`} />
          ))}
          <span>More persons</span>
        </div>
      </Card>
    </>
  );
}
