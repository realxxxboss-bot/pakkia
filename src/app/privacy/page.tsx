/* Privacy & GDPR (inner-pages spec §6) — the legal page that doubles as a
   sales asset: EU-data trust is the pitch, so the hero carries a ruled
   "privacy fact strip" whose four cells restate the policy exactly.
   10 numbered sections on the shared LegalLayout, each opened by a
   non-binding IN SHORT summary, closed by the DPA-on-request note.
   PLACEHOLDER COPY pending lawyer review: controller identity and safeguard
   wording stay visibly bracketed via <Pending>. Every number shared with
   Terms / Subscription Policy comes from legal/constants.ts. */

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
  title: "Privacy & GDPR — Pakkia",
  description:
    "How Pakkia handles data: hosted in the EU (Frankfurt), no transfers outside the EU, guest counts — never guest identities — and full GDPR rights with in-product CSV export.",
};

/* ---- privacy fact strip (§6) — the page's summary, in the hero.
   Ruled stats-strip pattern: 4 cells between hairlines, left-aligned,
   mono pine-700 values. Each value restates the policy text exactly. */

const FACTS = [
  { label: "Data location", value: "EU · Frankfurt" },
  { label: "Transfers outside EU", value: "none" },
  { label: "Backups", value: "daily, EU" },
  { label: "Your rights", value: "access, export, erasure" },
];

