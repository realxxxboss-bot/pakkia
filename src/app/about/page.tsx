/* About — Nordic editorial direction (docs/PAKKIA_INNER_PAGES_SPEC.md §1).
   Shares the site header, footer and design-system primitives with the
   homepage under src/components/site/. Background rhythm:
   paper → paper → paper-deep → paper → paper → pine-900 (CTA + footer). */

import type { Metadata } from "next";
import SiteHeader from "@/components/site/header";
import SiteFooter from "@/components/site/footer";
import AboutHero from "@/components/about/hero";
import ImageBand from "@/components/about/image-band";
import Origin from "@/components/about/origin";
import Values from "@/components/about/values";
import Team from "@/components/about/team";
import PageCta from "@/components/about/cta";

export const metadata: Metadata = {
  title: "About — Pakkia",
  description:
    "A small tool for a duty that never goes away. Pakkia makes the monthly overnight-stay obligation quiet, accurate, and impossible to lose.",
};

export default function About() {
  return (
    <div className="home-nordic bg-paper font-body text-ink-900">
      <SiteHeader />
      <main>
        <AboutHero />
        <ImageBand />
        <Origin />
        <Values />
        <Team />
        <PageCta />
      </main>
      <SiteFooter />
    </div>
  );
}
