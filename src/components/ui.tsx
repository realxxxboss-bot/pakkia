/* Shared presentational primitives for the marketing site.
   Server components — keep the clay design system consistent across pages. */

export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto max-w-[1240px] px-[18px] sm:px-9 lg:px-16 ${className}`}
    >
      {children}
    </div>
  );
}

export function Kicker({
  label,
  center = false,
}: {
  label: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-[26px] ${center ? "flex flex-col items-center" : ""}`}>
      <div className="mb-[18px] h-[6px] w-[26px] rounded-full bg-primary shadow-clay-sm" />
      <span className="font-eyebrow text-[12px] font-semibold tracking-[0.2em] text-primary uppercase">
        {label}
      </span>
    </div>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className={`transition-transform duration-200 ease-[var(--ease-clay-h)] group-hover:translate-x-1 ${className}`}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* Clay button — compose base with a variant. */
export const btn = {
  base: "group inline-flex items-center gap-2.5 rounded-full font-body text-[15px] font-semibold px-[30px] py-4 transition-[transform,background,box-shadow] duration-300 ease-[var(--ease-clay-h)]",
  primary:
    "bg-primary text-white shadow-clay-primary hover:-translate-y-[3px] hover:bg-primary-dark",
  ghost:
    "bg-surface text-primary shadow-clay-sm hover:-translate-y-[3px] hover:shadow-clay-hover",
  light: "bg-white text-primary shadow-clay-light hover:-translate-y-[3px]",
};
