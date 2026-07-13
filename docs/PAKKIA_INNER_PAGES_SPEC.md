# Pakkia Inner Pages Redesign Spec — "Nordic Editorial"

Companion to PAKKIA_DESIGN_SPEC.md (the homepage spec). That file defines the
design system: tokens, colors, fonts, the numbered-eyebrow system, the
split-arrow button, the underline-link secondary, radius scale, motion rules,
and the hard AVOID list. Read it first. THIS file assumes all of that and
specifies every remaining page, section by section.

Pages covered:
1. About
2. How it works
3. Pricing
4. Contact
5. Legal hub + Terms of Service
6. Privacy & GDPR
7. Refund Policy
8. Subscription Policy
9. Login
10. Signup

Global rules that apply to every page below:
- Header and footer are identical to the homepage spec (sections 4 and 12).
- Every page's hero uses the numbered eyebrow system, restarting at "01" per
  page (numbering is per-page, not global).
- Every page keeps the background rhythm principle: never two identical
  backgrounds stacked; alternate paper / paper-deep / pine-900.
- All existing copy stays unless a section says otherwise — copy on these
  pages is already good; this is a visual restructure.
- Buttons: only the two types from the system (split-arrow primary,
  underline-link secondary). Replace every current button/link pair.
- All numbers, prices, timestamps, step numbers, form labels' meta: Spline
  Sans Mono. Headings: Familjen Grotesk. Body: Hanken Grotesk.

---

# 1. ABOUT PAGE (/about)

Purpose of this page: trust. A prospective campsite owner lands here to check
"who is behind this, are they serious, will they exist next season". Design
should feel like a well-set printed company statement — quiet, personal,
credible. 5 sections + CTA.

## 1.1 Hero (background: --paper)

- Layout: single column, left-aligned, max-w-[52rem], py-24.
  NOT split-column — About hero should read like an essay opening.
- Eyebrow: "01 — Our story".
- H1: "A small tool for a duty that never goes away." (keep). Set at the H1
  clamp size; "never goes away" stays plain — no highlight here. The About
  page deliberately uses ZERO amber highlights in headings; amber appears
  only in eyebrows and one CTA. This restraint differentiates it from the
  homepage's energy.
- Lead paragraph (keep copy) at 1.125rem, ink-muted, line-height 1.7 —
  slightly larger than normal body, an editorial "standfirst".

## 1.2 Image band (background: --paper, directly after hero)

- The mist/valley photo, full container width, aspect 21/9, radius 12px,
  1px --line border, pine duotone overlay (pine-900 at 12%,
  mix-blend-multiply) — same treatment as homepage hero photo.
- Overlaid on the photo's bottom-left corner (inside, padding 20px): the
  two facts currently floating oddly ("Hosted in EU · Frankfurt",
  "GDPR by design") as two lines of mono 12px in --cream with a 1px
  --line-dark rule between them, sitting on a flat pine-900 90%-opacity
  rectangle (radius 6px, no blur). Reads like a photo caption plate in a
  printed report — not a floating badge.
- Motion: photo reveals with clip-path inset from bottom (600ms), caption
  plate fades in 200ms later.

## 1.3 How it started (background: --paper-deep)

- Eyebrow: "02 — How it started".
- Layout: asymmetric 2-column, 5/7. Left column: H2 "Started for one
  campsite. Designed for the rest." Right column: the two paragraphs
  (keep copy), 1.0625rem, line-height 1.7, with a drop cap on the first
  paragraph — first letter in Familjen Grotesk 700, 3.2em, --pine-700,
  float-left. A drop cap is a strong editorial signature no SaaS template
  uses.
