"use client";

/* Site header (Nordic editorial spec §4), shared by every redesigned page.
   The legacy <Navbar /> stays untouched for the not-yet-migrated pages. */

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SplitButton, TentMark } from "./primitives";
import { EASE } from "./reveal";

const NAV = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Log in", href: "/login" },
];

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group relative py-1 font-body text-[0.9375rem] font-medium text-ink-muted transition-colors duration-200 hover:text-pine-900"
    >
      {children}
      <span
        className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-amber-500 transition-transform duration-[250ms] ease-out group-hover:scale-x-100"
        aria-hidden
      />
    </Link>
  );
}

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll while the overlay is open; release (and close) if the
  // viewport grows past the mobile breakpoint with the menu still open.
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-paper/92 backdrop-blur-sm transition-colors duration-300 ${
        scrolled ? "border-line" : "border-transparent"
      }`}
    >
      <div className="relative z-[70] mx-auto flex h-16 w-full max-w-[1120px] items-center justify-between px-5 sm:px-6">
        <Link
          href="/"
          aria-label="Pakkia home"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 font-familjen text-[1.25rem] font-bold tracking-[-0.02em] text-pine-900"
        >
          <TentMark />
          Pakkia
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          <NavLink href="/how-it-works">How it works</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
          <NavLink href="/login">Log in</NavLink>
          <SplitButton href="/signup" compact>
            Start free
          </SplitButton>
        </nav>

        {/* 2-line hamburger — small distinctive detail per spec */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="home-mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="relative z-[70] flex h-11 w-11 items-center justify-center text-pine-900 md:hidden"
        >
          <span className="relative block h-4 w-[22px]" aria-hidden>
            <span
              className={`absolute left-0 top-[3px] block h-px w-full bg-current transition-transform duration-300 ${
                open ? "translate-y-[5px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute bottom-[3px] left-0 block h-px w-full bg-current transition-transform duration-300 ${
                open ? "-translate-y-[5px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* Full-screen paper overlay with numbered H2-size links */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="home-mobile-nav"
            key="home-mobile-nav"
            aria-label="Mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="fixed inset-0 z-[60] flex flex-col bg-paper px-5 pb-10 pt-24 md:hidden"
          >
            <ul className="flex flex-col">
              {NAV.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: EASE, delay: 0.05 + i * 0.07 }}
                  className="border-b border-line first:border-t"
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-5 py-5"
                  >
                    <span className="font-spline text-[12px] font-medium text-amber-500 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-familjen text-[clamp(1.9rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-pine-900">
                      {l.label}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE, delay: 0.05 + NAV.length * 0.07 }}
              className="mt-10"
            >
              <SplitButton href="/signup" className="w-full justify-between sm:w-auto">
                Start free
              </SplitButton>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
