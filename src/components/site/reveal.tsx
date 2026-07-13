"use client";

/* Nordic editorial motion helpers — shared by all Nordic-editorial pages.
   One reveal grammar per the spec: opacity 0→1, y 20→0, whileInView once,
   viewport margin -80px, children staggered by 0.07s. Ease [0.22,1,0.36,1],
   250–400ms, no spring, no scale. Reduced motion keeps the opacity fade but
   drops the transform. */

import { motion, useReducedMotion, type Variants } from "motion/react";

export const EASE = [0.22, 1, 0.36, 1] as const;
export const VIEWPORT = { once: true, margin: "-80px" } as const;

type Tag = "div" | "p" | "ul" | "li" | "h1" | "h2" | "span";

export function useRevealVariants(y = 20): Variants {
  const reduce = useReducedMotion();
  return {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: EASE },
    },
  };
}

/* Single element that reveals when it enters the viewport. */
export function Reveal({
  children,
  as = "div",
  delay = 0,
  y = 20,
  className,
}: {
  children: React.ReactNode;
  as?: Tag;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as React.ElementType;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.35, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

/* Parent that staggers its <RevealItem> children by 0.07s.
   mode="mount" plays on load (hero); default plays on scroll into view. */
export function RevealGroup({
  children,
  as = "div",
  className,
  stagger = 0.07,
  mode = "view",
}: {
  children: React.ReactNode;
  as?: Tag;
  className?: string;
  stagger?: number;
  mode?: "view" | "mount";
}) {
  const Comp = motion[as] as React.ElementType;
  const viewProps =
    mode === "mount"
      ? { animate: "visible" }
      : { whileInView: "visible", viewport: VIEWPORT };
  return (
    <Comp
      className={className}
      initial="hidden"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      {...viewProps}
    >
      {children}
    </Comp>
  );
}

export function RevealItem({
  children,
  as = "div",
  y = 20,
  className,
}: {
  children: React.ReactNode;
  as?: Tag;
  y?: number;
  className?: string;
}) {
  const variants = useRevealVariants(y);
  const Comp = motion[as] as React.ElementType;
  return (
    <Comp className={className} variants={variants}>
      {children}
    </Comp>
  );
}