- Between the two paragraphs: a pull-quote element — "It does one regulated
  job well, and stays out of the way the rest of the time." pulled out at
  1.375rem Familjen Grotesk 500, --pine-900, with a 2px --amber left rule,
  border-radius 0 (per system rules), padding-left 20px, my-8.
  (This is the page's single amber moment besides eyebrows.)

## 1.4 Values — "Three things we don't compromise" (background: --paper)

The current three numbered blocks are the right idea but generic in
execution. Rebuild as an editorial index (same component family as the
homepage features table):

- Eyebrow: "03 — What we hold to". H2: "Three things we don't compromise."
- Three full-width rows separated by 1px --line rules (rule above the first
  and below the last too). Each row, desktop grid:
  [mono 12px amber index "01" | value title, Familjen Grotesk 600 1.375rem,
  --pine-900, ~28% width | short tagline in mono 12px uppercase ink-muted
  under the title ("RIGHT BY THE REGULATOR." / "EASY ENOUGH TO FORGET." /
  "BUILT FOR FINNISH SITES.") | description paragraph, ink-muted, ~50%
  width, right side].
- Row hover: --paper-deep background fades edge-to-edge (250ms), index
  turns --pine-700. No icons on this page at all.
- Rows reveal with 0.08s stagger.

## 1.5 The team / honesty note (background: --paper, NEW section)

About pages without any human presence feel like shell companies. Add a
short section:

- Eyebrow: "04 — Who's behind it".
- Layout: 2-column 7/5. Left: one honest paragraph (write in the same voice
  as the rest of the site) — e.g. that Pakkia is built by a small product
  team working with Finnish site operators, supported by Growth Nexus for
  engineering; support answered by people who built the product; no
  investors pushing feature bloat. Adjust to whatever is factually true —
  do NOT invent named people or photos.
- Right: a flat "fact sheet" — a definition list on 1px --line separated
  rows, mono labels left / values right: "Founded — 2026", "Based —
  Finland", "Hosting — EU · Frankfurt", "Focus — one job, done well".
  No card box, just the ruled rows.

## 1.6 Page CTA (background: --pine-900, merges into footer)

- Eyebrow: "05 — Talk to us". H2 in --cream: "See if Pakkia fits your
  site." Paragraph (keep the "short call… tell you honestly" copy) in
  --cream-muted — this honest framing is the best line on the site,
  give it room.
- One split-arrow primary "Talk to us" (cream-on-dark inverted variant per
  the system) + underline secondary "See pricing".
- Same continuous dark background into the footer as the homepage.

---

# 2. HOW IT WORKS PAGE (/how-it-works)

Purpose: convince the skeptical operator that switching is trivially easy.
The page's entire job is to make 4 steps feel like nothing. 5 sections.

## 2.1 Hero (background: --paper)

- Layout: 2-column 7/5 like homepage hero.
- Eyebrow: "01 — How it works". H1: "Four steps from set-up to a filed
  report." with "Four steps" in --amber (single highlight).
- Sub-paragraph (keep). CTA row: split-arrow "Start free" + underline
  "See pricing".
- Right column: replace the generic landscape photo with a vertical
  mini-timeline preview — a flat column of the 4 step numbers ("01 02 03
  04" in mono, --pine-700) connected by a 1px --line vertical rule, each
  with its title at 0.9375rem; the currently-in-view step (synced to
  scroll position of section 2.2) gets its number in amber. On mobile,
  hide this and keep only the left column. This makes the hero functional
  instead of decorative — an anti-template move.

## 2.2 The four steps (background: --paper-deep) — the core section

Do NOT lay these out as 4 cards in a grid. Build a vertical editorial
timeline, one step per row, generous spacing (each row min-h ~60vh feel via
py-20, but let content define height):

- Section eyebrow: "02 — The process".
- A single continuous 1px --line vertical rule runs down the left gutter
  of the steps column (desktop only), with a 8px solid --pine-700 square
  node at each step (the printer's-mark motif from the homepage; the node
  fills --amber when the step is in the viewport center — use an
  IntersectionObserver / Framer Motion useInView).
- Each step row, desktop grid: [left ~40%: mono amber "Step 01" eyebrow-
  style, H3 title in Familjen Grotesk 600 1.5rem, description paragraph
  ink-muted, and the time-cost tag] · [right ~55%: a step visual].
- The time-cost tags ("~ one afternoon", "daily · 10 seconds",
  "automatic", "one click") are the best micro-copy on the page. Render
  each as mono 12px --pine-700 sitting on a 1px --line top rule (not a
  pill!) with a small stopwatch-free treatment: just "⏤ 10 seconds" style
  where ⏤ is a 16px horizontal rule segment. Plain, precise, instrument-
  like.
- Step visuals (right side) — flat UI vignettes, not photos, all framed in
  the 16px-radius window frame from the homepage mockup (slim title bar,
  1px --line, --shadow-soft on step 02 only):
  - Step 01: a pitch list table vignette — 4 rows "A-12 · Lakeside",
    "A-13 · Lakeside", "B-01 · Forest edge"… mono, with an "Add pitch"
    compact split-arrow at the bottom.
  - Step 02: the calendar week-row vignette (reuse the homepage calendar
    component, single week) with the amber-outline cell increment
    animation. This is the money shot — the loop animation lives here.
  - Step 03: a totals roll-up vignette — three stacked rows "Pitch A-12 —
    112", "June — 1,284", "Season — 4,913" in mono with an animated
    count-up when in view, plus a faded audit line beneath: "21:34 · +4 ·
    staff" in mono 11px ink-muted.
  - Step 04: an export vignette — two file rows "statistics-finland-
    june.csv" and "board-report-june.pdf" in mono 13px with a small
    download arrow each, and a green-ish confirmation tick line
    "Filed · 02.07.2026" in --pine-700.
- Mobile: timeline rule hidden; steps stack as [step eyebrow + title +
  description + tag + visual].
- Motion: each step's text column fades up; visual fades in 0.12s later;
  the gutter node fill transition 250ms.

## 2.3 Roles & access (background: --pine-900, dark section)

- Eyebrow: "03 — Roles & access". H2 in --cream: "Everyone sees exactly
  their part." Intro paragraph in --cream-muted (keep copy — the "enforced
  at the database level" line is a trust weapon; consider setting
  "enforced at the database level" in --amber).
- The three roles as a definition-list ledger (same pattern as homepage
  compliance section, NOT cards): three rows on 1px --line-dark rules.
  Each row: [mono amber index "A. / B. / C."] · [role name in Familjen
  Grotesk 600 1.25rem --cream + the short label ("Full control" /
  "Day-to-day" / "Just their nights") in mono 12px uppercase --cream-muted]
  · [description in --cream-muted, right column].
- Optional fourth visual element under the list: a tiny access-matrix
  strip — 3 columns (roles) × 3 rows (Pitches / Reports / Settings) of
  mono ✓ / — glyphs in a ruled table, cream/cream-muted. Compact, flat,
  extremely "compliance product".
- Row hover: rule color animates to --amber (matching the homepage dark
  section interaction).

## 2.4 Onboarding promise (background: --paper, NEW slim section)

The "Ready in an afternoon" claim deserves its own beat before the CTA:

- Eyebrow: "04 — Switching". One-line H2: "Ready in an afternoon."
- A 3-item horizontal ruled strip (like the homepage stats strip): "We
  import your sheet — free", "First pitches set up with you — on a call",
  "First export checked together — before you file". Left-aligned cells,
  vertical 1px --line rules between, mono 12px labels over 1rem
  descriptions.

## 2.5 Page CTA + footer (background: --pine-900)

- Eyebrow: "05 — Get set up". H2 "Ready in an afternoon." becomes here
  "Your first month is a real month." with paragraph: keep the free
  set-up help copy. Split-arrow primary "Get set up" + underline
  "Start free instead". Continuous into footer.

---

# 3. PRICING PAGE (/pricing)

Purpose: remove fear. Pricing pages fail on anxiety, not information.
Everything should whisper "no tricks". 5 sections.

## 3.1 Hero (background: --paper, compact)

- Single column, left-aligned, py-20 (shorter than other heroes).
- Eyebrow: "01 — Pricing". H1: "Plain pricing. No per-night fees." with
  "No per-night fees" in --amber. Sub copy (keep), and set "Two months
  free when you pay yearly" as a separate mono 13px line in --pine-700 on
  a 1px --line top rule.
- Add a Monthly / Yearly toggle here: NOT a pill switch. A two-option
  segmented control: two adjacent rectangles (radius 6px on outer corners
  only), 1px --line border, mono 13px labels "Monthly" / "Yearly — 2 mo
  free"; active segment: --pine-700 background, --cream text. Toggling
  animates the plan prices (number cross-fade 200ms) to yearly-effective
  monthly prices (€19→€15.8 style — compute: price × 10 / 12, shown
  rounded: €16, €33, €66, with "billed yearly" mono 11px under).

## 3.2 Plans (background: --paper)

Three columns, but NOT three identical rounded cards. An editorial rate
table:

- Desktop: a single bordered table-like structure — outer 1px --line
  border, radius 12px, three columns separated by 1px --line vertical
  rules. No gaps between plans; they share rules like a printed rate card.
- Column internal structure (top to bottom, each zone separated by a 1px
  --line horizontal rule):
  1. Plan header zone (py-6 px-7): plan name in Familjen Grotesk 600
     1.25rem --pine-900; one-line description in ink-muted 0.875rem.
  2. Price zone: price in Spline Sans Mono 500 at 2.5rem --pine-900 with
     "/mo" in mono 14px ink-muted; under it the capacity line ("up to 25
     pitches" / "up to 80 pitches" / "unlimited pitches · per site") in
     mono 12px --pine-700.
  3. Features zone: the feature list, each item with a mono ✓ glyph in
     --pine-700 (── not icon components), 0.9375rem ink, line rows
     separated by 12px gaps (no rules inside this zone).
  4. Action zone (mt-auto so buttons align across columns): Starter and
     Standard get split-arrow "Start free"; Multi-site gets underline
     secondary "Talk to us →".
- "Most popular" treatment for Standard: the whole middle column gets a
  --paper-deep background (its neighbors stay --paper) + a 2px --amber
  top rule on that column only + a mono 11px uppercase "MOST POPULAR"
  label in --amber sitting right above the plan name. NO badge pill, NO
  scale-up, NO shadow, NO border color change. The tinted column inside a
  shared ruled table is quietly obvious — and unmistakably not a template.
- Mobile: columns stack; each becomes its own bordered block (radius 12px,
  16px gaps); Standard keeps its paper-deep fill + amber top rule and is
  ordered FIRST.
- Under the table: the reassurance line "All prices exclude VAT · Cancel
  anytime · Your data exports with you" in mono 12px ink-muted, centered
  is acceptable here (it's a legal-ish footnote), with each "·" separated
  item preceded by a 12px ✓.
- Motion: the three columns reveal with a 0.08s stagger; prices count up
  once on first view.

## 3.3 What every plan includes (background: --paper-deep, NEW slim section)

Kills the "what's the catch" doubt:
- Eyebrow: "02 — Always included". A single ruled strip (stats-strip
  pattern), 4 cells: "EU hosting · Frankfurt", "Audit log", "Statistics
  Finland exports", "Free onboarding import". Mono 13px, --pine-900,
  vertical rules between.

## 3.4 FAQ (background: --paper)

- Eyebrow: "03 — Questions, answered." H2 (keep).
- NOT default accordion cards. A ruled accordion list: full-width rows
  separated by 1px --line rules; each row: question in Familjen Grotesk
  500 1.125rem --pine-900 left, a mono "+" glyph right (rotates 45° to ×
  when open, 200ms). Answer expands beneath (height auto animation, 300ms
  system ease), ink-muted, max-w-[44rem]. Row hover: question color →
  --pine-700.
- Keep the 4 existing Q&As; ADD two anxiety-killers: "What happens when my
  free month ends?" (answer: nothing is charged automatically without
  choosing a plan — align with actual billing behavior) and "How do I
  cancel?" (answer: one click in settings, data export stays available —
  align with actual product). These two questions exist to be seen, not
  just answered. Link "Refund Policy" and "Subscription Policy" inline in
  these answers (underline-link style at body size).

## 3.5 Page CTA + footer (background: --pine-900)

- Eyebrow: "04 — Start now". H2: "Run a real month before you pay a
  cent." + split-arrow amber-variant "Start free" (pricing page CTA gets
  the amber button, mirroring the homepage final CTA) + underline
  "Talk to us". Continuous into footer.

