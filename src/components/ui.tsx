/* Shared presentational primitives for the marketing site.
   Server components. Professional Nordic fintech design system. */

export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 ${className}`}
    >
      {children}
    </div>
  );
}

/* Eyebrow / section label — short rule + uppercase tracked label. */
export function Kicker({
  label,
  center = false,
}: {
  label: string;
  center?: boolean;
}) {
  return (
    <div
      className={`mb-5 flex items-center gap-3 ${center ? "justify-center" : ""}`}
    >
      <span className="h-px w-7 bg-primary/50" />
      <span className="font-eyebrow text-[12.5px] font-semibold tracking-[0.16em] text-primary uppercase">
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
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5 ${className}`}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* Button — moderate 10px radius, crisp color shift, tactile press.
   Compose base with one variant. */
export const btn = {
  base: "group inline-flex items-center justify-center gap-2 rounded-[10px] font-body text-[15px] font-semibold leading-none px-5 py-3.5 transition-[transform,background-color,border-color,box-shadow] duration-150 ease-[var(--ease-out)] active:scale-[0.97] focus-visible:outline-2",
  primary:
    "bg-primary text-white shadow-sm hover:bg-primary-dark",
  ghost:
    "bg-surface text-ink ring-1 ring-border hover:ring-border-strong hover:bg-subtle",
  light: "bg-white text-primary shadow-sm hover:bg-white/92",
  darkGhost:
    "bg-transparent text-white ring-1 ring-white/25 hover:bg-white/10 hover:ring-white/40",
};
