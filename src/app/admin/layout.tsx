import type { Metadata } from "next";
import { AdminShell } from "./_components/AdminShell";
import { requirePortalAccess, toPortalUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin · Pakkia",
  // Portal routes must never be indexed. Pairs with the X-Robots-Tag header
  // in proxy.ts + robots.ts.
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requirePortalAccess("tenant_admin");
  return (
    <AdminShell user={toPortalUser(profile)} userId={profile.id}>
      {children}
    </AdminShell>
  );
}
