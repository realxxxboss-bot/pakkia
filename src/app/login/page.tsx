/* Login — Nordic editorial direction (docs/PAKKIA_INNER_PAGES_SPEC.md §9).
   Split-screen AuthLayout: pine-900 brand panel with the audit-log ticker,
   the form directly on paper on the right. No site header/footer here. */

import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import AuditTicker from "@/components/site/audit-ticker";

export const metadata: Metadata = {
  title: "Log in — Pakkia",
  description:
    "Log in to Pakkia — overnight-stay reporting for Finnish campsites, ready for Statistics Finland.",
};

export default function LoginPage() {
  return (
    <AuthLayout
      mobileLine="Nights logged, not re-typed."
      altPrompt="New to Pakkia?"
      altLabel="Start free"
      altHref="/signup"
      panel={
        <div>
          <p className="font-spline text-[12px] font-medium uppercase tracking-[0.12em] text-amber-500">
            Tonight, across Finland
          </p>
          <p className="mt-3 max-w-[18ch] font-familjen text-[1.5rem] font-semibold leading-[1.3] tracking-[-0.02em] text-cream">
            Nights logged, not re-typed.
          </p>
          <div className="mt-10 max-w-[300px]">
            <AuditTicker />
          </div>
        </div>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