---

# 4. CONTACT PAGE (/contact)

Purpose: lowest possible friction + set expectations. 3 sections. Keep it
one viewport-ish on desktop — contact pages should be short.

## 4.1 Hero + two-column body (background: --paper)

- Eyebrow: "01 — Contact". H1: "Let's get your site set up." Sub copy
  (keep — "within one business day" is good; set "one business day" in
  --pine-700 weight 600).
- Below, a 5/7 two-column grid:

LEFT COLUMN — info + expectations:
- A ruled definition list (no cards): rows on 1px --line rules, mono 12px
  uppercase labels ("EMAIL", "SUPPORT HOURS", "BASED IN") left, values
  right in 1rem ink ("hello@pakkia.fi" as a mailto underline-link,
  "Mon–Fri · 9–17 EET" in mono, "Finland · serving the EU").
- Then eyebrow-style mono label "WHAT HAPPENS NEXT" on a 1px --line rule,
  and the 3 steps as a mini numbered list: mono amber "01 02 03" numbers,
  text in ink-muted 0.9375rem, 1rem row gaps, a 1px --line vertical rule
  connecting the numbers (mini version of the how-it-works timeline —
  system consistency).

RIGHT COLUMN — the form:
- Container: 1px --line border, radius 12px, background --paper-deep,
  padding 2rem. (The form is the page's single "object", so it may be a
  card.) Heading inside: "Request your free month" in Familjen Grotesk
  600 1.25rem + mono 12px sub "No card · no obligation" in ink-muted.
