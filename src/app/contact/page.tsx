import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { Container, Kicker } from "@/components/ui";
import { Reveal, Rise } from "@/components/motion";

export const metadata: Metadata = {
  title: "Contact — Pakkia",
  description:
    "Tell us a little about your campsite and we'll be in touch within one business day — usually sooner.",
};

const INFO = [
  {
    label: "Email",
    value: "hello@pakkia.fi",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" />
        <path d="M3 7l9 6 9-6" />
      </>
    ),
  },
  {
    label: "Support hours",
    value: "Mon–Fri · 9–17 EET",
    icon: (
      <path d="M5 4h4l2 5-3 2a12 12 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
    ),
  },
  {
    label: "Based in",
    value: "Finland · serving the EU",
    icon: (
      <>
        <path d="M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
  },
];

const NEXT = [
  "We read your note and look at how you track nights today.",
  "We reply within one business day with a clear, honest answer.",
  "If it fits, we help you import your sheet and set up — free.",
];

export default function Contact() {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-14 pb-20 lg:pt-24 lg:pb-28">
          <Container className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Rise>
                <Kicker label="Contact" />
              </Rise>
              <Rise as="div" delay={0.04}>
                <h1 className="max-w-[13ch] text-[clamp(34px,4.2vw,52px)] font-semibold leading-[1.05] tracking-[-0.03em]">
                  Let&apos;s get your site set up.
                </h1>
              </Rise>
              <Rise as="p" delay={0.1} className="mt-6 max-w-[48ch] text-[19px] leading-[1.6] text-secondary">
                Tell us a little about your campsite and we&apos;ll be in touch
                within one business day — usually sooner.
              </Rise>

              <Rise as="div" delay={0.16} className="mt-9 divide-y divide-border border-t border-border">
                {INFO.map((row) => (
                  <div key={row.label} className="flex items-center gap-4 py-4">
                    <div className="grid h-12 w-12 flex-none place-items-center rounded-[12px] bg-primary-tint text-primary-dark">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        {row.icon}
                      </svg>
                    </div>
                    <div>
                      <div className="font-eyebrow text-[10.5px] font-semibold tracking-[0.1em] text-muted uppercase">
                        {row.label}
                      </div>
                      <div className="mt-1 font-heading text-[16px] font-semibold text-ink">
                        {row.value}
                      </div>
                    </div>
                  </div>
                ))}
              </Rise>

              <Rise as="div" delay={0.22} className="mt-9 rounded-[16px] bg-sky p-6 lg:p-7">
                <div className="mb-4 font-eyebrow text-[11px] font-semibold tracking-[0.12em] text-primary-dark uppercase">
                  What happens next
                </div>
                <ol className="flex flex-col gap-3.5">
                  {NEXT.map((step, i) => (
                    <li key={step} className="flex items-start gap-3 text-[15px] leading-[1.5] text-ink">
                      <span className="nums grid h-6 w-6 flex-none place-items-center rounded-full bg-primary font-mono text-[12px] font-semibold text-white">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </Rise>
            </div>

            <Reveal delay={0.08}>
              <ContactForm />
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
