/* Homepage — Nordic editorial direction (docs/PAKKIA_DESIGN_SPEC.md).
   Header, footer and all sections are homepage-scoped components under
   src/components/home/; the rest of the site keeps the shared Navbar/Footer
   and the SKY/SAGE/LAWN/MOSS palette. */

import HomeHeader from "@/components/home/header";
import Hero from "@/components/home/hero";
import StatsStrip from "@/components/home/stats";
import Shift from "@/components/home/shift";
import Interface from "@/components/home/interface";
import Compliance from "@/components/home/compliance";
import Features from "@/components/home/features";
import FinalCta from "@/components/home/final-cta";
import HomeFooter from "@/components/home/footer";

export default function Home() {
  return (
    <div className="home-nordic bg-paper font-body text-ink-900">
      <HomeHeader />
      <main>
        <Hero />
        <StatsStrip />
        <Shift />
        <Interface />
        <Compliance />
        <Features />
        <FinalCta />
      </main>
      <HomeFooter />
    </div>
  );
}
