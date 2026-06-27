import type { Metadata } from "next";
import { PortalPlaceholder } from "@/components/PortalPlaceholder";

export const metadata: Metadata = {
  title: "Power user · Pakkia",
};

export default function PowerUserPage() {
  return <PortalPlaceholder role="power_user" />;
}