function FactStrip() {
  return (
    <dl className="grid grid-cols-2 border-y border-line md:grid-cols-4">
      {FACTS.map((f, i) => (
        <div
          key={f.label}
          className={`py-6 pr-4 ${
            i === 0 ? "md:pl-0" : "md:border-l md:border-line"
          } ${i > 0 ? "md:px-6" : ""} ${i % 2 === 1 ? "border-l border-line pl-4 md:pl-6" : ""} ${i > 1 ? "border-t border-line md:border-t-0" : ""}`}
        >
          <dt className="font-spline text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
            {f.label}
          </dt>
          <dd className="mt-2 font-spline text-[1.0625rem] font-medium leading-[1.4] text-pine-700">
            {f.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ---- the ten sections (§6 content outline) ---- */

const SECTIONS: {
  id: string;
  title: string;
  inShort: React.ReactNode;
  body: React.ReactNode;
}[] = [
  {
    id: "controller-contact",
    title: "Controller & contact",
    inShort:
      "For your account and billing, Pakkia decides how data is used — we're the controller. For the guest counts your campsite records, your campsite is the controller and we only process them on its behalf.",
    body: (
      <>
        <p>
          The Pakkia service (the <Term>Service</Term>) is operated by{" "}
          <Pending>Company name — to be added</Pending> (
          <Term>Pakkia</Term>, &ldquo;we&rdquo;, &ldquo;us&rdquo;), a company
          registered in Finland. Business ID:{" "}
          <Pending>Business ID — to be added</Pending>. Registered address:{" "}
          <Pending>Registered address — to be added</Pending>. For anything in
          this policy, write to{" "}
          <UnderlineLink href={`mailto:${LEGAL_FACTS.supportEmail}`}>
            {LEGAL_FACTS.supportEmail}
          </UnderlineLink>
          .
        </p>
        <p>
          Two GDPR roles matter here, and the split is deliberate because
          Pakkia is a business tool:
        </p>
        <LegalList>
          <li>
            Pakkia is the <Term>controller</Term> — the party that decides why
            and how personal data is processed — for the data described in
            sections 2.1–2.5: your account, usage logs, billing, support
            correspondence and this website.
          </li>
          <li>
            For the overnight-stay records a campsite enters into the Service,
            the campsite is the controller and Pakkia is the{" "}
            <Term>processor</Term> — we process those records only on the
            campsite&rsquo;s documented instructions, under the Data
            Processing Agreement described at the end of this page.
          </li>
        </LegalList>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "What we collect",
    inShort:
      "Your name, email and role; the nightly counts your site records; ordinary usage logs; billing details; and support emails. Pakkia stores counts, not guests — no guest names, ever.",
    body: (
      <>
        <p>We process the following categories of data:</p>
        <LegalList>
          <li>
            <Term>Account data</Term> (2.1) — name, email address, and role at
            your campsite (Admin, Staff, or Pitch holder).
          </li>
          <li>
            <Term>Usage &amp; log data</Term> (2.2) — sign-ins, actions taken
            in the Service (the audit trail), and technical logs such as IP
            address and browser type.
          </li>
          <li>
            <Term>Billing data</Term> (2.3) — organisation name, business ID,
            billing address and email, and invoicing history.
          </li>
          <li>
            <Term>Support correspondence</Term> (2.4) — emails you send to{" "}
            {LEGAL_FACTS.supportEmail}.
          </li>
          <li>
            <Term>Cookies</Term> (2.5) — strictly necessary cookies only, as
            listed in section 9.
          </li>
          <li>
            <Term>Overnight-stay records</Term> (2.6) — the counts your
            campsite logs: how many people stayed on which pitch on which
            night, processed on the campsite&rsquo;s behalf.
          </li>
        </LegalList>
        <p>
          One thing the Service deliberately does not store: your guests.
          Overnight-stay records are numbers per pitch per night — no guest
          names, no ID numbers, no dates of birth, no contact details. A
          statistics report never needed identities, so Pakkia never collects
          them.
        </p>
      </>
    ),
  },
  {
    id: "legal-bases",
    title: "Why & legal bases",
    inShort:
      "We process data to run the service you signed up for, to keep it secure, to meet bookkeeping law — and beyond that only with your consent.",
    body: (
      <>
        <p>Each processing purpose rests on a GDPR legal basis:</p>
        <LegalList>
          <li>
            <Term>Contract performance</Term> (Art. 6(1)(b)) — providing the
            Service: accounts, logging, reports, exports, support, and
            billing.
          </li>
          <li>
            <Term>Legitimate interests</Term> (Art. 6(1)(f)) — keeping the
            Service secure, maintaining the audit trail, preventing abuse,
            and improving the product from aggregate usage.
          </li>
          <li>
            <Term>Consent</Term> (Art. 6(1)(a)) — only where we ask for it
            separately, such as product news by email. Consent can be
            withdrawn at any time.
          </li>
          <li>
            <Term>Legal obligation</Term> (Art. 6(1)(c)) — retaining billing
            records under Finnish bookkeeping law (section 6).
          </li>
        </LegalList>
        <p>
          For overnight-stay records we act as processor; the legal basis is
          the campsite&rsquo;s own — typically its statutory reporting duty
          to Statistics Finland.
        </p>
      </>
    ),
  },
  {
    id: "where-data-lives",
    title: "Where data lives",
    inShort:
      "Everything is stored in the EU, in Frankfurt, Germany — on Supabase infrastructure — and backed up daily inside the EU. We transfer no personal data outside the EU.",
    body: (
      <>
        <p>
          The Service&rsquo;s database, authentication, and file storage run
          on <Term>Supabase</Term> in the{" "}
          <Mono>EU · Frankfurt</Mono> region (AWS eu-central-1, Germany). The
          application itself is served from EU infrastructure in the same
          region. Encrypted backups are taken <Mono>daily</Mono> and stored in
          the same EU region.
        </p>
        <p>
          We transfer <Mono>none</Mono> of your personal data outside the
          EU/EEA. If that ever had to change, we would name the recipient and
          its safeguards in the sub-processor table below and give you notice
          before the change takes effect.
        </p>
      </>
    ),
  },
  {
    id: "sub-processors",
    title: "Sub-processors",
    inShort:
      "Two companies help us run Pakkia — Supabase for the database and Vercel for serving the application — both operating for us in the EU, in Frankfurt.",
    body: (
      <>
        <p>
          We use the following sub-processors. The list is kept current on
          this page, and we give notice before adding or replacing one (for
          example, a transactional-email provider once the Service sends
          email).
        </p>
        <LegalTable
          caption="Sub-processors: name, purpose and processing region"
          head={["Name", "Purpose", "Region"]}
          rows={[
            [
              <Term key="n">Supabase</Term>,
              <span key="p" className="text-ink-muted">
                Database, authentication, and file storage
              </span>,
              <Mono key="r">EU · Frankfurt (AWS eu-central-1)</Mono>,
            ],
            [
              <Term key="n">Vercel</Term>,
              <span key="p" className="text-ink-muted">
                Application hosting and content delivery
              </span>,
              <Mono key="r">EU · Frankfurt (fra1)</Mono>,
            ],
          ]}
        />
        <p>
          <Pending>
            Safeguard wording for sub-processors whose parent entities are
            established outside the EU — to be confirmed with counsel before
            the effective date
          </Pending>
          .
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "Retention",
    inShort: (
      <>
        Your data stays as long as your account does. After closure you have{" "}
        {LEGAL_FACTS.exportWindowDays} days to export everything; then we
        delete it, and daily backups roll it off within{" "}
        {LEGAL_FACTS.backupRetentionDays} days. Only bookkeeping records must
        stay longer — the law says {LEGAL_FACTS.bookkeepingRetentionYears}{" "}
        years.
      </>
    ),
    body: (
      <>
        <LegalTable
          caption="Retention periods per data category"
          head={["Data", "Kept for"]}
          rows={[
            [
              <span key="d">Account data</span>,
              <Mono key="k">
                life of the account + {LEGAL_FACTS.exportWindowDays}-day
                export window
              </Mono>,
            ],
            [
              <span key="d">Overnight-stay records</span>,
              <Mono key="k">
                while the account is active (campsite-controlled), then the
                same export window
              </Mono>,
            ],
            [
              <span key="d">Usage &amp; log data</span>,
              <Mono key="k">same cycle as the account it belongs to</Mono>,
            ],
            [
              <span key="d">Billing &amp; bookkeeping records</span>,
              <Mono key="k">
                {LEGAL_FACTS.bookkeepingRetentionYears} years (Finnish
                Accounting Act)
              </Mono>,
            ],
            [
              <span key="d">Support correspondence</span>,
              <Mono key="k">
                {LEGAL_FACTS.supportRetentionMonths} months after the case is
                closed
              </Mono>,
            ],
            [
              <span key="d">Backups</span>,
              <Mono key="k">
                daily, EU · rolling {LEGAL_FACTS.backupRetentionDays}-day
                cycle
              </Mono>,
            ],
          ]}
        />
        <p>
          When your account is deleted — by you, or after the{" "}
          {LEGAL_FACTS.exportWindowDays}-day export window that follows
          termination — your data is deleted from production systems within{" "}
          {LEGAL_FACTS.postWindowDeletionDays} days. Because backups are kept
          on a rolling {LEGAL_FACTS.backupRetentionDays}-day cycle, deleted
          data also disappears from every backup within{" "}
          {LEGAL_FACTS.backupRetentionDays} days of deletion. Backups are
          never restored in a way that resurrects deleted data.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "Security",
    inShort:
      "Encrypted in transit and at rest, access separated by role down at the database level, and every change to a record written to an audit trail.",
    body: (
      <>
        <LegalList>
          <li>
            All traffic between you and the Service is encrypted in transit
            (TLS); stored data is encrypted at rest.
          </li>
          <li>
            Access is separated per campsite and per role (Admin, Staff,
            Pitch holder) and enforced at the database level with row-level
            security (RLS) — not just in the user interface.
          </li>
          <li>
            Every change to an overnight-stay record is written to an audit
            trail: what changed, when, and by whom.
          </li>
          <li>
            Internal access follows least privilege: our staff access
            customer data only when needed to provide support you asked for
            or to keep the Service running.
          </li>
        </LegalList>
        <p>
          If a personal-data breach ever occurs, we notify the affected
          customers and the supervisory authority as GDPR Articles 33–34
          require.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    inShort:
      "You can see, correct, export, and erase your data — export is built into the product as CSV, no request needed. And you can always complain to the Finnish data protection authority.",
    body: (
      <>
        <p>Under the GDPR you have the right to:</p>
        <LegalList>
          <li>
            <Term>access</Term> the personal data we hold about you;
          </li>
          <li>
            <Term>rectification</Term> — have inaccurate data corrected;
          </li>
          <li>
            <Term>erasure</Term> — have your data deleted, within the limits
            of section 6;
          </li>
          <li>
            <Term>portability</Term> — receive your data in a
            machine-readable format. CSV export is built into the Service, so
            you can exercise this yourself at any time without asking us;
          </li>
          <li>
            <Term>restriction</Term> of and <Term>objection</Term> to
            processing based on legitimate interests;
          </li>
          <li>withdraw any consent you have given, at any time.</li>
        </LegalList>
        <p>
          To exercise a right, email{" "}
          <UnderlineLink href={`mailto:${LEGAL_FACTS.supportEmail}`}>
            {LEGAL_FACTS.supportEmail}
          </UnderlineLink>{" "}
          from your account address. We respond within one month. If you are
          unsatisfied, you may lodge a complaint with the Finnish Data
          Protection Ombudsman (
          <Term>Tietosuojavaltuutetun toimisto</Term>),{" "}
          <UnderlineLink href="https://tietosuoja.fi/en">
            tietosuoja.fi
          </UnderlineLink>
          . For overnight-stay records, requests are handled together with
          your campsite, which is the controller of that data.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    inShort:
      "Only the cookies needed to keep you signed in. No analytics cookies, no marketing cookies, no third-party trackers — which is why you don't see a cookie banner.",
    body: (
      <>
        <p>The Service sets strictly necessary cookies only:</p>
        <LegalTable
          caption="Cookies: name, purpose and lifetime"
          head={["Cookie", "Purpose", "Lifetime"]}
          rows={[
            [
              <Mono key="c">sign-in session</Mono>,
              <span key="p" className="text-ink-muted">
                Keeps you signed in to your account (set by our
                authentication provider, Supabase)
              </span>,
              <Mono key="l">session · refreshed while you use the Service</Mono>,
            ],
          ]}
        />
        <p>
          We use no analytics, advertising, or social-media cookies, and no
          third-party trackers — so no consent banner is needed. If we ever
          introduce cookies that require consent, we will ask for it first
          and list them here before they are set.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes",
    inShort: (
      <>
        When this policy changes in a way that matters, account admins hear
        about it by email {LEGAL_FACTS.changeNoticeDays} days ahead — nothing
        changes quietly.
      </>
    ),
    body: (
      <>
        <p>
          We may update this policy as the Service evolves. Material changes
          — anything that affects what we collect, where it lives, or your
          rights — are announced by email to account admins and in the
          Service at least {LEGAL_FACTS.changeNoticeDays} days before they
          take effect. Minor clarifications are published on this page with
          an updated &ldquo;Last updated&rdquo; date.
        </p>
        <p>Dated versions of this policy are kept available on request.</p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      page="privacy"
      heroExtra={<FactStrip />}
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

      {/* DPA note (§6) — B2B buyers will ask */}
      <aside
        aria-label="Data Processing Agreement"
        className="mt-14 rounded-[6px] border border-line p-5"
      >
        <p className="font-spline text-[11px] font-medium uppercase tracking-[0.12em] text-pine-700">
          For business customers
        </p>
        <p className="mt-2 text-[0.9375rem] leading-[1.65] text-ink-muted">
          Our processing of your campsite&rsquo;s overnight-stay records is
          governed by a <Term>Data Processing Agreement</Term> (Article 28
          GDPR). Request a copy at{" "}
          <UnderlineLink href={`mailto:${LEGAL_FACTS.supportEmail}`}>
            {LEGAL_FACTS.supportEmail}
          </UnderlineLink>{" "}
          — we&rsquo;ll send it the same business day.
        </p>
      </aside>
    </LegalLayout>
  );
}