- Fields: Your name, Campsite, Email, "How do you track nights today?"
  (textarea, 4 rows). Field styling: NO boxed inputs with heavy borders.
  Editorial underline fields: transparent background, no side/top borders,
  only a 1px --line bottom border; label ABOVE the field in mono 11px
  uppercase ink-muted tracking 0.12em; input text 1rem ink, padding
  0.625rem 0. Focus: bottom border animates to 2px --pine-700 (the extra
  1px via box-shadow inset to avoid layout shift) and the label color →
  --pine-700. Autofill styling overridden to match paper-deep.
- Error state: bottom border + label → #A65D45, error text mono 12px
  beneath. Validate with the existing Zod setup; inline on blur.
- Submit: full-width-of-form split-arrow primary "Send request". On
  submit: button label swaps to "Sending…" (mono), arrow zone shows a
  15px spinner (1.5px --cream stroke).
- Success state: the form body cross-fades (300ms) to a flat confirmation:
  a 24px --pine-700 check glyph, "Request received." in Familjen Grotesk
  600, and "We'll reply by [next business day date, computed] — usually
  sooner." in ink-muted with the date in mono. No confetti, no illustration
  — calm confirmation is on-brand.
- Keep/wire Turnstile per the existing stack; place its widget bottom-left
  of the form above the button, or use invisible mode if configured.

