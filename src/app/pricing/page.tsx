/* Pricing — Nordic editorial direction (docs/PAKKIA_INNER_PAGES_SPEC.md §3).
   Shares the site header, footer and design-system primitives with the
   homepage under src/components/site/. Background rhythm:
   paper (hero + rate table) → paper-deep (always included) → paper (FAQ)
   → pine-900 (CTA + footer). */

import type { Metadata } from "next";
import SiteHeader from "@/components/site/header";
import SiteFooter from "@/components/site/footer";
import PricingSections from "@/components/pricing/sections";
import Included from "@/components/pricing/included";
import Faq from "@/components/pricing/faq";
import PageCta from "@/components/pricing/cta";

export const metadata: Metadata = {
  title: "Pricing — Pakkia",
  description:
    "Plain pricing. No per-night fees. One flat monthly price by site size — every plan includes exports, audit log and EU hosting.",
};

export default function Pricing() {
  return (
    <div className="home-nordic bg-paper font-body text-ink-900">
      <SiteHeader />
      <main>
        <PricingSections />
        <Included />
        <Faq />
        <PageCta />
      </main>
      <SiteFooter />
    </div>
  );
}
