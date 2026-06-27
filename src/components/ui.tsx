/* Shared presentational primitives for the marketing site.
   Server components. Professional Nordic fintech design system. */

import Image from "next/image";

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

/* Eyebrow / section label — short rule + uppercase tracked label.
   On SKY/SAGE tinted bands pass tone="tint" so the label uses MOSS and keeps
   AA contrast (LAWN green is too light on those surfaces). */
export function Kicker({
  label,
  center = false,
  tone = "default",
}: {
  label: string;
  center?: boolean;
  tone?: "default" | "tint";
}) {
  const color = tone === "tint" ? "text-primary-dark" : "text-primary";
  const rule = tone === "tint" ? "bg-primary-dark/45" : "bg-primary/50";
  return (
    <div
      className={`mb-5 flex items-center gap-3 ${center ? "justify-center" : ""}`}
    >
      <span className={`h-px w-7 ${rule}`} />
      <span
        className={`font-eyebrow text-[12.5px] font-semibold tracking-[0.16em] uppercase ${color}`}
      >
        {label}
      </span>
    </div>
  );
}

/* Royalty-free photography, optimised through next/image. Fills its parent,
   so the parent must be `relative` with an aspect ratio. Consistent cover
   treatment + optional MOSS gradient scrim for text legibility. */
export function Photo({
  src,
  alt,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  scrim = true,
  className = "",
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  scrim?: boolean;
  className?: string;
}) {
  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover transition-transform duration-[1200ms] ease-[var(--ease-out)] group-hover:scale-[1.03] ${className}`}
      />
      {scrim && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark/30 via-dark/5 to-transparent"
          aria-hidden
        />
      )}
    </>
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
