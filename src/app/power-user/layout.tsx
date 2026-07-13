import type { Metadata } from "next";
import { PowerUserShell } from "./_components/PowerUserShell";
import { requirePortalAccess, toPortalUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Power User · Pakkia",
  // Portal routes must never be indexed. Pairs with the X-Robots-Tag header
  // in proxy.ts + robots.ts.
  robots: { index: false, follow: false },
};

export default async function PowerUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requirePortalAccess("power_user");
  return (
    <PowerUserShell user={toPortalUser(profile)} userId={profile.id}>
      {children}
    </PowerUserShell>
  );
}
