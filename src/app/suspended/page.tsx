import type { Metadata } from "next";
import NoticeScreen from "@/components/auth/NoticeScreen";

export const metadata: Metadata = {
  title: "Access paused · Pakkia",
  robots: { index: false, follow: false },
};

/* Shown to accounts with status 'suspended'. The proxy confines suspended
   accounts to exactly this route. */
export default function SuspendedPage() {
  return (
    <NoticeScreen
      eyebrow="Account status"
      title="Your access is paused."
      footnote="Signed in as a suspended account"
    >
      <p>
        This account has been suspended, so its portal is temporarily
        unavailable. If you think this is a mistake, please contact your Pakkia
        administrator to have it reviewed.
      </p>
    </NoticeScreen>
  );
}
