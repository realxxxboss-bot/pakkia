/* Terms of Service (inner-pages spec §5.2) — 12 numbered sections on the
   shared LegalLayout, each opened by a non-binding "IN SHORT" summary.
   PLACEHOLDER COPY pending lawyer review: facts that must come from counsel
   are rendered via <Pending> so they stay visibly bracketed. Numbers that
   recur across legal pages (export window, notice periods, support hours)
   come from legal/constants.ts so Terms, Privacy and Subscription Policy
   can never disagree. */

import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { LEGAL_FACTS } from "@/components/legal/constants";
import {
  LegalList,
  LegalSection,
  Pending,
  Term,
} from "@/components/legal/prose";
import { UnderlineLink } from "@/components/site/primitives";

export const metadata: Metadata = {
  title: "Terms of Service — Pakkia",
  description:
    "The terms that govern the use of Pakkia, the overnight-stay reporting service for Finnish campsites. With plain-language summaries for every section.",
};

const SECTIONS: {
  id: string;
  title: string;
  inShort: React.ReactNode;
  body: React.ReactNode;
}[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    inShort:
      "Pakkia is run by a small Finnish company. This section says who operates the service and how to reach us.",
    body: (
      <>
        <p>
          The Pakkia service (the <Term>Service</Term>) is operated by{" "}
          <Pending>Company name — to be added</Pending> (<Term>Pakkia</Term>,{" "}
          &ldquo;we&rdquo;, &ldquo;us&rdquo;), a company registered in
          Finland.
        </p>
        <LegalList>
          <li>
            Business ID: <Pending>Business ID — to be added</Pending>
          </li>
          <li>
            Registered address:{" "}
            <Pending>Registered address — to be added</Pending>
          </li>
          <li>
            Contact:{" "}
            <UnderlineLink href={`mailto:${LEGAL_FACTS.supportEmail}`}>
              {LEGAL_FACTS.supportEmail}
            </UnderlineLink>
          </li>
        </LegalList>
        <p>
          These terms are an agreement between us and the organisation or
          person using the Service. By creating an account or using the
          Service you accept them.
        </p>
      </>
    ),
  },
  {
    id: "the-service",
    title: "The service",
    inShort:
      "Pakkia logs overnight stays and turns them into reports. It is not a booking or payment system, and filing with Statistics Finland remains your responsibility.",
    body: (
      <>
        <p>
          The Service is a tool for logging overnight stays at campsites and
          similar accommodation sites, and for producing reports and exports
          from those records — including exports in the format requested by
          Statistics Finland.
        </p>
        <p>The Service is not:</p>
        <LegalList>
          <li>a booking, reservation, or guest-registry system;</li>
          <li>a payment or point-of-sale system;</li>
          <li>legal, tax, or accounting advice.</li>
        </LegalList>
        <p>
          Reports are generated from the data entered into the Service. The
          Customer (defined in section 3) remains solely responsible for
          reviewing reports and for filing them with Statistics Finland or
          any other authority on time.
        </p>
      </>
    ),
  },
  {
    id: "accounts-roles",
    title: "Accounts & roles",
    inShort:
      "Keep your login safe, keep your team's access right, and make sure what gets entered is accurate.",
    body: (
      <>
        <p>
          The organisation that opens an account (the <Term>Customer</Term>)
          controls who may access its site in the Service, using three
          roles: <Term>Admin</Term> (full control, including billing and
          access management), <Term>Staff</Term> (day-to-day logging and
          reports), and <Term>Pitch holder</Term> (only their own nights).
        </p>
        <p>The Customer is responsible for:</p>
        <LegalList>
          <li>deciding who receives access and with which role;</li>
          <li>
            keeping credentials confidential and notifying us without undue
            delay of any suspected unauthorised use;
          </li>
          <li>
            the accuracy of the data its users enter — the Service reports
            what was logged.
          </li>
        </LegalList>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    inShort:
      "Use Pakkia for your own site's reporting. Don't break the law with it, poke at other customers' data, or try to take the service apart.",
    body: (
      <>
        <p>When using the Service you must not:</p>
        <LegalList>
          <li>use it for any unlawful purpose;</li>
          <li>
            attempt to access data belonging to another customer or to
            circumvent access controls;
          </li>
          <li>
            reverse engineer, decompile, or copy the Service, except to the
            extent mandatory law permits;
          </li>
          <li>resell or sublicense the Service without our written consent.</li>
        </LegalList>
        <p>
          The Service is priced for ordinary reporting use by accommodation
          sites. We may limit automated or clearly abnormal load that
          degrades the Service for others, and will contact you before doing
          so where reasonably possible.
        </p>
      </>
    ),
  },
  {
    id: "customer-data",
    title: "Customer data & ownership",
    inShort:
      "Your data is yours. We process it only to run the service, and you can export it whenever you like.",
    body: (
      <>
        <p>
          All data entered into the Service by the Customer or its users
          (<Term>Customer Data</Term>) remains the Customer&rsquo;s property.
          We process personal data contained in Customer Data as a processor
          on the Customer&rsquo;s behalf, as described in the{" "}
          <UnderlineLink href="/privacy">Privacy &amp; GDPR</UnderlineLink>{" "}
          policy and the Data Processing Agreement available on request.
        </p>
        <p>
          Customer Data can be exported from the Service at any time in CSV
          format. We do not sell Customer Data or use it for purposes other
          than providing and improving the Service.
        </p>
      </>
    ),
  },
  {
    id: "fees-payment",
    title: "Fees & payment",
    inShort: (
      <>
        Prices are on the Pricing page, exclude VAT, and won&rsquo;t change
        without {LEGAL_FACTS.changeNoticeDays} days&rsquo; warning.
      </>
    ),
    body: (
      <>
        <p>
          Fees for the Service are stated on the{" "}
          <UnderlineLink href="/pricing">Pricing</UnderlineLink> page and
          billed as described in the{" "}
          <UnderlineLink href="/subscription-policy">
            Subscription Policy
          </UnderlineLink>
          . All prices exclude VAT, which is added where applicable.
        </p>
        <p>
          We announce price changes at least {LEGAL_FACTS.changeNoticeDays}{" "}
          days in advance. A change applies from the next billing period, and
          you may cancel before it takes effect.
        </p>
      </>
    ),
  },
  {
    id: "trial",
    title: "Trial",
    inShort:
      "The first month is free and we take no card. When it ends nothing is charged — you pick a plan, or your site pauses with your data still exportable.",
    body: (
      <>
        <p>
          New customers receive one free month of the Service per site. No
          payment card is collected during the trial.
        </p>
        <p>
          At the end of the trial nothing is charged automatically. To keep
          using the Service you choose a plan; until you do, your site is
          paused and your Customer Data remains available for export. If you
          do not continue, data is handled as described in section 10.
        </p>
      </>
    ),
  },
  {
    id: "availability-support",
    title: "Availability & support",
    inShort:
      "We aim to keep Pakkia up around the clock and answer support during weekday office hours, Finnish time.",
    body: (
      <>
        <p>
          We use reasonable efforts to keep the Service available at all
          times, but do not guarantee uninterrupted availability{" "}
          <Pending>
            uptime commitment / SLA — to be confirmed with counsel
          </Pending>
          . Planned maintenance is scheduled outside typical usage hours
          where feasible, with advance notice for significant work.
        </p>
        <p>
          Support is available at{" "}
          <UnderlineLink href={`mailto:${LEGAL_FACTS.supportEmail}`}>
            {LEGAL_FACTS.supportEmail}
          </UnderlineLink>{" "}
          on {LEGAL_FACTS.supportHours}.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "Liability",
    inShort:
      "We're liable within the limits Finnish law allows — and we can't take responsibility for reports built from numbers that were entered wrong.",
    body: (
      <>
        <p>
          To the extent permitted by mandatory Finnish law, our aggregate
          liability under these terms is capped at{" "}
          <Pending>
            liability cap — to be confirmed with counsel, e.g. the fees paid
            for the Service in the 12 months preceding the event
          </Pending>
          , and we are not liable for indirect or consequential damages such
          as lost profits or lost business.
        </p>
        <p>
          The Service produces reports from data entered by the
          Customer&rsquo;s users. Responsibility for the accuracy of
          regulatory filings therefore rests on that data and on the
          Customer&rsquo;s review of the reports before filing.
        </p>
        <p>
          Nothing in these terms limits liability for gross negligence or
          intentional misconduct, or any liability that cannot be limited
          under mandatory law.
        </p>
      </>
    ),
  },
  {
    id: "termination",
    title: "Termination",
    inShort: (
      <>
        You can leave any time. After termination you have{" "}
        {LEGAL_FACTS.exportWindowDays} days to export your data, then we
        delete it.
      </>
    ),
    body: (
      <>
        <p>
          The Customer may terminate at any time as described in the{" "}
          <UnderlineLink href="/subscription-policy">
            Subscription Policy
          </UnderlineLink>
          ; the Service then runs to the end of the paid period.
        </p>
        <p>
          We may suspend or terminate the Customer&rsquo;s access for
          material breach of these terms, with prior written notice and a
          reasonable opportunity to remedy the breach — or immediately where
          the breach is grave, such as unlawful use or attempts to access
          other customers&rsquo; data.
        </p>
        <p>
          After termination, Customer Data remains available for export for{" "}
          {LEGAL_FACTS.exportWindowDays} days, after which it is deleted in
          accordance with the retention terms of the{" "}
          <UnderlineLink href="/privacy">Privacy &amp; GDPR</UnderlineLink>{" "}
          policy.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to terms",
    inShort: (
      <>
        If we change these terms in a way that matters, you&rsquo;ll hear
        about it {LEGAL_FACTS.changeNoticeDays} days ahead by email.
      </>
    ),
    body: (
      <>
        <p>
          We may update these terms. Material changes are announced by email
          and in the Service at least {LEGAL_FACTS.changeNoticeDays} days
          before they take effect. If you do not accept a change, you may
          terminate before its effective date; continued use after that date
          constitutes acceptance.
        </p>
        <p>
          Dated versions of these terms are kept available, and the
          &ldquo;Last updated&rdquo; date at the top of this page always
          reflects the current version.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "Governing law & disputes",
    inShort:
      "Finnish law applies, and we'll always try to sort things out by talking first. Consumers keep every right the law gives them.",
    body: (
      <>
        <p>
          These terms are governed by the laws of Finland, excluding its
          conflict-of-law rules.
        </p>
        <p>
          Disputes are first addressed by negotiation. Failing that, they
          are resolved in{" "}
          <Pending>competent court / venue — to be confirmed with counsel</Pending>
          .
        </p>
        <p>
          If the Customer is a consumer, nothing in these terms limits the
          rights granted by mandatory consumer-protection law, and the
          consumer may also refer a dispute to the Finnish Consumer Disputes
          Board (kuluttajariitalautakunta).
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalLayout
      page="terms"
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
