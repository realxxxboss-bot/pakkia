/* Pricing §3.5 — page CTA, continuous pine-900 into the footer. The
   pricing page's single amber-filled button lives here, mirroring the
   homepage final CTA. */

import {
  HomeContainer,
  SectionEyebrow,
  SplitButton,
  UnderlineLink,
} from "@/components/site/primitives";
import { Reveal } from "@/components/site/reveal";

export default function PageCta() {
  return (
    <section className="border-t border-line-dark bg-pine-900 py-28">
      <HomeContainer>
        <Reveal className="max-w-[44rem]">
          <SectionEyebrow number="04" label="Start now" dark />
          <h2 className="mt-7 font-familjen text-[clamp(1.9rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-cream">
            Run a real month before you pay a cent.
          </h2>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <SplitButton href="/signup" variant="amber">
              Start free
            </SplitButton>
            <UnderlineLink href="/contact" dark>
              Talk to us
            </UnderlineLink>
          </div>
          <p className="mt-6 font-spline text-[12px] font-medium text-cream-muted">
            No card required
          </p>
        </Reveal>
      </HomeContainer>
    </section>
  );
}