## 4.2 Reassurance strip (background: --paper, slim)

One ruled strip, 3 cells: "Replies within 1 business day", "Free import
help on every plan", "hello@pakkia.fi — a person answers". Mono/ruled
stats-strip pattern.

## 4.3 Footer (background: --pine-900)

Contact page skips the big dark CTA (the page IS the CTA); go straight to
the standard footer, but add a 1px --line-dark top rule with py-6 slim
strip above the footer columns: "Prefer email? hello@pakkia.fi" in
cream-muted mono 13px.

---

# 5. LEGAL PAGES — SHARED TEMPLATE + TERMS OF SERVICE

These pages do not currently exist (footer link points to "#"). Build a
single LegalLayout template used by all four, then fill content per page.

IMPORTANT: The content outlines below are structural placeholders. The
final text MUST be reviewed by a lawyer familiar with Finnish/EU law
before launch. Mark each page with a "Last updated" date and keep dated
versions in the repo.

## 5.1 LegalLayout template (all four pages)

- Background: --paper throughout. No dark sections, no photos, no CTA
  sections — legal pages should be typographically calm and fast.
- Hero: compact, py-16: eyebrow "Legal — [Page name]" (no number on legal
  pages; instead the word "Legal"), H1 at the H2 size (legal pages don't
  need display-size type), and a mono 12px meta line on a 1px --line top
  rule: "Last updated · 13.07.2026 — Effective · 01.08.2026".
- Body layout, desktop: 2-column 3/9.
  - Left (sticky, top-28): an on-page table of contents — mono 12px links
    of each numbered section, ink-muted, active section (scroll-spy) in
    --pine-700 with a 2px --pine-700 left rule (radius 0). Collapses to a
    <details> "On this page" element on mobile.
  - Right: the legal prose, max-w-[46rem]. Section headings: "1. Scope"
    style — the number in mono --amber, the title in Familjen Grotesk 600
    1.25rem. Body 1rem/1.75 ink-muted with ink for defined terms on first
    use (weight 600). Lists as plain markers, tables (if any) as ruled
    tables (1px --line, mono for values).
