# Pakkia Homepage Redesign Spec — "Nordic Editorial"

This is the complete design specification for redesigning the pakkia.fi homepage.
Read this entire file before writing any code. Follow it exactly. Where the spec
says AVOID, treat it as a hard rule, not a suggestion.

Stack: Next.js (App Router), Tailwind, Framer Motion. Keep existing copy/content
unless the spec says otherwise — this is a visual restructure, not a rewrite.

---

## 0. Design philosophy — and what to AVOID

Direction: **Nordic editorial**. Think Scandinavian print design and annual
reports, not a SaaS template. Warm paper, deep pine ink, one amber accent,
hairline rules, numbered sections, asymmetric layouts, sharp-ish corners.
Calm, precise, quietly confident — this is a compliance product.

### Hard AVOID list (these are generic "AI-generated site" tells)

- NO pill-shaped badges with tinted backgrounds (e.g. rounded-full eyebrow
  chips). Eyebrows are plain text, defined in section 3.
- NO fully rounded (rounded-full / pill) buttons. Button system in section 4.
- NO icon-inside-tinted-rounded-square feature cards.
- NO floating "glassmorphism" cards, no backdrop-blur decorative cards.
- NO gradient text, no purple/violet anywhere, no emoji, no sparkle icons.
- NO shadow-xl / heavy drop shadows. Max one soft shadow recipe (defined below).
- NO centered hero. Hero is left-aligned, asymmetric.
- NO three identical icon-cards in a row with "rounded-2xl border p-6".
- NO rounded-2xl/3xl everywhere. Radius scale is small and strict (section 2).
- NO generic Tailwind gray borders (#E5E7EB etc). Only the warm --line color.
- NO pure #FFFFFF page backgrounds and no pure #000000 text.

If a pattern feels like it ships with every shadcn landing template, do the
opposite: replace the container with whitespace + a hairline rule.

---

## 1. Design tokens

Define as CSS variables in globals.css and map into Tailwind theme.

### Colors

```
--paper:        #FAF7F2;   /* page background */
--paper-deep:   #F2EDE4;   /* alternate section background */
--pine-900:     #14342B;   /* darkest — dark sections, headings */
--pine-700:     #1E4D3F;   /* primary interactive color */
--pine-100:     #DCE8E2;   /* soft green tint — sparingly */
--amber:        #D98E32;   /* single accent. Use in max 1–2 spots per section */
--amber-deep:   #C97F2E;   /* hover state of amber */
--ink:          #1C2420;   /* body text */
--ink-muted:    #5C6660;   /* secondary text */
--line:         #E3DDD1;   /* ALL borders and rules. Only border color on light */
--line-dark:    rgba(245,242,234,0.14);  /* only border color on dark sections */
--cream:        #F5F2EA;   /* text on dark sections */
--cream-muted:  #A8B8B0;   /* secondary text on dark sections */
```

### Typography

Load via next/font/google:

- Display / headings: **Familjen Grotesk** — weights 500, 600, 700.
  letter-spacing -0.02em on all headings.
- Body / UI: **Hanken Grotesk** — weights 400, 500, 600.
- Data / labels / eyebrows: **Spline Sans Mono** — weight 500.
  Used for: all numbers, stats, calendar digits, eyebrows, footer meta,
  trust-line items. Enable tabular-nums.

Type scale:
- H1: clamp(2.6rem, 5.5vw, 4.5rem), weight 700, line-height 1.05
- H2: clamp(1.9rem, 3.5vw, 2.75rem), weight 600, line-height 1.15
- H3 / card titles: 1.125rem, weight 600
- Body: 1rem (1.0625rem in hero sub), line-height 1.65
- Eyebrow / labels: 0.75rem mono, uppercase, letter-spacing 0.12em
- Small meta: 0.8125rem

### Radius scale (strict, small)

- Buttons, inputs, small chips: 6px
- Cards, images, media frames: 12px
- Large media / app mockup frame: 16px
- Nothing above 16px. No rounded-full except avatar-type circles.

### Shadow (single recipe, used rarely)

```
--shadow-soft: 0 16px 40px -12px rgba(20,52,43,0.15);
```
Only on: the app mockup frame (section 8) and the winner card (section 7).
Nowhere else.

### Spacing & container

- Container: max-w-[1120px], px-6 (px-5 on mobile)
- Section vertical padding: py-24 md:py-32
- Section background rhythm: paper → paper-deep → paper → pine-900 → paper
  → pine-900 (final CTA + footer merge into one dark ending)

### Motion (Framer Motion)

- Global ease: [0.22, 1, 0.36, 1]. Durations 250–400ms.
- Reveal pattern: opacity 0→1, y 20→0, whileInView, viewport { once: true,
  margin: "-80px" }. Stagger children by 0.07s.
- No spring/bounce. No scale-in entrances. Calm and linear-feeling.
- Respect prefers-reduced-motion: disable transforms, keep opacity fades.

---

## 2. Section numbering system (site-wide identity element)

Every major section (except header/footer) opens with a numbered eyebrow line.
This replaces ALL pill badges and is the visual signature of the site:

```
01 — The shift
```

Structure: a horizontal flex row →
- section number ("01") in Spline Sans Mono, 12px, amber
- an em-width gap, then a 32px horizontal hairline (1px, --line)
- then the section label in mono uppercase 12px, ink-muted, tracking 0.12em

No background. No border-radius. No pill. Just type and a rule on the paper.
On dark sections: number stays amber, label uses --cream-muted, rule uses
--line-dark.

---

## 3. Button system (distinctive, non-generic)

Two button types only. Both: radius 6px, font Hanken Grotesk 500 at 0.9375rem,
padding 0.75rem 1.375rem, width fits content (never full-width on desktop;
full-width allowed on mobile < 480px). Height ~46px.

### Primary — "split arrow" button
A rectangle split into two zones by a 1px internal divider:
- Left zone: label text, background --pine-700, text --cream
- Right zone: 44px wide square zone containing a → arrow (Lucide ArrowRight,
  18px), same background, separated by 1px divider in rgba(245,242,234,0.25)
- Hover: background darkens to --pine-900 AND the arrow translates 3px right
  (200ms). No lift, no scale, no shadow.
- On dark sections the primary button inverts: background --cream, text
  --pine-900, divider rgba(20,52,43,0.2). This is the ONLY place a light
  button exists.
- The final CTA section uses one amber variant: background --amber, text
  --pine-900, hover --amber-deep. Amber-filled buttons appear ONLY there.

### Secondary — "underline link" button
Not a boxed button. A text link: ink color, weight 500, with a 1px underline
in --line sitting 6px below the text. Hover: underline color animates to
--amber via scaleX from left (250ms), text color to --pine-700. Optional
trailing → that shifts 3px on hover. This is the secondary action everywhere
("See how it works", "Walk through it", "See pricing").

Never place two boxed buttons side by side. Every CTA pair = one split-arrow
primary + one underline secondary.

---

## 4. Header

- Sticky. Background: --paper at 92% opacity + backdrop-blur-sm (functional
  blur for readability is fine; decorative glass cards are not).
- No bottom border at top of page; a 1px --line border fades in after 24px
  of scroll.
- Left: logotype "Pakkia" in Familjen Grotesk 700, --pine-900, with a small
  geometric mark: a simple triangle-tent line icon (2 strokes, 18px,
  --pine-700) to the left. Keep the mark minimal, almost like a map symbol.
- Right (desktop): "How it works · Pricing" as plain links (ink-muted,
  hover: --pine-900 + 1px amber underline via scaleX), then "Log in"
  (same style), then ONE primary split-arrow button "Start free" in compact
  size (padding 0.5rem 1rem, arrow zone 36px).
- Mobile: logotype + hamburger (2 lines, not 3 — small distinctive detail).
  Menu opens as a full-screen paper overlay with the nav links in H2-size
  Familjen Grotesk, numbered "01 02 03" in mono amber — consistent with the
  section numbering system.

---

## 5. Section 01 — Hero (background: --paper)

Layout: asymmetric 2-column grid, 7/5 split (lg:grid-cols-12, content
col-span-7, visual col-span-5). Left-aligned. Vertically generous:
pt-20 pb-24 below header.

Left column:
- Eyebrow (numbering system): "01 — Overnight-stay reporting · Suomi"
- H1: "Report every night. Without the spreadsheet." The word "spreadsheet"
  gets a hand-drawn-style SVG strike-through in --amber (a single slightly
  wavy path, drawn with pathLength animation 0→1 over 600ms, delayed 400ms
  after the H1 reveals). Do NOT use a background highlight or gradient text.
- Sub-paragraph: ink-muted, max-w-[36rem].
- CTA row: primary split-arrow "Start free" + secondary underline
  "See how it works".
- Below CTAs, a trust line — NOT chips/pills. One single mono 13px line,
  ink-muted, items separated by "·" with a small 12px check icon in
  --pine-700 before each:
  "EU-hosted data · GDPR-compliant · Statistics Finland format · CSV & PDF"
  Sitting on top of a 1px --line rule (padding-top above the rule).

Right column (visual):
- The lake photo in a 12px-radius frame, 1px --line border, aspect 4/5,
  object-cover. Treatment: a subtle duotone feel — overlay --pine-900 at
  12% with mix-blend-multiply so the photo tones match the palette.
- Attached to the photo's bottom edge (overlapping -24px, not floating
  mid-air): a flat data strip card — background --paper, 1px --line border,
  radius 6px, NO blur, NO shadow. Content in one row: mono 12px label
  "Nights logged · June" left, mono 20px "1,284" in --amber right, with a
  tiny 32px sparkline SVG (1.5px --pine-700 stroke) between them.
  It should read like an instrument readout, not a floating glass widget.

