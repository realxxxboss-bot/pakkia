"use client";

/* Tasteful, reduced-motion-safe entrance/scroll reveals (Motion / Framer).
   Durations stay <300ms with a single custom ease so the whole site shares
   one rhythm. When the user prefers reduced motion, content renders in place
   with no transform and no opacity flash. */

import { motion, useReducedMotion } from "motion/react";

const EASE = [0.23, 1, 0.32, 1] as const;

type Tag = "div" | "p" | "li" | "span" | "section" | "ul" | "ol";

type RevealProps = {
  children: React.ReactNode;
  /** seconds of delay — use small steps (≤0.24) for staggered groups */
  delay?: number;
  /** vertical travel in px (default 16) */
  y?: number;
  className?: string;
  /** render as a paragraph, list item, span, etc. — defaults to div */
  as?: Tag;
};

/* Scroll-triggered reveal: plays once when the element enters the viewport. */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as React.ElementType;

  if (reduce) {
    return <Comp className={className}>{children}</Comp>;
  }

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.28, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

/* Above-the-fold reveal: plays on mount rather than on scroll. */
export function Rise({
  children,
  delay = 0,
  y = 18,
  className,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as React.ElementType;

  if (reduce) {
    return <Comp className={className}>{children}</Comp>;
  }

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}
