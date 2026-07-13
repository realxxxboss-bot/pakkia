import type { Metadata } from "next";
import { PowerUserShell } from "./_components/PowerUserShell";

export const metadata: Metadata = {
  title: "Power User · Pakkia",
  // Portal routes must never be indexed until auth is live (PORTAL_SPEC
  // Security flag). Pairs with the X-Robots-Tag header in proxy.ts + robots.ts.
  robots: { index: false, follow: false },
};

export default function PowerUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PowerUserShell>{children}</PowerUserShell>;
}
