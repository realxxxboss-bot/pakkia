import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { Container, Kicker } from "@/components/ui";

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

export default function Contact() {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-[54px] pb-[70px] lg:pt-20">
          <Container className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Kicker label="Contact" />
              <h1 className="max-w-[13ch] text-[clamp(34px,4.2vw,52px)] font-semibold tracking-[-0.03em]">
                Let&apos;s get your site set up.
              </h1>
              <p className="mt-[22px] max-w-[48ch] text-[19px] leading-[1.65] text-secondary">
                Tell us a little about your campsite and we&apos;ll be in touch
                within one business day — usually sooner.
              </p>

              <div className="mt-9">
                {INFO.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center gap-4 py-4"
                  >
                    <div className="grid h-12 w-12 flex-none place-items-center rounded-[16px] bg-container text-primary shadow-clay-inset">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        {row.icon}
                      </svg>
                    </div>
                    <div>
                      <div className="font-eyebrow text-[10.5px] tracking-[0.1em] text-secondary uppercase">
                        {row.label}
                      </div>
                      <div className="mt-[3px] font-heading text-[16px] font-semibold">
                        {row.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ContactForm />
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
