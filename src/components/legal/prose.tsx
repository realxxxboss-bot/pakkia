/* Legal §5.1 — prose building blocks shared by all four legal pages.
   Server components: numbered sections ("1. Scope" style headings), the
   "IN SHORT" plain-language summary boxes (marked non-binding), defined
   terms, and visibly-bracketed placeholders for facts that must come from
   legal counsel before launch. */

export function InShort({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 rounded-[6px] border border-line bg-paper-deep p-5">
      <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-spline text-[11px] font-medium uppercase tracking-[0.12em]">
        <span className="text-pine-700">In short</span>
        <span className="text-ink-muted">Non-binding summary</span>
      </p>
      <p className="mt-2 text-[0.9375rem] leading-[1.65] text-ink-900">
        {children}
      </p>
    </div>
  );
}

export function LegalSection({
  id,
  number,
  title,
  inShort,
  children,
}: {
  id: string;
  number: number;
  title: string;
  inShort: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-28 pt-14 first:pt-0"
    >
      <InShort>{inShort}</InShort>
      <h2
        id={`${id}-heading`}
        className="font-familjen text-[1.25rem] font-semibold tracking-[-0.02em] text-pine-900"
      >
        <span className="mr-2.5 font-spline text-[1rem] font-medium text-amber-500 tabular-nums">
          {number}.
        </span>
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[1rem] leading-[1.75] text-ink-muted">
        {children}
      </div>
    </section>
  );
}

/* A defined term on first use — weight 600, full ink. */
export function Term({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-ink-900">{children}</strong>;
}

/* A fact that must be supplied by legal counsel before launch. Rendered in
   mono inside brackets so it is unmistakably a placeholder, on the page and
   in review. */
export function Pending({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-spline text-[0.875em] font-medium">
      [{children}]
    </span>
  );
}

/* Ruled table (§5.1): 1px --line rules only, mono uppercase header, values
   set by the caller (wrap data cells in <Mono> where the spec wants mono).
   Scrolls horizontally on narrow screens instead of breaking the column. */
export function LegalTable({
  caption,
  head,
  rows,
}: {
  /** visually-hidden accessible summary of the table */
  caption: string;
  head: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-y border-line">
            {head.map((h) => (
              <th
                key={h}
                scope="col"
                className="py-3 pr-6 font-spline text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted last:pr-0"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, r) => (
            <tr key={r} className="border-b border-line align-top">
              {cells.map((cell, c) => (
                <td
                  key={c}
                  className="py-3 pr-6 text-[0.9375rem] leading-[1.6] last:pr-0"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* A data value inside legal prose or tables — Spline mono, full pine. */
export function Mono({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-spline text-[0.875em] font-medium text-pine-900 tabular-nums">
      {children}
    </span>
  );
}

/* Plain-marker list at legal-prose rhythm. */
export function LegalList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-ink-muted">
      {children}
    </ul>
  );
}
