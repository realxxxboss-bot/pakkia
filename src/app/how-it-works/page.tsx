/* How it works — Nordic editorial direction (docs/PAKKIA_INNER_PAGES_SPEC.md
   §2). Shares the site header, footer and design-system primitives with the
   homepage under src/components/site/. Background rhythm: paper (hero) →
   paper-deep (steps) → pine-900 (roles) → paper (onboarding) → pine-900
   (CTA + footer). The hero's mini-timeline and the steps timeline share
   scroll state through StepScrollProvider. */

import type { Metadata } from "next";
import SiteHeader from "@/components/site/header";
import SiteFooter from "@/components/site/footer";
import { StepScrollProvider } from "@/components/how-it-works/steps-context";
import HowHero from "@/components/how-it-works/hero";
import Steps from "@/components/how-it-works/steps";
import Roles from "@/components/how-it-works/roles";
import Onboarding from "@/components/how-it-works/onboarding";
import PageCta from "@/components/how-it-works/cta";

export const metadata: Metadata = {
  title: "How it works — Pakkia",
  description:
    "Four steps from set-up to a filed report. The totals, formatting and traceability happen on their own — your team only ever logs the nights.",
};

export default function HowItWorks() {
  return (
    <div className="home-nordic bg-paper font-body text-ink-900">
      <SiteHeader />
      <main>
        <StepScrollProvider>
          <HowHero />
          <Steps />
        </StepScrollProvider>
        <Roles />
        <Onboarding />
        <PageCta />
      </main>
      <SiteFooter />
    </div>
  );
}
