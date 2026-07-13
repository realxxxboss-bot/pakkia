"use client";

/* ------------------------------------------------------------------
   Portal buttons — the same two-button system as the marketing site
   (DESIGN_SPEC §3), rebuilt for app density.

   SplitButton   — the primary "split-arrow" button. A rectangle split
                   into a label zone + a square arrow zone by a 1px
                   internal divider. Hover darkens + nudges the arrow 3px.
   UnderlineLink — the secondary action everywhere. A text link with a
                   1px underline that animates to amber on hover.

   Never place two boxed buttons side by side: a CTA pair is always one
   SplitButton + one UnderlineLink.
------------------------------------------------------------------ */

import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type SplitVariant = "pine" | "cream" | "amber" | "danger";
type SplitSize = "default" | "compact" | "full";

const VARIANT: Record<
  SplitVariant,
  { fill: string; text: string; divider: string }
> = {
  // pine-700 → pine-900 on hover, cream text (the app default)
  pine: {
    fill: "bg-pine-700 group-hover:bg-pine-900",
    text: "text-cream",
    divider: "bg-[rgba(245,242,234,0.25)]",
  },
  // the light button — only on dark surfaces
  cream: {
    fill: "bg-cream group-hover:bg-white",
    text: "text-pine-900",
    divider: "bg-[rgba(20,52,43,0.2)]",
  },
  // amber-filled — final CTA / holder "log tonight"
  amber: {
    fill: "bg-amber-500 group-hover:bg-amber-deep",
    text: "text-pine-900",
    divider: "bg-[rgba(20,52,43,0.2)]",
  },
  // destructive confirm buttons
  danger: {
    fill: "bg-terracotta group-hover:bg-[#8f4c37]",
    text: "text-cream",
    divider: "bg-[rgba(245,242,234,0.22)]",
  },
};

const SIZE: Record<SplitSize, { pad: string; arrow: string; text: string }> = {
  default: { pad: "px-[1.375rem] py-3", arrow: "w-11", text: "text-[0.9375rem]" },
  compact: { pad: "px-4 py-2", arrow: "w-9", text: "text-[0.875rem]" },
  full: { pad: "px-5 py-3.5", arrow: "w-[52px]", text: "text-[0.9375rem]" },
};

type SplitButtonBaseProps = {
  label: ReactNode;
  variant?: SplitVariant;
  size?: SplitSize;
  loading?: boolean;
  icon?: ReactNode;
  className?: string;
};

type SplitButtonProps = SplitButtonBaseProps &
  (
    | ({ href: string } & Omit<
        ComponentPropsWithoutRef<typeof Link>,
        "href" | "className">)
    | ({ href?: undefined } & Omit<
        ComponentPropsWithoutRef<"button">,
        "className">)
  );

function ArrowZone({
  arrow,
  divider,
  loading,
}: {
  arrow: string;
  divider: string;
  loading?: boolean;
}) {
  return (
    <span
      className={`relative grid flex-none place-items-center self-stretch ${arrow}`}
    >
      <span className={`absolute inset-y-1.5 left-0 w-px ${divider}`} aria-hidden />
      {loading ? (
        <span
          className="size-4 animate-spin rounded-full border-[1.5px] border-current border-t-transparent opacity-70"
          aria-hidden
        />
      ) : (
        <ArrowRight
          size={18}
          strokeWidth={1.75}
          className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-[3px] motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          aria-hidden
        />
      )}
    </span>
  );
}

export function SplitButton({
  label,
  variant = "pine",
  size = "default",
  loading = false,
  icon,
  className = "",
  ...rest
}: SplitButtonProps) {
  const v = VARIANT[variant];
  const s = SIZE[size];
  const full = size === "full";

  const shell = `group inline-flex items-stretch overflow-hidden rounded-[6px] font-medium transition-colors duration-200 ease-[var(--ease-out)] disabled:pointer-events-none disabled:opacity-55 ${v.fill} ${v.text} ${s.text} ${full ? "flex w-full" : ""} ${className}`;

  const inner = (
    <>
      <span className={`flex flex-1 items-center justify-center gap-2 ${s.pad}`}>
        {icon && <span className="flex-none" aria-hidden>{icon}</span>}
        {label}
      </span>
      <ArrowZone arrow={s.arrow} divider={v.divider} loading={loading} />
    </>
  );

  if (rest.href !== undefined) {
    const { href, ...linkRest } = rest;
    return (
      <Link href={href} className={shell} {...linkRest}>
        {inner}
      </Link>
    );
  }

  const { type, disabled, ...btnRest } = rest;
  return (
    <button
      type={type ?? "button"}
      disabled={disabled || loading}
      className={shell}
      {...btnRest}
    >
      {inner}
    </button>
  );
}

/* ---------------- Underline link (secondary action) ---------------- */

type UnderlineTone = "ink" | "cream" | "danger";

const UL_TONE: Record<UnderlineTone, string> = {
  ink: "text-ink-900 hover:text-pine-700 decoration-line hover:decoration-amber-500",
  cream: "text-cream hover:text-cream decoration-line-dark hover:decoration-amber-500",
  danger: "text-terracotta hover:text-terracotta decoration-terracotta/60 hover:decoration-terracotta",
};

type UnderlineLinkProps = {
  children: ReactNode;
  tone?: UnderlineTone;
  arrow?: boolean;
  className?: string;
} & (
  | ({ href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className">)
  | ({ href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className">)
);

export function UnderlineLink({
  children,
  tone = "ink",
  arrow = false,
  className = "",
  ...rest
}: UnderlineLinkProps) {
  const cls = `group inline-flex items-center gap-1.5 text-[0.9375rem] font-medium underline decoration-1 underline-offset-[6px] transition-colors duration-200 ease-[var(--ease-out)] ${UL_TONE[tone]} ${className}`;
  const inner = (
    <>
      {children}
      {arrow && (
        <ArrowRight
          size={15}
          strokeWidth={1.75}
          className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-[3px] motion-reduce:transition-none"
          aria-hidden
        />
      )}
    </>
  );

  if (rest.href !== undefined) {
    const { href, ...linkRest } = rest;
    return (
      <Link href={href} className={cls} {...linkRest}>
        {inner}
      </Link>
    );
  }
  const { type, ...btnRest } = rest;
  return (
    <button type={type ?? "button"} className={cls} {...btnRest}>
      {inner}
    </button>
  );
}
