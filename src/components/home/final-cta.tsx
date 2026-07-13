/* Section 07 — Final CTA (spec §11). Shares one continuous pine-900
   background with the footer that follows — no floating CTA card. The only
   amber-filled button on the page lives here. */

import { HomeContainer, SectionEyebrow, SplitButton, UnderlineLink } from "@/components/site/primitives";
import { Reveal } from "@/components/site/reveal";

export default function FinalCta() {
  return (
    <section className="border-t border-line-dark bg-pine-900 py-28">
      <HomeContainer>
        <Reveal className="max-w-[44rem]">
          <SectionEyebrow number="06" label="Start now" dark />
          <h2 className="mt-7 font-familjen text-[clamp(1.9rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-cream">
            Your first season on Pakkia is{" "}
            <span className="text-amber-500">on us</span>.
          </h2>
          <p className="mt-5 max-w-[36rem] text-[1rem] leading-[1.65] text-cream-muted">
            Set up your pitches, invite your team, and run a full month before
            you decide.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <SplitButton href="/signup" variant="amber">
              Start free
            </SplitButton>
            <UnderlineLink href="/pricing" dark>
              See pricing
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
