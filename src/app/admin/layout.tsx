import type { Metadata } from "next";
import { AdminShell } from "./_components/AdminShell";

export const metadata: Metadata = {
  title: "Admin · Pakkia",
  // Portal routes must never be indexed until auth is live (PORTAL_SPEC
  // Security flag). Pairs with the X-Robots-Tag header in proxy.ts + robots.ts.
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
