/* About §1.6 — Page CTA. Continuous pine-900 into the footer, no floating
   card. Inverted cream-on-dark primary — the honest "tell you honestly"
   paragraph gets room to breathe. */

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
          <SectionEyebrow number="05" label="Talk to us" dark />
          <h2 className="mt-7 font-familjen text-[clamp(1.9rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-cream">
            See if Pakkia fits your site.
          </h2>
          <p className="mt-5 max-w-[36rem] text-[1rem] leading-[1.65] text-cream-muted">
            A short call, a quick look at your current spreadsheet, and
            we&apos;ll tell you honestly whether it&apos;s worth switching.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <SplitButton href="/contact" variant="cream">
              Talk to us
            </SplitButton>
            <UnderlineLink href="/pricing" dark>
              See pricing
            </UnderlineLink>
          </div>
        </Reveal>
      </HomeContainer>
    </section>
  );
}
