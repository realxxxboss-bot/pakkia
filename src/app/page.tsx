/* Homepage — Nordic editorial direction (docs/PAKKIA_DESIGN_SPEC.md).
   Header, footer and the design-system primitives are shared under
   src/components/site/; the homepage sections live in src/components/home/.
   The rest of the site keeps the legacy Navbar/Footer and the
   SKY/SAGE/LAWN/MOSS palette until each page is migrated. */

import SiteHeader from "@/components/site/header";
import SiteFooter from "@/components/site/footer";
import Hero from "@/components/home/hero";
import StatsStrip from "@/components/home/stats";
import Shift from "@/components/home/shift";
import Interface from "@/components/home/interface";
import Compliance from "@/components/home/compliance";
import Features from "@/components/home/features";
import FinalCta from "@/components/home/final-cta";

export default function Home() {
  return (
    <div className="home-nordic bg-paper font-body text-ink-900">
      <SiteHeader />
      <main>
        <Hero />
        <StatsStrip />
        <Shift />
        <Interface />
        <Compliance />
        <Features />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
