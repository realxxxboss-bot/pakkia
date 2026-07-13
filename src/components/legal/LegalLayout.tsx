/* Legal pages — shared template (inner-pages spec §5.1), used by /terms,
   /privacy, /refunds and /subscription-policy. Paper background throughout:
   no dark sections, no photos, no CTA sections — typographically calm and
   fast. Compact hero (eyebrow "Legal — [page]", H1 at H2 size, dated meta
   line, draft-pending-review notice), then a 3/9 body: sticky scroll-spy
   TOC left (a <details> strip on mobile), legal prose right, and a slim
   ruled strip cross-linking the other three legal pages. Server component;
   the TOC is the only client island. */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/site/header";
import SiteFooter from "@/components/site/footer";
import {
  HomeContainer,
  Section,
  SectionEyebrow,
} from "@/components/site/primitives";
import LegalToc, { type TocItem } from "./toc";
import { LEGAL_META, LEGAL_PAGES, type LegalPageKey } from "./constants";

export default function LegalLayout({
  page,
  toc,
  heroExtra,
  children,
}: {
  page: LegalPageKey;
  toc: TocItem[];
  /** rendered directly under the hero meta line, full container width —
      e.g. the privacy fact strip (inner-pages spec §6) */
  heroExtra?: React.ReactNode;
  children: React.ReactNode;
}) {
  const current = LEGAL_PAGES.find((p) => p.key === page)!;
  const others = LEGAL_PAGES.filter((p) => p.key !== page);

  return (
    <div className="home-nordic bg-paper font-body text-ink-900">
      <SiteHeader />
      <main>
        <Section bg="paper" padding="py-16">
          <SectionEyebrow number="Legal" label={current.title} />
          <h1 className="mt-6 max-w-[46rem] font-familjen text-[clamp(1.9rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-pine-900">
            {current.title}
          </h1>
          <p className="mt-8 max-w-[46rem] border-t border-line pt-4 font-spline text-[12px] font-medium text-ink-muted tabular-nums">
            Last updated · {LEGAL_META.lastUpdated} — Effective ·{" "}
            {LEGAL_META.effective}
          </p>
          {heroExtra && <div className="mt-8">{heroExtra}</div>}
          {/* Visible on every legal page until counsel signs the text off. */}
          <div className="mt-6 max-w-[46rem] rounded-[6px] border border-line bg-paper-deep px-5 py-4">
            <p className="font-spline text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
              Draft — pending legal review
            </p>
            <p className="mt-1.5 text-[0.875rem] leading-[1.6] text-ink-muted">
              This text is a working draft and has not yet been reviewed by
              legal counsel. Bracketed items are placeholders. The final,
              binding version will be published before the effective date.
            </p>
          </div>
        </Section>

        <div className="pb-24 md:pb-28">
          <HomeContainer>
            <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-10">
              <aside className="lg:col-span-3">
                <div className="lg:sticky lg:top-28">
                  <LegalToc items={toc} />
                </div>
              </aside>
              <div className="lg:col-span-9">
                <div className="max-w-[46rem]">{children}</div>
              </div>
            </div>

            {/* slim ruled strip → the other three legal pages */}
            <nav aria-label="Other legal pages" className="mt-20">
              <p className="font-spline text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
                Also in legal
              </p>
              <div className="mt-3 grid divide-y divide-line border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {others.map((p) => (
                  <Link
                    key={p.key}
                    href={p.href}
                    className="group flex items-center justify-between gap-4 py-4 text-[0.9375rem] font-medium text-ink-900 transition-colors duration-200 hover:text-pine-700 sm:px-5 sm:first:pl-0 sm:last:pr-0"
                  >
                    {p.title}
                    <ArrowRight
                      size={16}
                      strokeWidth={2}
                      className="text-ink-muted transition-all duration-200 group-hover:translate-x-[3px] group-hover:text-pine-700"
                      aria-hidden
                    />
                  </Link>
                ))}
              </div>
            </nav>
          </HomeContainer>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
