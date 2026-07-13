/* Nordic editorial primitives — shared by the homepage and the redesigned
   inner pages (docs/PAKKIA_DESIGN_SPEC.md, docs/PAKKIA_INNER_PAGES_SPEC.md).
   Consistency is enforced by this API: sections, numbered eyebrows and the
   two-button system all come from here. Server components. */

import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* ---------- container & section ---------- */

export function HomeContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1120px] px-5 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}

const SECTION_BG = {
  paper: "bg-paper",
  "paper-deep": "bg-paper-deep",
  pine: "bg-pine-900",
} as const;

export function Section({
  bg = "paper",
  children,
  className = "",
  padding = "py-24 md:py-32",
  id,
}: {
  bg?: keyof typeof SECTION_BG;
  children: React.ReactNode;
  className?: string;
  /** override the default vertical rhythm where the spec asks for it */
  padding?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`${SECTION_BG[bg]} ${padding} ${className}`}>
      <HomeContainer>{children}</HomeContainer>
    </section>
  );
}

/* ---------- numbered eyebrow (site-wide identity element) ---------- */

export function SectionEyebrow({
  number,
  label,
  dark = false,
  className = "",
}: {
  number: string;
  label: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="font-spline text-[12px] font-medium text-amber-500 tabular-nums">
        {number}
      </span>
      <span
        className={`mx-[1em] h-px w-8 ${dark ? "bg-line-dark" : "bg-line"}`}
        aria-hidden
      />
      <span
        className={`font-spline text-[12px] font-medium uppercase tracking-[0.12em] ${
          dark ? "text-cream-muted" : "text-ink-muted"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

/* ---------- primary: split-arrow button ---------- */

const SPLIT_VARIANTS = {
  /* default on light sections */
  pine: {
    box: "bg-pine-700 text-cream hover:bg-pine-900",
    divider: "border-[rgba(245,242,234,0.25)]",
  },
  /* the ONLY light button — inverted primary on dark sections */
  cream: {
    box: "bg-cream text-pine-900 hover:bg-white",
    divider: "border-[rgba(20,52,43,0.2)]",
  },
  /* final CTA only */
  amber: {
    box: "bg-amber-500 text-pine-900 hover:bg-amber-deep",
    divider: "border-[rgba(20,52,43,0.2)]",
  },
} as const;

export function SplitButton({
  href,
  children,
  variant = "pine",
  compact = false,
  className = "",
  onClick,
}: {
  /** omit for a purely decorative rendering (e.g. inside the app mockup) */
  href?: string;
  children: React.ReactNode;
  variant?: keyof typeof SPLIT_VARIANTS;
  compact?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const v = SPLIT_VARIANTS[variant];
  const box = `group inline-flex items-stretch rounded-[6px] font-body font-medium leading-none transition-colors duration-200 ${
    compact ? "h-[38px] text-[0.875rem]" : "h-[46px] text-[0.9375rem]"
  } ${v.box} ${className}`;
  const inner = (
    <>
      <span
        className={`flex flex-1 items-center justify-center ${
          compact ? "px-4" : "px-[1.375rem]"
        }`}
      >
        {children}
      </span>
      <span
        className={`flex items-center justify-center border-l ${
          compact ? "w-9" : "w-11"
        } ${v.divider}`}
        aria-hidden
      >
        <ArrowRight
          size={18}
          strokeWidth={2}
          className="transition-transform duration-200 group-hover:translate-x-[3px]"
        />
      </span>
    </>
  );
  // The decorative variant (inside the app mockup) must keep its drawn height;
  // only the real, tappable button clears 44px on touch.
  if (!href) {
    return <span className={box}>{inner}</span>;
  }
  return (
    <Link href={href} className={`tap-min ${box}`} onClick={onClick}>
      {inner}
    </Link>
  );
}

/* ---------- secondary: underline link ---------- */

export function UnderlineLink({
  href,
  children,
  dark = false,
  arrow = false,
  mono = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  dark?: boolean;
  arrow?: boolean;
  /** mono 12px variant for auth chrome / inline meta rows */
  mono?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`tap-target group relative inline-flex items-center gap-1.5 font-medium leading-none transition-colors duration-200 ${
        mono
          ? "pb-[3px] font-spline text-[12px]"
          : "pb-[7px] font-body text-[0.9375rem]"
      } ${dark ? "text-cream" : "text-ink-900 hover:text-pine-700"} ${className}`}
    >
      {children}
      {arrow && (
        <ArrowRight
          size={mono ? 14 : 16}
          strokeWidth={2}
          className="transition-transform duration-200 group-hover:translate-x-[3px]"
          aria-hidden
        />
      )}
      {/* resting rule, 6px under the text */}
      <span
        className={`absolute inset-x-0 bottom-0 h-px ${
          dark ? "bg-line-dark" : "bg-line"
        }`}
        aria-hidden
      />
      {/* amber rule animates in from the left on hover */}
      <span
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-amber-500 transition-transform duration-[250ms] ease-out group-hover:scale-x-100"
        aria-hidden
      />
    </Link>
  );
}

/* ---------- brand mark: minimal tent, 2 strokes ---------- */

export function TentMark({
  size = 18,
  className = "text-pine-700",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3 19L12 4l9 15" />
      <path d="M8.5 19l3.5-6 3.5 6" />
    </svg>
  );
}
