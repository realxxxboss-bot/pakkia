/* Contact — Nordic editorial direction (docs/PAKKIA_INNER_PAGES_SPEC.md §4).
   Three sections only: hero + form, reassurance strip, footer. This page
   skips the big dark CTA — the page IS the CTA — and goes straight to the
   standard footer behind a slim "prefer email?" strip. */

import type { Metadata } from "next";
import SiteHeader from "@/components/site/header";
import SiteFooter from "@/components/site/footer";
import { HomeContainer } from "@/components/site/primitives";
import ContactHero from "@/components/contact/hero";
import ReassuranceStrip from "@/components/contact/reassurance";

export const metadata: Metadata = {
  title: "Contact — Pakkia",
  description:
    "Tell us a little about your campsite and we'll be in touch within one business day — usually sooner.",
};

export default function Contact() {
  return (
    <div className="home-nordic bg-paper font-body text-ink-900">
      <SiteHeader />
      <main>
        <ContactHero />
        <ReassuranceStrip />
      </main>
      {/* §4.3 — slim pre-footer strip on the shared pine-900 ending */}
      <div className="border-t border-line-dark bg-pine-900 py-6">
        <HomeContainer>
          <p className="font-spline text-[13px] font-medium text-cream-muted">
            Prefer email?{" "}
            <a
              href="mailto:hello@pakkia.fi"
              className="text-cream transition-colors duration-200 hover:text-amber-500"
            >
              hello@pakkia.fi
            </a>
          </p>
        </HomeContainer>
      </div>
      <SiteFooter />
    </div>
  );
}
