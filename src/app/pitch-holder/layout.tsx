import type { Metadata } from "next";
import { PitchHolderShell } from "./_components/PitchHolderShell";
import { requirePortalAccess, toPortalUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Pitch Holder · Pakkia",
  // Portal routes must never be indexed. Pairs with the X-Robots-Tag header
  // in proxy.ts + robots.ts.
  robots: { index: false, follow: false },
};

export default async function PitchHolderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requirePortalAccess("pitch_holder");
  return (
    <PitchHolderShell user={toPortalUser(profile)} userId={profile.id}>
      {children}
    </PitchHolderShell>
  );
}
