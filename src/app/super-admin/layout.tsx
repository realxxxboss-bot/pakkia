import type { Metadata } from "next";
import { SuperAdminShell } from "./_components/SuperAdminShell";
import { requirePortalAccess, toPortalUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Platform Console · Pakkia",
  robots: { index: false, follow: false },
};

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side gate (defence in depth alongside the proxy) — resolves the
  // real signed-in super admin or redirects.
  const profile = await requirePortalAccess("super_admin");
  return (
    <SuperAdminShell user={toPortalUser(profile)} userId={profile.id}>
      {children}
    </SuperAdminShell>
  );
}
