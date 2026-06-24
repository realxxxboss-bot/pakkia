"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Arrow } from "@/components/ui";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

function LogoMark() {
  // 3×3 grid mark — diagonal cells in amber.
  return (
    <span className="grid h-7 w-7 flex-none grid-cols-3 grid-rows-3 gap-[2px] rounded-[7px] bg-primary p-[5px]">
      {Array.from({ length: 9 }).map((_, i) => (
        <span
          key={i}
          className={`rounded-[1.5px] ${
            i === 0 || i === 4 || i === 8 ? "bg-amber" : "bg-white/55"
          }`}
        />
      ))}
    </span>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => href !== "#" && pathname === href;

  return (
    <header className="sticky top-0 z-[60] border-b border-border/80 bg-bg/80 backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          aria-label="Pakkia home"
          className="flex items-center gap-2.5 font-heading text-[19px] font-semibold tracking-[-0.02em] text-ink"
        >
          <LogoMark />
          Pakkia
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`rounded-[8px] px-3 py-2 text-[14.5px] font-medium transition-colors duration-150 ${
                isActive(l.href)
                  ? "bg-subtle text-ink"
                  : "text-secondary hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-[10px] px-3 py-2.5 font-body text-[14.5px] font-semibold text-secondary transition-colors duration-150 hover:text-ink sm:inline-flex"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="group hidden items-center gap-2 rounded-[10px] bg-primary px-4 py-2.5 font-body text-[14.5px] font-semibold text-white shadow-sm transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.97] sm:inline-flex"
          >
            Start free <Arrow />
          </Link>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-[9px] text-ink ring-1 ring-border transition-colors hover:bg-subtle md:hidden"
          >
            <span className="relative block h-[1.5px] w-[18px] rounded-full bg-current before:absolute before:-top-[5.5px] before:block before:h-[1.5px] before:w-[18px] before:rounded-full before:bg-current before:content-[''] after:absolute after:top-[5.5px] after:block after:h-[1.5px] after:w-[18px] after:rounded-full after:bg-current after:content-['']" />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-surface px-5 py-3 md:hidden">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-0.5">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`rounded-[9px] px-3 py-3 text-[15px] font-medium transition-colors ${
                  isActive(l.href)
                    ? "bg-subtle text-ink"
                    : "text-secondary hover:bg-subtle hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3 sm:hidden">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-[9px] px-3 py-3 text-[15px] font-semibold text-ink ring-1 ring-border transition-colors hover:bg-subtle"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="group inline-flex items-center justify-center gap-2 rounded-[9px] bg-primary px-3 py-3 text-[15px] font-semibold text-white transition-[background-color,transform] duration-150 ease-[var(--ease-out)] hover:bg-primary-dark active:scale-[0.97]"
              >
                Start free <Arrow />
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
