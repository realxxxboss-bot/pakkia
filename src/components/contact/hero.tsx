/* Contact §4.1 — hero + the 5/7 two-column body. Left: a ruled definition
   list and the "what happens next" mini timeline (a small echo of the
   how-it-works timeline). Right: the form, the page's single card. On mobile
   the form stacks first — it is the page's whole point. */

import {
  Section,
  SectionEyebrow,
  UnderlineLink,
} from "@/components/site/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import ContactForm from "@/components/contact/form";

const INFO: { label: string; value: React.ReactNode }[] = [
  {
    label: "Email",
    value: <UnderlineLink href="mailto:hello@pakkia.fi">hello@pakkia.fi</UnderlineLink>,
  },
  {
    label: "Support hours",
    value: (
      <span className="font-spline text-[0.9375rem] font-medium text-ink-900 tabular-nums">
        Mon–Fri · 9–17 EET
      </span>
    ),
  },
  {
    label: "Based in",
    value: <span className="text-[1rem] text-ink-900">Finland · serving the EU</span>,
  },
];

const NEXT = [
  "We read your note and look at how you track nights today.",
  "We reply within one business day with a clear, honest answer.",
  "If it fits, we help you import your sheet and set up — free.",
];

export default function ContactHero() {
  return (
    <Section bg="paper" padding="pt-14 pb-16 md:pt-24 md:pb-20">
      <RevealGroup mode="mount" className="max-w-[52rem]">
        <RevealItem>
          <SectionEyebrow number="01" label="Contact" />
        </RevealItem>
        <RevealItem
          as="h1"
          className="mt-7 font-familjen text-[clamp(2.6rem,5.5vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-pine-900"
        >
          Let&apos;s get your site set up.
        </RevealItem>
        <RevealItem
          as="p"
          className="mt-6 max-w-[36rem] text-[1.0625rem] leading-[1.65] text-ink-muted"
        >
          Tell us a little about your campsite and we&apos;ll be in touch
          within{" "}
          <span className="font-semibold text-pine-700">one business day</span>{" "}
          — usually sooner.
        </RevealItem>
      </RevealGroup>

      <div className="mt-12 grid items-start gap-12 md:mt-16 lg:grid-cols-12 lg:gap-10">
        {/* form first in the DOM so it leads on mobile; visually right on lg */}
        <Reveal delay={0.15} className="lg:order-2 lg:col-span-7">
          <ContactForm />
        </Reveal>

        <Reveal className="lg:order-1 lg:col-span-5">
          <dl className="border-t border-line">
            {INFO.map((row) => (
              <div
                key={row.label}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line py-4"
              >
                <dt className="font-spline text-[12px] font-medium uppercase tracking-[0.12em] text-ink-muted">
                  {row.label}
                </dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-12 flex items-center gap-4">
            <span className="font-spline text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
              What happens next
            </span>
            <span className="h-px flex-1 bg-line" aria-hidden />
          </div>

          <ol className="relative mt-6 flex flex-col gap-4">
            {/* the vertical rule threading the step numbers */}
            <span
              className="absolute bottom-2 left-[7px] top-2 w-px bg-line"
              aria-hidden
            />
            {NEXT.map((step, i) => (
              <li key={step} className="flex items-baseline gap-4">
                <span className="relative z-10 bg-paper py-1 font-spline text-[12px] font-medium leading-none text-amber-500 tabular-nums">
                  {`0${i + 1}`}
                </span>
                <span className="text-[0.9375rem] leading-[1.6] text-ink-muted">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </Section>
  );
}