- Definition boxes: for key summaries, a --paper-deep block, 1px --line
  border, radius 6px, padding 1.25rem, mono 11px uppercase label like
  "IN SHORT" — a plain-language summary above each major section. These
  "in short" blocks are both genuinely user-friendly and a distinctive
  design element. Mark them clearly as non-binding summaries.
- Footer: standard. Add all four legal links to the footer "Company"
  column (Terms, Privacy & GDPR, Refunds, Subscription) and fix the
  current dead "#" link.
- Cross-linking: each legal page ends with a slim ruled strip linking the
  other three.

## 5.2 Terms of Service (/terms) — content outline

Sections (numbered, each with an "IN SHORT" box):
1. Who we are — service operator identity, business ID, address, contact.
2. The service — what Pakkia is (overnight-stay logging and reporting)
   and is not (not a booking/payment system; not legal advice; the
   customer remains responsible for filing with Statistics Finland).
3. Accounts & roles — admin/staff/pitch-holder responsibilities, account
   security, accuracy of entered data.
4. Acceptable use — no unlawful use, no attempts to access other tenants'
   data, no reverse engineering, fair-use limits.
5. Customer data & ownership — the customer owns their data; Pakkia
   processes it per the DPA/Privacy Policy; export available at any time.
6. Fees & payment — reference to Pricing and Subscription Policy; VAT
   exclusive; changes announced 30 days ahead.
7. Trial — one free month, no card, what happens at trial end.
8. Availability & support — reasonable-effort uptime, maintenance
   windows, support hours (Mon–Fri 9–17 EET).
9. Liability — cap and exclusions to the extent Finnish law allows;
   explicit note that responsibility for regulatory filing accuracy rests
   on data entered by the customer.
10. Termination — by customer anytime (see Subscription Policy); by
    Pakkia for breach with notice; data export window post-termination
    (state a number, e.g. 30 days) then deletion per Privacy Policy.
11. Changes to terms — notice method and period.
12. Governing law & disputes — Finnish law, venue, consumer-rights note.

---

# 6. PRIVACY & GDPR PAGE (/privacy)

Uses LegalLayout. This page doubles as a sales asset — Pakkia's whole
pitch is EU-data trust — so it gets one extra design element:

- Directly under the hero meta line, a "privacy fact strip" (the ruled
  stats-strip pattern, 4 cells): "Data location — EU · Frankfurt",
  "Transfers outside EU — none", "Backups — daily, EU", "Your rights —
  access, export, erasure". Mono, --pine-700 values. This strip is the
  page's summary and should match the policy text exactly.

Content outline (each section with an IN SHORT box):
1. Controller & contact — who the data controller is, contact email;
   note the campsite is controller for guest-count data with Pakkia as
   processor (define both roles clearly — this split is important for a
   B2B tool).
2. What we collect — account data (name, email, role), usage/log data,
   the overnight-stay counts themselves (note: counts per pitch/night;
   state clearly whether any guest personal data is stored — the product
   stores numbers, not guest identities, and SAY so, it's a selling
   point), billing data, support correspondence, cookies/analytics (list
   actual tools used).
3. Why & legal bases — contract performance, legitimate interest,
   consent where applicable, legal obligations (bookkeeping).
4. Where data lives — EU/Frankfurt hosting (name the actual provider,
   e.g. the Supabase/AWS region in use), no transfers outside the EEA;
   if any sub-processor is non-EU, list it honestly with safeguards.
5. Sub-processors — a ruled table: name, purpose, region. Keep current.
6. Retention — how long each category is kept, what happens after
   account deletion, backup deletion cycle.
7. Security — encryption in transit/at rest, role-based access enforced
   at database level (RLS), audit logging, access controls.
8. Your rights — access, rectification, erasure, portability (CSV export
   exists in-product — mention it), restriction, objection, complaint to
   the Finnish DPA (Tietosuojavaltuutetun toimisto) with link.
9. Cookies — table of actual cookies with purpose and lifetime; consent
   mechanism if analytics/marketing cookies exist.
10. Changes — how updates are announced.
DPA note: offer a Data Processing Agreement for customers on request
(or link it) — B2B buyers will ask.

---

# 7. REFUND POLICY PAGE (/refunds)

Uses LegalLayout. Short page — do not pad it. Content outline:
1. The free month — the trial exists so refunds are rarely needed; no
   card taken during trial.
