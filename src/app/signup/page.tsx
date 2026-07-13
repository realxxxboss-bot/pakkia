/* Signup — Nordic editorial direction (docs/PAKKIA_INNER_PAGES_SPEC.md §10).
   Reuses the shared split-screen AuthLayout: pine-900 brand panel on the
   left (here a free-month value recap), the form directly on paper on the
   right. No site header/footer here. */

import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Start free — Pakkia",
  description:
    "Create your Pakkia account and run a full month free — no card required. Overnight-stay reporting for Finnish campsites, ready for Statistics Finland.",
};

const RECAP_POINTS = [
  "Set up in an afternoon",
  "Import help included",
  "Cancel with one click",
];

export default function SignupPage() {
  return (
    <AuthLayout
      mobileLine="A free month · no card"
      altPrompt="Already using Pakkia?"
      altLabel="Log in"
      altHref="/login"
      panel={
        <div>
          {/* §10.1 — first-timer value recap */}
          <p className="font-spline text-[12px] font-medium uppercase tracking-[0.12em] text-amber-500">
            Your first season is on us
          </p>
          <p className="mt-3 max-w-[20ch] font-familjen text-[1.5rem] font-semibold leading-[1.3] tracking-[-0.02em] text-cream">
            A full free month. No card. Real reports.
          </p>
          <ul className="mt-10 max-w-[280px] border-t border-line-dark">
            {RECAP_POINTS.map((point) => (
              <li
                key={point}
                className="border-b border-line-dark py-3 font-spline text-[13px] text-cream-muted"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <SignupForm />
    </AuthLayout>
  );
}
