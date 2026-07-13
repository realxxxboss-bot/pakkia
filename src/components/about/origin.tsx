/* About §1.3 — How it started. Asymmetric 5/7: H2 left, the story right with
   a drop cap on the first paragraph and a pull-quote between the paragraphs.
   The pull-quote's amber left rule is the page's single amber moment besides
   the eyebrows. */

import { Section, SectionEyebrow } from "@/components/site/primitives";
import { Reveal } from "@/components/site/reveal";

export default function Origin() {
  return (
    <Section bg="paper-deep">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5">
          <SectionEyebrow number="02" label="How it started" />
          <h2 className="mt-7 max-w-[16ch] font-familjen text-[clamp(1.9rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-pine-900">
            Started for one campsite. Designed for the rest.
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <p className="text-[1.0625rem] leading-[1.7] text-ink-muted first-letter:float-left first-letter:mr-3 first-letter:font-familjen first-letter:text-[3.2em] first-letter:font-bold first-letter:leading-[0.8] first-letter:text-pine-700">
            Pakkia began as a custom system for a single lakeside site tired of
            re-typing totals every month. It worked — so we rebuilt it as a
            platform any Finnish campsite can switch on in an afternoon.
          </p>
          <blockquote className="my-8 border-l-2 border-amber-500 pl-5 font-familjen text-[1.375rem] font-medium leading-[1.4] tracking-[-0.02em] text-pine-900">
            It does one regulated job well, and stays out of the way the rest
            of the time.
          </blockquote>
          <p className="text-[1.0625rem] leading-[1.7] text-ink-muted">
            We kept it deliberately narrow. Pakkia is not a booking engine or a
            payment processor. It does one regulated job well, stays out of the
            way the rest of the time, and keeps your data inside the EU.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