2. Monthly plans — state the actual rule clearly (recommended and common:
   monthly fees are non-refundable once a billing period starts; cancel
   anytime to stop the next charge). Whatever the real rule is, state it
   in one sentence, then explain.
3. Yearly plans — state the actual rule (recommended: pro-rated refund of
   unused full months within X days of purchase, or credit; pick ONE and
   be exact).
4. Billing errors & duplicates — always refunded in full, contact within
   X days, resolved within Y business days.
5. How to request — email hello@pakkia.fi with the account email; refunds
   go to the original payment method; timeline expectation.
6. EU consumer rights — note that statutory rights are unaffected;
   14-day withdrawal right handling for consumers where applicable (B2B
   vs consumer distinction — get legal advice on how the trial interacts
   with withdrawal rights).
Each section gets an IN SHORT box; the whole page should fit in ~600
words of body text.

---

# 8. SUBSCRIPTION POLICY PAGE (/subscription-policy)

Uses LegalLayout. Content outline:
1. Plans & billing cycle — monthly/yearly, prices per Pricing page,
   billed in advance, VAT handling for FI/EU businesses (reverse charge
   note where applicable).
2. Trial to paid — exactly what happens at trial end (no silent
   auto-charge if no card was taken — state the actual flow; if a card
   IS eventually taken, disclose the auto-renewal explicitly per EU
   rules).
3. Renewal — auto-renewal terms, renewal reminders for yearly plans
   (recommended: email 14 days before yearly renewal — and then actually
   send it).
4. Upgrades & downgrades — instant, prorated (matches the FAQ promise);
   how proration is calculated; downgrade limits (e.g. pitch count over
   plan limit — what happens: read-only overflow, not deletion).
5. Cancellation — one-click in settings; service continues to period
   end; what happens to data after (export window, then deletion —
   cross-link Privacy retention section; numbers must MATCH across
   pages).
6. Price changes — 30-day notice, applies from next billing period,
   right to cancel before it applies.
7. Failed payments — retry schedule, grace period (state days), account
   goes read-only before anything is deleted — "read-only, never
   hostage" is an on-brand promise worth stating.

---

# 9. LOGIN PAGE (/login)

Purpose: fast, calm, obviously-Pakkia. Auth pages are where design systems
usually fall apart into a floating centered card — avoid exactly that.

## 9.1 Layout

- Split-screen, desktop: left 45% brand panel, right 55% form panel.
  Mobile: brand panel collapses to a slim top strip (logo + one line).
