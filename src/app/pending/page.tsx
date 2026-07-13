import type { Metadata } from "next";
import NoticeScreen from "@/components/auth/NoticeScreen";

export const metadata: Metadata = {
  title: "Awaiting approval · Pakkia",
  robots: { index: false, follow: false },
};

/* The landing state for every newly-registered campsite admin (status
   'pending'). The proxy confines pending accounts to exactly this route. */
export default function PendingPage() {
  return (
    <NoticeScreen
      eyebrow="Account status"
      title="Your account is awaiting approval."
      footnote="Signed in as a pending account"
    >
      <p>
        Thanks for signing up. A Pakkia administrator is reviewing your campsite
        request — you&apos;ll get an email the moment it&apos;s approved, and
        your portal will open automatically.
      </p>
      <p>
        This usually takes a short while. You&apos;re welcome to close this tab
        and come back later.
      </p>
    </NoticeScreen>
  );
}