Motion: staggered reveal top-to-bottom (eyebrow → H1 → sub → CTAs → trust
line), photo fades in with a slight clip-path reveal from bottom (no scale).

---

## 6. Section 02 — Stats strip (background: --paper, directly under hero)

Not cards. An editorial data table strip:
- Top and bottom 1px --line rules spanning the container.
- 4 columns (2×2 grid on mobile), separated by 1px --line vertical rules
  on desktop.
- Each cell: number in Spline Sans Mono 500 at 2.25rem, --pine-900
  ("<200", "20+", "EU", "5 min" — "EU" in --amber), label beneath in mono
  11px uppercase ink-muted tracking 0.12em.
- Count-up animation on viewport entry for the numeric ones (600ms).
- Generous cell padding (py-8), left-aligned text inside each cell —
  NOT centered. Centered stat cards are a template tell.

---

## 7. Section 03 — The shift (background: --paper-deep)

- Eyebrow: "02 — The shift" (numbering continues logically; renumber all
  sections sequentially 01–06 across the page).
- H2 + intro paragraph, max-w-[44rem], left-aligned.
- Comparison: two columns, but NOT two equal cards. Editorial ledger style:

Left column — "Today · the spreadsheet":
- No card box. A list on the paper-deep background, headed by a mono
  label "TODAY · THE SPREADSHEET" in ink-muted with a 1px --line rule under.
