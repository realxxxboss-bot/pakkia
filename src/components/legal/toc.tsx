"use client";

/* Legal §5.1 — on-page table of contents. Desktop: sticky (the parent
   places it), mono 12px links on a continuous 1px hairline; the scroll-spy
   active section gets pine-700 text and a 2px pine-700 left rule laid over
   the hairline. Mobile: collapses to a <details> "On this page" strip.
   Scroll-spy = the last section heading above a fixed line under the sticky
   header, recomputed on rAF-throttled scroll — deterministic and cheap for
   a dozen sections. */

import { useEffect, useRef, useState } from "react";

export type TocItem = { id: string; number: number; title: string };

/* px from viewport top: sticky header (~64px) + breathing room; matches the
   sections' scroll-mt-28 so the active link flips as a heading locks in. */
const SPY_LINE = 120;

function useActiveSection(items: TocItem[]) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const ticking = useRef(false);

  useEffect(() => {
    const measure = () => {
      ticking.current = false;
      let current = items[0]?.id ?? "";
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= SPY_LINE) {
          current = item.id;
        }
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(measure);
      }
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  return active;
}

function TocLink({
  item,
  active,
  className = "",
}: {
  item: TocItem;
  active: boolean;
  className?: string;
}) {
  return (
    <a
      href={`#${item.id}`}
      aria-current={active ? "true" : undefined}
      className={`block border-l-2 py-[5px] pl-4 pr-2 font-spline text-[12px] font-medium leading-[1.5] tabular-nums transition-colors duration-200 ${
        active
          ? "border-pine-700 text-pine-700"
          : "border-transparent text-ink-muted hover:text-pine-900"
      } ${className}`}
    >
      {item.number}. {item.title}
    </a>
  );
}

export default function LegalToc({ items }: { items: TocItem[] }) {
  const active = useActiveSection(items);

  return (
    <>
      {/* mobile: collapsible strip */}
      <details className="group border-y border-line lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-spline text-[12px] font-medium uppercase tracking-[0.12em] text-ink-muted [&::-webkit-details-marker]:hidden">
          On this page
          <span
            className="text-[1.125rem] leading-none transition-transform duration-200 group-open:rotate-45"
            aria-hidden
          >
            +
          </span>
        </summary>
        <ul className="border-l border-line pb-4">
          {items.map((item) => (
            <li key={item.id} className="-ml-px">
              <TocLink item={item} active={active === item.id} />
            </li>
          ))}
        </ul>
      </details>

      {/* desktop: scroll-spy list (parent wrapper handles sticky) */}
      <nav aria-label="On this page" className="hidden lg:block">
        <p className="font-spline text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
          On this page
        </p>
        <ul className="mt-4 border-l border-line">
          {items.map((item) => (
            <li key={item.id} className="-ml-px">
              <TocLink item={item} active={active === item.id} />
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
