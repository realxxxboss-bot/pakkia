"use client";

/* ------------------------------------------------------------------
   RuledTabs (PORTAL_SPEC B3.5 view switch, B1.2 campsite-detail tabs) — the
   ruled-tab pattern: plain mono labels on a 1px --line baseline, the active
   one carrying a 2px --pine-700 bottom rule (radius 0). Not a segmented
   control, not pills.
------------------------------------------------------------------ */

export type RuledTab<T extends string> = { value: T; label: string };

export function RuledTabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
}: {
  tabs: RuledTab<T>[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="flex items-end gap-6 border-b border-line">
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.value)}
            className={`-mb-px border-b-2 pb-2.5 font-spline text-[12px] uppercase tracking-[0.12em] transition-colors duration-150 ${
              active
                ? "border-pine-700 text-pine-900"
                : "border-transparent text-ink-muted hover:text-ink-900"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
