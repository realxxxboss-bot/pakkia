/* Legal pages — shared facts (inner-pages spec §5). Every number or phrase
   that appears on more than one legal page is defined here ONCE so Terms,
   Privacy, Refunds and Subscription Policy can never drift apart. */

export const LEGAL_META = {
  lastUpdated: "13.07.2026",
  effective: "01.08.2026",
} as const;

export const LEGAL_FACTS = {
  /* Post-termination window during which customer data stays exportable,
     after which it is deleted per the Privacy Policy. */
  exportWindowDays: 30,
  /* Notice period for price changes and material changes to terms. */
  changeNoticeDays: 30,
  /* Once the export window closes, data is deleted from production systems
     within this many days. */
  postWindowDeletionDays: 30,
  /* Daily encrypted backups roll off on this cycle, so deleted data also
     leaves the backups within this many days. */
  backupRetentionDays: 35,
  /* Statutory retention for billing/bookkeeping records under the Finnish
     Accounting Act. */
  bookkeepingRetentionYears: 6,
  /* Support correspondence is kept this long after a case is closed. */
  supportRetentionMonths: 24,
  supportHours: "Mon–Fri · 9–17 EET",
  supportEmail: "hello@pakkia.fi",
} as const;

export const LEGAL_PAGES = [
  { key: "terms", title: "Terms of Service", href: "/terms" },
  { key: "privacy", title: "Privacy & GDPR", href: "/privacy" },
  { key: "refunds", title: "Refund Policy", href: "/refunds" },
  {
    key: "subscription",
    title: "Subscription Policy",
    href: "/subscription-policy",
  },
] as const;

export type LegalPageKey = (typeof LEGAL_PAGES)[number]["key"];
