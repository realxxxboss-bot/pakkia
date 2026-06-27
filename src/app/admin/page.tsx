import type { Metadata } from "next";
import { PortalPlaceholder } from "@/components/PortalPlaceholder";

export const metadata: Metadata = {
  title: "Campsite admin · Pakkia",
};

export default function AdminPage() {
  return <PortalPlaceholder role="tenant_admin" />;
}
