import type { Metadata } from "next";
import { PortalPlaceholder } from "@/components/PortalPlaceholder";

export const metadata: Metadata = {
  title: "Super admin · Pakkia",
};

export default function SuperAdminPage() {
  return <PortalPlaceholder role="super_admin" />;
}
