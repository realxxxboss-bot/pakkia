"use client";

/* Site header (Nordic editorial spec §4), shared by every redesigned page.
   The legacy <Navbar /> stays untouched for the not-yet-migrated pages. */

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SplitButton, TentMark } from "./primitives";
import { EASE } from "./reveal";

const NAV = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Log in", href: "/login" },
];

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="tap-target group relative py-1 font-body text-[0.9375rem] font-medium text-ink-muted transition-colors duration-200 hover:text-pine-900"
    >
      {children}
      <span
        className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-amber-500 transition-transform duration-[250ms] ease-out group-hover:scale-x-100"
        aria-hidden
      />
    </Link>
  );
}

/* The 2-line hamburger that morphs into an X — spec §4. Rendered twice: once
   in the header, once in the overlay (which paints over the header), so the
   control appears to stay in place while the menu opens. */
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-4 w-[22px]" aria-hidden>
      <span
        className={`absolute left-0 top-[3px] block h-px w-full bg-current transition-transform duration-300 ease-[var(--ease-out)] motion-reduce:transition-none ${
          open ? "translate-y-[5px] rotate-45" : ""
        }`}
      />
      <span
        className={`absolute bottom-[3px] left-0 block h-px w-full bg-current transition-transform duration-300 ease-[var(--ease-out)] motion-reduce:transition-none ${
          open ? "-translate-y-[5px] -rotate-45" : ""
        }`}
      />
    </span>
  );
}

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();
  const pathname = usePathname();

  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on route change — the link's own onClick can't cover browser
  // back/forward or a link inside the overlay that renders a new route.
  useEffect(() => setOpen(false), [pathname]);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    // Lock scroll on <html> AND <body>: iOS Safari ignores overflow:hidden on
    // one of them alone once the page is already scrolled.
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Release + close if the viewport grows past the mobile breakpoint.
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);

    // Esc to close, Tab cycles inside the panel (focus trap, spec C.8).
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const el = panelRef.current;
      if (!el) return;
      const items = Array.from(
        el.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ).filter((n) => n.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      mq.removeEventListener("change", onChange);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Move focus into the panel on open, and hand it back to the hamburger on
  // close — otherwise focus is left on a trigger the overlay is painting over.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) {
      panelRef.current?.querySelector<HTMLElement>("a[href], button")?.focus();
    } else if (wasOpen.current) {
      triggerRef.current?.focus();
    }
    wasOpen.current = open;
  }, [open]);

  /* The overlay is portalled to <body> on purpose. The header carries
     `backdrop-blur`, and a backdrop-filter makes an element a containing block
     for its fixed-position descendants — so a `fixed inset-0` overlay nested
     inside the header would size itself to the 64px header box instead of the
     viewport, painting its background over that strip alone and leaving the
     links below it see-through. Portalling puts it in the root stacking
     context, where inset-0 means the viewport. It carries its own logo and
     close button so it never depends on the header's z-index. */
  const overlay = (
    <AnimatePresence>
      {open && (
        <motion.div
          id="home-mobile-nav"
          key="home-mobile-nav"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.25, ease: EASE }}
          className="home-nordic fixed inset-0 z-[100] flex flex-col overflow-y-auto overscroll-contain bg-paper md:hidden"
        >
          {/* Mirrors the header bar exactly, so the logo and the hamburger
              appear to stay put as the panel opens over them. */}
          <div className="flex h-16 flex-none items-center justify-between px-5 sm:px-6">
            <Link
              href="/"
              aria-label="Pakkia home"
              onClick={close}
              className="tap-target flex items-center gap-2 font-familjen text-[1.25rem] font-bold tracking-[-0.02em] text-pine-900"
            >
              <TentMark />
              Pakkia
            </Link>
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="-mr-2.5 flex size-11 items-center justify-center text-pine-900"
            >
              <HamburgerIcon open />
            </button>
          </div>

          <nav
            aria-label="Mobile"
            className="flex flex-1 flex-col px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-8 sm:px-6"
          >
            <ul className="flex flex-col">
              {NAV.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduce ? 0 : 0.3,
                    ease: EASE,
                    delay: reduce ? 0 : 0.05 + i * 0.07,
                  }}
                  className="border-b border-line first:border-t"
                >
                  <Link
                    href={l.href}
                    onClick={close}
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
              transition={{
                duration: reduce ? 0 : 0.3,
                ease: EASE,
                delay: reduce ? 0 : 0.05 + NAV.length * 0.07,
              }}
              className="mt-10"
            >
              <SplitButton href="/signup" onClick={close} className="w-full justify-between">
                Start free
              </SplitButton>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-paper/92 backdrop-blur-sm transition-colors duration-300 ${
        scrolled ? "border-line" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1120px] items-center justify-between px-5 sm:px-6">
        <Link
          href="/"
          aria-label="Pakkia home"
          className="tap-target flex items-center gap-2 font-familjen text-[1.25rem] font-bold tracking-[-0.02em] text-pine-900"
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

        <button
          ref={triggerRef}
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="home-mobile-nav"
          onClick={() => setOpen(true)}
          className="-mr-2.5 flex size-11 items-center justify-center text-pine-900 md:hidden"
        >
          <HamburgerIcon open={false} />
        </button>
      </div>

      {mounted && createPortal(overlay, document.body)}
    </header>
  );
}
