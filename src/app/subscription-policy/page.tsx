/* Subscription Policy (inner-pages spec §8) — 7 numbered sections on the
   shared LegalLayout, each opened by a non-binding "IN SHORT" summary.
   PLACEHOLDER COPY pending lawyer review: facts that must come from counsel
   are rendered via <Pending> so they stay visibly bracketed. Numbers that
   recur across legal pages (export window, notice periods, retention) come
   from legal/constants.ts, and the rate table mirrors the Pricing page —
   plan names, monthly prices and the yearly formula must stay in sync with
   components/pricing/plans.tsx. */

import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { LEGAL_FACTS } from "@/components/legal/constants";
import {
  LegalList,
  LegalSection,
  LegalTable,
  Mono,
  Pending,
  Term,
} from "@/components/legal/prose";
import { UnderlineLink } from "@/components/site/primitives";

export const metadata: Metadata = {
  title: "Subscription Policy — Pakkia",
  description:
    "How Pakkia subscriptions work: plans and billing, the free month, renewals and reminders, prorated plan changes, cancellation, price changes, and failed payments.",
};

/* Must match components/pricing/plans.tsx — same plans, same monthly
   prices, same yearly formula (two months free, rounded). */
const PLANS = [
  { name: "Starter", monthly: 19, capacity: "up to 25 pitches" },
  { name: "Standard", monthly: 39, capacity: "up to 80 pitches" },
  { name: "Multi-site", monthly: 79, capacity: "unlimited pitches · per site" },
] as const;

const yearlyMonthly = (m: number) => Math.round((m * 10) / 12);

