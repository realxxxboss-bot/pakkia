"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

function LogoMark() {
  // 3×3 clay grid — cells 2, 5 and 9 are amber
  return (
    <span className="grid h-8 w-8 flex-none grid-cols-3 grid-rows-3 gap-[2.5px] rounded-[11px] bg-primary p-1.5 shadow-clay-primary">
      {Array.from({ length: 9 }).map((_, i) => (
        <span
          key={i}
          className={`rounded-[2px] ${
            i === 1 || i === 4 || i === 8 ? "bg-amber" : "bg-white/50"
          }`}
        />
      ))}
    </span>
  );
}

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className="transition-transform duration-200 ease-[var(--ease-clay-h)] group-hover:translate-x-1"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => href !== "#" && pathname === href;

  return (
    <header className="sticky top-0 z-[60] bg-transparent pt-4">
      <div className="relative mx-auto max-w-[1240px] px-[var(--pad,64px)] [--pad:18px] sm:[--pad:36px] lg:[--pad:64px]">
        <div className="flex h-[68px] items-center justify-between rounded-full bg-white/80 py-0 pr-3.5 pl-6 shadow-clay-sm backdrop-blur-[14px]">
          <Link
            href="/"
            aria-label="Pakkia home"
            className="flex items-center gap-[11px] font-heading text-[21px] font-bold tracking-[-0.02em] text-ink"
          >
            <LogoMark />
            Pakkia
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={`rounded-full px-4 py-[9px] text-[14.5px] font-medium transition-colors ${
                  isActive(l.href)
                    ? "bg-container text-primary shadow-clay-inset"
                    : "text-secondary hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3.5">
            <Link
              href="#"
              className="group hidden items-center gap-2.5 rounded-full bg-primary px-[22px] py-3 font-body text-[15px] font-semibold text-white shadow-clay-primary transition-[transform,background] duration-300 ease-[var(--ease-clay-h)] hover:-translate-y-0.5 hover:bg-primary-dark sm:flex"
            >
              Start free <Arrow />
            </Link>
            <button
              type="button"
              aria-label="Menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-11 w-[46px] items-center justify-center rounded-[14px] bg-surface shadow-clay-sm md:hidden"
            >
              <span className="relative block h-0.5 w-[18px] rounded-[2px] bg-ink before:absolute before:-top-[6px] before:block before:h-0.5 before:w-[18px] before:rounded-[2px] before:bg-ink before:content-[''] after:absolute after:top-[6px] after:block after:h-0.5 after:w-[18px] after:rounded-[2px] after:bg-ink after:content-['']" />
            </button>
          </div>
        </div>

        {open && (
          <nav className="absolute top-[92px] right-[var(--pad,18px)] left-[var(--pad,18px)] flex flex-col gap-1 rounded-3xl bg-surface p-3.5 shadow-clay md:hidden">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`rounded-full px-4 py-3.5 text-base font-medium ${
                  isActive(l.href)
                    ? "bg-container text-primary shadow-clay-inset"
                    : "text-secondary hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
