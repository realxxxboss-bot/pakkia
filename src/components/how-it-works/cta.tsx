/* §2.5 — Page CTA. Continuous pine-900 into the footer, no floating card.
   Inverted cream-on-dark primary per the system (amber-filled buttons stay
   exclusive to the homepage final CTA). */

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
          <SectionEyebrow number="05" label="Get set up" dark />
          <h2 className="mt-7 font-familjen text-[clamp(1.9rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-cream">
            Your first month is a real month.
          </h2>
          <p className="mt-5 max-w-[36rem] text-[1rem] leading-[1.65] text-cream-muted">
            We&apos;ll help you import your current sheet and set up your
            first pitches at no cost.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <SplitButton href="/contact" variant="cream">
              Get set up
            </SplitButton>
            <UnderlineLink href="/signup" dark>
              Start free instead
            </UnderlineLink>
          </div>
        </Reveal>
      </HomeContainer>
    </section>
  );
}