- LEFT PANEL: background --pine-900, full height. Content, padded
  generously (p-12, justify-between vertically):
  - Top: Pakkia logotype + tent mark in --cream (links to /).
  - Middle: a rotating single stat/testimonial-style line — e.g. mono
    12px amber eyebrow "TONIGHT, ACROSS FINLAND" + Familjen Grotesk
    1.5rem --cream line like "Nights logged, not re-typed." Below it,
    the mini audit-log ticker element from the homepage compliance
    section (3 cycling mono rows in cream-muted) — reuse the component.
  - Bottom: the trust line in mono 12px cream-muted ("EU-hosted · GDPR ·
    Statistics Finland format").
- RIGHT PANEL: background --paper. The form sits NOT in a card — directly
  on the paper, max-w-[380px], left-aligned within a centered column.

## 9.2 Form

- Eyebrow (no number): mono "WELCOME BACK". H1 at H2 size: "Log in to
  Pakkia." Skip the marketing sub-line ("Pick up where you left off…") —
  returning users don't need selling; replace with nothing.
- Fields: Email, Password — the editorial underline field style from the
  Contact form (label above in mono 11px uppercase, 1px --line bottom
  border, focus → 2px --pine-700).
- Password row extras: "Show" toggle as a mono 12px text button at the
  field's right end (toggles to "Hide") — no eye icon. "Forgot password?"
  as an underline-link, mono 12px, right-aligned under the field.
- "Keep me signed in": a custom checkbox — 16px square, 1px --line
  border, radius 4px (small elements may use 4px), checked state:
  --pine-700 fill + cream ✓ glyph; label 0.875rem ink-muted.
- Submit: full-width split-arrow primary "Sign in". Loading: label
  "Signing in…" + spinner in arrow zone.
- Error handling: a flat error strip above the form — 1px solid #A65D45
  left rule (2px, radius 0), text 0.875rem in #A65D45: "That email or
  password didn't match. Try again or reset your password." Never
  reveal which field was wrong.
- Below, on a 1px --line top rule: "New to Pakkia?" ink-muted +
  underline-link "Start free →".

## 9.3 CRITICAL — remove the dev shortcut block

The current production login page shows a "Dev only · Quick login" panel
with one-click entry into Super admin / Campsite admin / Power user /
Pitch holder portals. This MUST NOT render in production:
- Gate it behind process.env.NODE_ENV === 'development' (or an explicit
  NEXT_PUBLIC_ENABLE_DEV_LOGIN flag that is absent in prod), and ensure
  the associated routes/handlers are equally gated server-side — hiding
  the UI is not enough if the shortcut endpoints still work.
- Verify after deploy that neither the panel nor its network calls exist
  in the production bundle.

## 9.4 Auth page chrome

- No standard site header/footer on auth pages. Top-right of the form
  panel: "New to Pakkia? Start free" as mono 12px + underline-link.
  Bottom of form panel: mono 11px ink-muted row: "© 2026 Pakkia ·
  Privacy · Terms" with underline-links.

---

# 10. SIGNUP PAGE (/signup)

Same split-screen shell as Login (shared AuthLayout component), with
differences:

## 10.1 Left brand panel (variant)

- Middle content swaps to a value recap for first-timers: mono amber
  eyebrow "YOUR FIRST SEASON IS ON US" + Familjen Grotesk 1.5rem --cream
  "A full free month. No card. Real reports." + a 3-item mini ruled list
  in cream-muted mono 13px: "Set up in an afternoon", "Import help
  included", "Cancel with one click".

## 10.2 Form

- Eyebrow: mono "START FREE". H1 at H2 size: "Create your Pakkia
  account." Mono 12px sub on a rule: "Free for a full month · no card
  required".
- Fields (underline style): Your name, Campsite name, Email, Password.
- Password field: live requirements as a compact mono 11px line under the
  field, each requirement a "· 8+ chars" style token that turns from
  ink-muted to --pine-700 as satisfied (reuse the password-validation UI
  pattern from Growth Nexus phase 1 if portable). No strength meter bars.
- Legal consent: NOT a wall of text. One checkbox (custom style from
  Login) with: "I agree to the Terms of Service and Privacy Policy"
  (both underline-links). Required; error state on submit if unchecked.
- Submit: full-width split-arrow primary "Create account". Loading state
  as Login.
- Below on a rule: "Already using Pakkia?" + underline-link "Log in →".
- Post-submit: route to email verification notice or onboarding per the
  actual auth flow; if email verification exists, the notice screen uses
  the same panel: check glyph, "Check your inbox." heading, the target
  email in mono, and a resend underline-link with a 60s mono countdown.

## 10.3 Anti-spam & privacy

- Turnstile on signup (invisible mode preferred), consistent with the
  existing stack. Rate-limit signup server-side.
- The form must not leak whether an email already exists in a way that
  enables enumeration: on duplicate, show the neutral "If this email is
  new to Pakkia you'll receive a confirmation" pattern or inline "This
  email may already have an account — log in instead?" per the security
  posture you prefer; be consistent with the password-reset flow.

---

# 11. Cross-page consistency checklist (verify at the end)

- [ ] Every page hero uses the numbered eyebrow (legal pages: "Legal —"
      prefix instead).
- [ ] Exactly two button styles exist site-wide; zero pill buttons remain.
- [ ] Zero pill badges / tinted chips anywhere; eyebrows are type + rule.
- [ ] One border color per mode (--line / --line-dark), including form
      fields, tables, accordions.
- [ ] Amber budget respected: max ~2 amber elements per viewport.
- [ ] All numerals site-wide in Spline Sans Mono tabular-nums (prices,
      steps, dates, stats, countdowns).
- [ ] Footer updated: legal links live (no "#" hrefs), four legal pages
      linked.
- [ ] Dev quick-login removed from production (UI AND endpoints).
- [ ] Retention/export-window numbers identical across Terms, Privacy,
      and Subscription Policy.
- [ ] Legal copy flagged for lawyer review before launch; "Last updated"
      dates set.
- [ ] Auth pages share one AuthLayout; Contact form, Login, Signup share
      one underline-field component.
- [ ] prefers-reduced-motion respected on every animation listed above.
