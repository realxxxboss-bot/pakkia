import type { Metadata } from "next";
import { SuperAdminShell } from "./_components/SuperAdminShell";

export const metadata: Metadata = {
  title: "Platform Console · Pakkia",
  // noindex until auth is live (PORTAL_SPEC Security flag).
  robots: { index: false, follow: false },
};

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SuperAdminShell>{children}</SuperAdminShell>;
}
