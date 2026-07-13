/* Refund Policy — Nordic editorial (docs/PAKKIA_INNER_PAGES_SPEC.md §7).
   Uses the shared LegalLayout; six short sections, each opened by an
   IN SHORT summary box. DRAFT: the text is a structural placeholder until
   reviewed by a lawyer familiar with Finnish/EU consumer law — every fact
   counsel must confirm is rendered as a visible [bracketed] placeholder.
   Shared facts (dates, support email/hours) come from legal/constants so
   they cannot drift from the other legal pages. */

import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { LegalSection, Pending, Term } from "@/components/legal/prose";
import { LEGAL_FACTS } from "@/components/legal/constants";
import type { TocItem } from "@/components/legal/toc";

export const metadata: Metadata = {
  title: "Refund Policy — Pakkia",
  description:
    "When Pakkia subscription fees are refunded and how to ask: the free month, monthly and yearly plan rules, billing errors, and your EU consumer rights.",
};

const TOC: TocItem[] = [
  { id: "free-month", number: 1, title: "The free month" },
  { id: "monthly-plans", number: 2, title: "Monthly plans" },
  { id: "yearly-plans", number: 3, title: "Yearly plans" },
  { id: "billing-errors", number: 4, title: "Billing errors & duplicates" },
  { id: "how-to-request", number: 5, title: "How to request a refund" },
  { id: "consumer-rights", number: 6, title: "EU consumer rights" },
];

export default function Refunds() {
  return (
    <LegalLayout page="refunds" toc={TOC}>
      <LegalSection
        id="free-month"
        number={1}
        title="The free month"
        inShort="Every subscription starts with a free month and no card on file — so there is usually nothing to refund."
      >
        <p>
          Every Pakkia plan begins with a <Term>free month</Term>. We take no
          card during the trial and charge nothing when it ends — you pay only
          after you actively choose a plan. Because you will have run a full
          reporting cycle before your first invoice, refunds are rarely needed.
          This policy covers the cases where one is.
        </p>
      </LegalSection>

      <LegalSection
        id="monthly-plans"
        number={2}
        title="Monthly plans"
        inShort="Monthly fees are not refunded once a month has started. Cancel anytime to stop the next charge."
      >
        <p>
          Monthly subscription fees are <Term>non-refundable</Term> once a
          billing period has begun.
        </p>
        <p>
          You can cancel at any time with one click in your account settings:
          the current month runs to its end, you keep full access until then,
          and you are never charged again. With a free month up front and no
          long commitment, we keep monthly billing deliberately simple rather
          than pro-rating partial months.
        </p>
      </LegalSection>

      <LegalSection
        id="yearly-plans"
        number={3}
        title="Yearly plans"
        inShort={
          <>
            Cancel a yearly plan within <Pending>30 days</Pending> of payment
            and we refund the unused full months, pro-rated.
          </>
        }
      >
        <p>
          If you cancel a yearly plan within <Pending>30 days</Pending> of the
          payment date, we refund the <Term>unused full months</Term> of your
          term, pro-rated at the yearly rate; the month in which you cancel
          counts as used.
        </p>
        <p>
          After that window the fee is non-refundable and cancelling stops the
          renewal, not the current term — your plan simply runs to the end of
          the paid year. The same rule applies to renewals as to first payments.
        </p>
      </LegalSection>

      <LegalSection
        id="billing-errors"
        number={4}
        title="Billing errors & duplicates"
        inShort="Our mistake, your money back — incorrect and duplicate charges are always refunded in full."
      >
        <p>
          If we ever charge you incorrectly — a duplicate payment, a wrong
          amount, a charge after cancellation — we refund it{" "}
          <Term>in full</Term>, no questions asked. Contact us within{" "}
          <Pending>60 days</Pending> of the charge; once we confirm the error,
          we issue the refund within <Pending>5</Pending> business days.
        </p>
      </LegalSection>

      <LegalSection
        id="how-to-request"
        number={5}
        title="How to request a refund"
        inShort={
          <>
            Email {LEGAL_FACTS.supportEmail} from your account email — we reply
            within one business day.
          </>
        }
      >
        <p>
          Send an email to{" "}
          <a
            href={`mailto:${LEGAL_FACTS.supportEmail}`}
            className="font-medium text-pine-700 underline decoration-line underline-offset-4 transition-colors duration-200 hover:decoration-amber-500"
          >
            {LEGAL_FACTS.supportEmail}
          </a>{" "}
          from the address on your account, with the date and amount of the
          charge. We reply within <Term>one business day</Term> (
          {LEGAL_FACTS.supportHours}).
        </p>
        <p>
          Approved refunds always go back to the{" "}
          <Term>original payment method</Term> — never as vouchers or credit you
          didn&apos;t ask for. Once issued, banks typically take{" "}
          <Pending>5–10</Pending> business days to show the money.
        </p>
      </LegalSection>

      <LegalSection
        id="consumer-rights"
        number={6}
        title="EU consumer rights"
        inShort="Nothing in this policy limits your statutory rights under Finnish or EU consumer law."
      >
        <p>
          Pakkia is sold to businesses, and this policy is written for business
          customers. If you subscribe as a <Term>consumer</Term>, you may have a
          statutory 14-day right of withdrawal under EU consumer law, and
          nothing in this policy limits that or any other statutory right.
        </p>
        <p>
          <Pending>
            How the withdrawal right interacts with the free trial and immediate
            access to the service is to be confirmed by counsel before launch
          </Pending>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