const SECTIONS: {
  id: string;
  title: string;
  inShort: React.ReactNode;
  body: React.ReactNode;
}[] = [
  {
    id: "plans-billing",
    title: "Plans & billing cycle",
    inShort:
      "One flat price by site size, billed in advance — monthly, or yearly for two months free. Prices match the Pricing page and exclude VAT.",
    body: (
      <>
        <p>
          Pakkia is sold as a subscription in three plans. The prices below
          are the current prices from the{" "}
          <UnderlineLink href="/pricing">Pricing</UnderlineLink> page; if the
          two ever differ, the Pricing page prevails.
        </p>
        <LegalTable
          caption="Current Pakkia plans with monthly and yearly prices"
          head={["Plan", "Monthly", "Yearly · per month", "Capacity"]}
          rows={PLANS.map((p) => [
            <Term key="name">{p.name}</Term>,
            <Mono key="m">€{p.monthly}</Mono>,
            <Mono key="y">€{yearlyMonthly(p.monthly)}</Mono>,
            <span key="c" className="text-ink-muted">
              {p.capacity}
            </span>,
          ])}
        />
        <p>
          You can pay <Term>monthly</Term> (charged at the start of each
          month of service) or <Term>yearly</Term> (twelve months for the
          price of ten, charged once at the start of the year of service).
          Both are billed <Term>in advance</Term>.
        </p>
        <p>
          All prices exclude VAT. For customers in Finland, Finnish VAT is
          added at the current rate. For business customers elsewhere in the
          EU with a valid VAT ID, the <Term>reverse-charge</Term> mechanism
          applies — we charge no VAT and you account for it in your own
          country. Invoices state the VAT treatment applied.
        </p>
      </>
    ),
  },
  {
    id: "trial-to-paid",
    title: "From free month to paid",
    inShort:
      "The trial ends with no charge, because we never took a card. You actively pick a plan to continue — and only then does auto-renewal start.",
    body: (
      <>
        <p>
          Every subscription starts with a <Term>free month</Term>. We
          collect no payment card during the trial, so when it ends{" "}
          <Term>nothing is charged</Term> — silently or otherwise. There is
          no card on file to charge.
        </p>
        <p>
          To continue after the trial you actively choose a plan and enter
          payment details. Until you do, your site is paused: nothing is
          deleted, and your data remains available for export as described in
          section 5.
        </p>
        <p>
          When you do subscribe, your plan <Term>renews automatically</Term>{" "}
          at the end of each billing period until you cancel (section 5). We
          state this at checkout, before you confirm the first payment, as EU
          rules require — you will never discover auto-renewal from an
          invoice.
        </p>
      </>
    ),
  },
  {
    id: "renewal",
    title: "Renewal & reminders",
    inShort:
      "Plans renew automatically until cancelled. Before a yearly renewal we email you 14 days ahead, with the amount — no surprise charges.",
    body: (
      <>
        <p>
          Monthly plans renew each month and yearly plans each year, at the
          price then in effect (see section 6 for how price changes are
          announced). Each charge is confirmed by an emailed receipt.
        </p>
        <p>
          Before a <Term>yearly</Term> renewal we send a reminder email{" "}
          <Mono>14 days</Mono> in advance, stating the renewal date and the
          exact amount. Cancelling any time before the renewal date stops the
          charge, and your plan runs to the end of the paid year.
        </p>
        <p>
          Monthly plans, with their short cycle, renew without a separate
          reminder — cancelling stops the next charge (section 5).
        </p>
      </>
    ),
  },
  {
    id: "upgrades-downgrades",
    title: "Upgrades & downgrades",
    inShort:
      "Change plans any time — the switch is instant and prorated. Downgrading below your pitch count makes the overflow read-only, never deleted.",
    body: (
      <>
        <p>
          You can switch plans at any time from your account settings. The
          change takes effect <Term>immediately</Term> and is{" "}
          <Term>prorated</Term>: the unused portion of what you already paid,
          calculated by day, is credited against the new plan&rsquo;s price.
          When you upgrade, you pay only the difference for the rest of the
          current period; when you downgrade, the surplus is applied as
          credit to your next invoice rather than refunded (refunds are
          covered by the{" "}
          <UnderlineLink href="/refunds">Refund Policy</UnderlineLink>).
        </p>
        <p>
          If you downgrade to a plan whose pitch limit is below the number of
          pitches on your site, nothing is lost:
        </p>
        <LegalList>
          <li>
            pitches above the new limit become <Term>read-only</Term> — their
            history stays visible and included in reports and exports;
          </li>
          <li>you choose which pitches remain active, up to the new limit;</li>
          <li>
            no data is deleted because of a downgrade — upgrading again
            reactivates the read-only pitches as they were.
          </li>
        </LegalList>
      </>
    ),
  },
  {
    id: "cancellation",
    title: "Cancellation",
    inShort: (
      <>
        Cancel with one click in settings — no call, no email thread. The
        service runs to the end of the paid period, then you have{" "}
        {LEGAL_FACTS.exportWindowDays} days to export everything before
        deletion.
      </>
    ),
    body: (
      <>
        <p>
          You can cancel at any time with <Term>one click</Term> in your
          account settings — no phone call, no email thread, no retention
          offer to click through. Cancelling stops future charges; your plan
          and all access continue to the <Term>end of the paid period</Term>.
          Whether any part of a yearly payment is refunded is governed by the{" "}
          <UnderlineLink href="/refunds">Refund Policy</UnderlineLink>.
        </p>
        <p>
          After the paid period ends, your data remains available for export
          for {LEGAL_FACTS.exportWindowDays} days. When that window closes,
          it is deleted from our production systems within{" "}
          {LEGAL_FACTS.postWindowDeletionDays} days, and rolls off encrypted
          backups within {LEGAL_FACTS.backupRetentionDays} days of deletion —
          the same numbers, in the same order, as the retention section of
          the <UnderlineLink href="/privacy">Privacy &amp; GDPR</UnderlineLink>{" "}
          policy. Billing records we must keep for{" "}
          {LEGAL_FACTS.bookkeepingRetentionYears} years under Finnish
          bookkeeping law are the only exception.
        </p>
      </>
    ),
  },
  {
    id: "price-changes",
    title: "Price changes",
    inShort: (
      <>
        Prices never change mid-period. We give {LEGAL_FACTS.changeNoticeDays}{" "}
        days&rsquo; notice by email, the new price applies from your next
        billing period, and you can cancel before it does.
      </>
    ),
    body: (
      <>
        <p>
          If we change our prices, we announce the change by email and in the
          Service at least <Term>{LEGAL_FACTS.changeNoticeDays} days</Term>{" "}
          before it takes effect — the same notice period as for material
          changes to the{" "}
          <UnderlineLink href="/terms">Terms of Service</UnderlineLink>.
        </p>
        <p>
          A new price applies from your <Term>next billing period</Term>,
          never retroactively: a price you have already paid is locked for
          the period it covers, so a yearly plan keeps its price until
          renewal. If you do not accept the new price, cancel before it takes
          effect (section 5) and you will never pay it.
        </p>
      </>
    ),
  },
  {
    id: "failed-payments",
    title: "Failed payments",
    inShort: (
      <>
        If a charge fails we email you and retry. The worst that happens is
        your account goes <Term>read-only</Term> — your data is never held
        hostage over a payment.
      </>
    ),
    body: (
      <>
        <p>
          If a renewal charge fails, we email you right away and retry the
          payment on a schedule of{" "}
          <Pending>
            retry schedule — to be confirmed, e.g. days 3, 7 and 14 after the
            failed charge
          </Pending>
          . You can update your payment details and retry manually at any
          point; your account stays fully usable throughout this{" "}
          <Pending>14-day</Pending> grace period.
        </p>
        <p>
          If payment still has not gone through when the grace period ends,
          your account becomes <Term>read-only</Term>: you and your team can
          still sign in, view every record, and export everything — you just
          cannot log new nights. Settling the outstanding invoice restores
          full access immediately.
        </p>
        <p>
          <Term>Read-only, never hostage:</Term> we do not delete data over a
          failed payment, ever. Deletion happens only on the cancellation
          path described in section 5, with the same export window. If you
          are stuck, write to{" "}
          <UnderlineLink href={`mailto:${LEGAL_FACTS.supportEmail}`}>
            {LEGAL_FACTS.supportEmail}
          </UnderlineLink>{" "}
          ({LEGAL_FACTS.supportHours}) and a person will sort it out.
        </p>
      </>
    ),
  },
];

export default function SubscriptionPolicyPage() {
  return (
    <LegalLayout
      page="subscription"
      toc={SECTIONS.map((s, i) => ({
        id: s.id,
        number: i + 1,
        title: s.title,
      }))}
    >
      {SECTIONS.map((s, i) => (
        <LegalSection
          key={s.id}
          id={s.id}
          number={i + 1}
          title={s.title}
          inShort={s.inShort}
        >
          {s.body}
        </LegalSection>
      ))}
    </LegalLayout>
  );
}