- Each item: an × glyph in mono (not an icon component) in #A65D45,
  followed by the text in ink-muted. Items separated by 1px dashed --line
  rules. The whole column at 90% opacity — deliberately tired-looking.

Right column — "With Pakkia":
- This one IS a card: background --paper (lighter than the section bg),
  1px solid --line border, radius 12px, --shadow-soft. Header row: mono
  label "WITH PAKKIA" in --pine-700 + a small solid 8px amber square
  (a printer's mark, not a badge).
- Items: ✓ as mono glyph in --pine-700, text in --ink, separated by solid
  1px --line rules.
- The card is offset upward by 16px relative to the left column (mt-[-16px]
  on desktop) — subtle asymmetry instead of a floating arrow gimmick.
- Hover on the card: border-color animates to --pine-700 (300ms). No lift.

Motion: left column fades in first, right card 0.15s later, both y 20→0.

---

## 8. Section 04 — The interface (background: --paper)

- Eyebrow: "03 — The interface". H2 + paragraph in left column (5/12),
  app mockup right (7/12) — reversed asymmetry vs hero.
- Secondary underline link "Walk through it →" under the paragraph.

App mockup (the centerpiece of the page — invest effort here):
- A window frame: radius 16px, 1px --line border, --shadow-soft,
  background --paper. Title bar: NOT three traffic-light dots (template
  tell). Instead a slim bar with mono 12px text left "Pakkia — Pitch A-12 ·
  Lakeside" and right "June 2026", separated from body by 1px --line rule.
- Calendar grid: 7 columns. Weekday header row in mono 11px ink-muted.
  Day cells: radius 6px, number in Spline Sans Mono, value-based fill:
  0 → transparent with --line border; 1–3 → --pine-100; 4–6 → #9DBFB0;
  7+ → --pine-700 with --cream text. This heat-map IS the visual interest —
  no other decoration needed.
- Bottom bar inside the frame: 1px --line rule above, row with
  "Nights this month" (mono 12px ink-muted) and "112" (mono 20px,
  --pine-900), plus a compact primary split-arrow "Export report" at the
  smaller header size.
- Looping demo animation (CSS/JS, ~5s cycle): one cell gets a 1px
  --amber outline, its number increments (e.g. 3 → 4), fill tier updates,
  and the "112" total ticks to "113", then everything resets. Subtle,
  no cursor graphic needed — the amber outline reads as the active cell.
- On mobile the mockup shows only the current week row + totals bar so the
  numbers stay legible.

---

## 9. Section 05 — Compliance (background: --pine-900, dark section)

- Remove the standalone forest photo entirely. If atmosphere is wanted, use
  the forest image as a whisper: background-image at 6% opacity under the
  pine-900, blend-mode overlay. Otherwise plain pine-900 is fine.
- Eyebrow: "04 — Compliance, by design" (amber number, cream-muted label,
  --line-dark rule).
- H2 in --cream, intro in --cream-muted, max-w-[40rem].
- The 4 compliance points: NOT cards. A two-column definition list where
  each item is: a mono 12px amber index ("A.", "B.", "C.", "D."), a 1px
  --line-dark rule, then the point text in --cream at 1.0625rem with key
  words ("Statistics Finland", "Frankfurt", "audit trail", "one click") in
  --amber. Row gap 2.5rem. Hover per item: the rule's color animates to
  --amber (250ms) — a quiet, precise interaction.
- Optional right-aligned element: a narrow "audit log" column — 3 rows of
  mono 12px entries ("21:34 · Pitch A-12 · 4 persons · edited by staff")
  in cream-muted on 1px --line-dark separated rows, with rows cycling via
  a slow fade every 3s. Flat, no card background.

---

## 10. Section 06 — What you get / features (background: --paper)

- Eyebrow: "05 — What you get". H2 "Built narrow, on purpose." + intro.
- NOT a card grid. An editorial index table — the strongest anti-template
  move on the page:
  - 6 rows, each spanning the container, separated by 1px --line rules
    (rule above first row and below last row too).
  - Row layout (desktop): [mono 12px amber index "01–06"] · [feature title,
    Familjen Grotesk 600, 1.25rem, --pine-900, ~30% width] · [description,
    ink-muted, ~50% width] · [a small 20px Lucide stroke icon, 1.5px stroke,
    --pine-700, right-aligned — the only icon usage on the page:
    CalendarDays, Activity, FileCheck2, Users, ScrollText, Smartphone].
  - Row hover: background --paper-deep fades in edge-to-edge (250ms), the
    index number turns from amber to --pine-700, icon shifts 2px left.
    Cursor default (rows aren't links) unless you wire them to /how-it-works
    anchors — then cursor-pointer and the whole row is the link.
  - Mobile: rows stack as [index + title] / [description], icon hidden.
- Motion: rows reveal with 0.06s stagger, y 12→0.

---

## 11. Section 07 — Final CTA (background: --pine-900, continues to footer)

- This section and the footer share one continuous pine-900 background —
  no separate rounded CTA card floating in a light section (template tell).
- Layout: left-aligned within container, py-28. A 1px --line-dark rule at
  the very top of the section.
- Eyebrow: "06 — Start now". H2 in --cream: "Your first season on Pakkia
  is on us." with "on us" in --amber. Paragraph in cream-muted.
- CTA row: the single amber primary split-arrow button "Start free"
  (background --amber, text --pine-900, hover --amber-deep) + underline
  secondary "See pricing" in cream with --line-dark underline → amber
  on hover.
- "No card required" as mono 12px cream-muted under the buttons.

---

## 12. Footer (background: --pine-900, continuous with CTA)

- Separated from CTA by a 1px --line-dark rule, py-16.
- 4 columns: brand (logotype in cream + one-line description in
  cream-muted + the trust line in mono 12px, same style as hero trust
  line but cream-muted), then Product / Company / Contact link columns.
- Column headings: mono 11px uppercase cream-muted tracking 0.12em —
  NOT bold H3s.
- Links: cream at 0.9375rem, hover → --amber, no underline animation here
  (keep footer quiet).
- Bottom bar: 1px --line-dark rule, then a single mono 12px row:
  "© 2026 Pakkia · pakkia.fi" left, "Tehty Suomea varten" right in --amber
  italic — this Finnish sign-off is a personality moment, keep it visible.
- "Powered by Growth Nexus" as a small link in the bottom bar, cream-muted,
  hover cream.

---

## 13. Global implementation notes

- One border color per mode: --line on light, --line-dark on dark. Zero
  exceptions.
- Amber budget: maximum 2 amber elements visible per viewport-height.
  If a section already has an amber eyebrow number + one highlight, nothing
  else in it may be amber.
- All numbers everywhere (stats, calendar, totals, indices, dates) render
  in Spline Sans Mono with tabular-nums.
- Images: only the hero lake photo remains, always with the pine duotone
  overlay treatment. No other stock photography.
- Accessibility: maintain 4.5:1 contrast (ink-muted on paper passes;
  cream-muted on pine-900 passes), focus-visible rings in --amber 2px
  offset 2px on all interactive elements, reduced-motion support as noted.
- Performance: next/image for the photo, font subsets latin only,
  animations transform/opacity only (no layout-affecting properties).
- Build reusable components: <SectionEyebrow number label>, <SplitButton>,
  <UnderlineLink>, <Section bg="paper|paper-deep|pine">, so consistency
  is enforced by the component API, not by discipline.
