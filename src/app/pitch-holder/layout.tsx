import type { Metadata } from "next";
import { PitchHolderShell } from "./_components/PitchHolderShell";

export const metadata: Metadata = {
  title: "Pitch Holder · Pakkia",
  // Portal routes must never be indexed until auth is live (PORTAL_SPEC
  // Security flag). Pairs with the X-Robots-Tag header in proxy.ts + robots.ts.
  robots: { index: false, follow: false },
};

export default function PitchHolderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PitchHolderShell>{children}</PitchHolderShell>;
}
