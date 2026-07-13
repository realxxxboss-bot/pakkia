/* About §1.1 — Hero. A single-column essay opening: eyebrow, plain H1 (zero
   amber highlights on this page's headings) and an editorial standfirst. */

import { Section, SectionEyebrow } from "@/components/site/primitives";
import { RevealGroup, RevealItem } from "@/components/site/reveal";

export default function AboutHero() {
  return (
    <Section bg="paper" padding="pt-14 pb-14 md:pt-24 md:pb-16">
      <RevealGroup mode="mount" className="max-w-[52rem]">
        <RevealItem>
          <SectionEyebrow number="01" label="Our story" />
        </RevealItem>
        <RevealItem
          as="h1"
          className="mt-7 font-familjen text-[clamp(2.6rem,5.5vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-pine-900"
        >
          A small tool for a duty that never goes away.
        </RevealItem>
        <RevealItem
          as="p"
          className="mt-6 max-w-[44rem] text-[1.125rem] leading-[1.7] text-ink-muted"
        >
          Every campsite above a modest size in Finland must report its
          overnight stays. Most still do it in a spreadsheet built years ago.
          Pakkia exists to make that monthly obligation quiet, accurate, and
          impossible to lose.
        </RevealItem>
      </RevealGroup>
    </Section>
  );
}
