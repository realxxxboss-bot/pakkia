# Pakkia Portal Redesign Spec — "Nordic Editorial · App Shell"

Third file in the set. Companions:
- PAKKIA_DESIGN_SPEC.md — homepage + core design system (tokens, fonts,
  colors, buttons, eyebrow system, AVOID list)
- PAKKIA_INNER_PAGES_SPEC.md — marketing/legal/auth pages

This file covers the four logged-in portals and every screen inside them:

- Super admin (Platform Console): dashboard, campsites, administrators,
  subscriptions, audit, settings
- Admin (campsite): dashboard, users & roles, pitches, reports, audit,
  settings
- Power user (staff): dashboard, assignments, events, pitches, reports
- Pitch holder: dashboard, calendar, summary, profile

Part A defines the shared app shell + component library (build ONCE, use
everywhere). Part B specifies every screen. Part C is security/production
notes. Part D is the checklist.

---

## SECURITY FLAG — read before any design work

All portal routes currently render PUBLICLY without authentication
(https://www.pakkia.fi/super-admin/dashboard etc. load for anonymous
visitors, including the Platform Console with tenant names, MRR and admin
emails — demo data or not, this must not ship):
1. Gate every /super-admin/*, /admin/*, /power-user/*, /pitch-holder/*
   route behind real auth + role checks (middleware + server-side, not
   just client redirects). RLS alone doesn't protect statically rendered
   demo UI.
2. Add noindex to these routes AND exclude them in robots.txt until auth
   is live, so demo screens don't get indexed meanwhile.
3. This pairs with the dev quick-login removal flagged in the inner-pages
   spec — both must land together.

---

# PART A — SHARED APP SHELL & COMPONENT LIBRARY

The portals must feel like the same brand as the marketing site but
denser and quieter: an instrument, not a brochure. Same tokens, same
fonts (Familjen Grotesk headings, Hanken Grotesk UI, Spline Sans Mono for
ALL data), same single border color, same AVOID list (no pills, no
icon-in-tinted-square, no glassmorphism, no heavy shadows). New rules for
app density below.

## A1. Layout shell

- Grid: fixed left sidebar (260px, collapsible to 68px) + main area.
  Main area background: --paper. Content max-w-[1280px], px-8 py-8
  (px-4 py-5 mobile).

### Sidebar (the portal's identity element)
- Background: --pine-900, full height, 1px --line-dark right border.
- Top block: Pakkia tent mark + logotype in --cream; beneath it, the
  context line in mono 11px --cream-muted: "PLATFORM" (super admin) /
  "RAIRANTA · ADMIN" / "RAIRANTA · STAFF" / "RAIRANTA · A-07" — the
  tenant/pitch context always visible.
- Nav items: mono is NOT used here — Hanken Grotesk 500, 0.9375rem,
  --cream-muted. Each item: a 20px Lucide stroke icon (1.5px) + label,
  py-2.5 px-3, radius 6px.
  - Hover: background rgba(245,242,234,0.06), text --cream.
  - Active: background rgba(245,242,234,0.08), text --cream, PLUS a 2px
    --amber left rule (radius 0) flush to the sidebar edge — the single
    amber element in the sidebar. No filled active backgrounds in pine-100
    (that's the template look).
  - Icons per item: Dashboard LayoutGrid, Campsites Tent, Administrators
    UserCog, Subscriptions Receipt, Audit ScrollText, Settings Settings2,
    Users & roles Users, Pitches Map, Reports FileBarChart2, Assignments
    Link2, Events CalendarRange, Calendar CalendarDays, Summary Activity,
    Profile UserCircle2.
- Bottom block (pinned): user chip — 32px avatar circle (initials, mono
  12px, background rgba(245,242,234,0.1), --cream text), name 0.875rem
  --cream, role in mono 11px --cream-muted. Click opens the user menu
  (A4). Above it, the collapse toggle: a mono "‹" square button, 1px
  --line-dark border.
- Collapsed state (68px): icons only, tooltips on hover (flat --pine-900
  tooltip, 1px --line-dark, radius 6px, mono 12px). Preference persisted
  (localStorage).
- Mobile (<1024px): sidebar becomes an off-canvas drawer from left
  (pine-900, full height, 300ms translate). EXCEPTION — Pitch holder
  portal on mobile uses a bottom tab bar instead (see B4), because
  holders are phone-first.

### Topbar
- Height 60px, background --paper at 95% + backdrop-blur-sm, 1px --line
  bottom border, sticky.
- Left: page title in Familjen Grotesk 600 1.125rem (the H1 lives in the
  content header, this is the compact echo — show only after scrolling
  past the content header; before that the topbar shows the breadcrumb
  in mono 12px ink-muted, e.g. "PLATFORM / CAMPSITES").
- Right: notification bell (A3) + on desktop nothing else — the user
  menu lives in the sidebar. Keep the topbar nearly empty; empty topbars
  read as confidence.

### Content header (per page)
- H1 in Familjen Grotesk 600, clamp(1.5rem, 2.5vw, 2rem), --pine-900.
- One-line description beneath in ink-muted 0.9375rem — keep existing
  copy, it's good ("Nothing is silently editable." is excellent).
- Primary page action (if any) right-aligned on the same row: ONE compact
  split-arrow button (padding 0.5rem 1rem, arrow zone 36px). Secondary
  page actions are underline-links beside it.
- Below, a 1px --line rule spanning the content width, mb-8. Every page
  starts identically — this rule IS the app's visual rhythm.

## A2. Component library (build these once in /components/portal)

### Stat tiles ("instrument row")
NOT four floating cards. One ruled strip (identical DNA to the marketing
stats strip): 1px --line top+bottom rules, cells separated by 1px --line
vertical rules, 2×2 grid on mobile.
- Cell: label in mono 11px uppercase ink-muted tracking 0.12em; value in
  Spline Sans Mono 500 1.75rem --pine-900 (fractions like "11/14" render
  the divisor in 1rem ink-muted); delta/context line in 0.8125rem —
  positive deltas --pine-700, warnings #A65D45, neutral ink-muted.
- Value count-up on first mount only (not on tab return).

### Tables ("ledger")
The core component — every portal screen has one.
- Container: 1px --line border, radius 12px, background --paper (NOT
  white — tables sit on paper like printed ledgers). Overflow-x auto on
  small screens with a right-edge fade hint.
- Header row: mono 11px uppercase ink-muted tracking 0.1em, background
  --paper-deep, 1px --line bottom rule. Sortable columns: hover shows a
  mono "↕" that becomes "↑/↓" when active (--pine-700). No icon buttons.
- Rows: 1px --line rules between; py-3.5. Hover: --paper-deep fill
  edge-to-edge, 150ms. Row is clickable where a detail exists (campsite,
  user) — whole row cursor-pointer, first cell text --pine-700 on hover.
- Entity cell pattern: 28px initials avatar (square, radius 6px — NOT a
  circle; square avatars are a distinctive house style — background
  --pine-100, mono 11px --pine-900) + name 0.9375rem ink weight 500 +
  secondary line (email/subdomain) mono 12px ink-muted.
- Numeric columns: Spline Sans Mono, right-aligned, tabular-nums.
  Currency with € prefix in the same mono.
- Row actions: NOT persistent "Edit / Block" text pairs. A mono "⋯"
  button (28px square, 1px --line border, radius 6px, appears on row
  hover, always visible on touch) opening a small menu (A5). Destructive
  items in #A65D45 at the menu bottom under a 1px --line rule.
- Footer row: "Showing 8 of 14" in mono 12px ink-muted left; pagination
  right as mono "‹ 1 2 ›" square buttons.
- Empty state: centered within the ledger — a 24px stroke icon in
  ink-muted, one line "No pitches yet." in ink, one line of guidance in
  ink-muted, and an underline-link action. No illustrations.
- Loading: skeleton rows — --paper-deep bars, subtle opacity pulse
  (no shimmer gradients).

### Status marks (replaces ALL status pills)
A 7px solid square (the printer's-mark motif) + mono 12px label:
- Active — square --pine-700, label ink
- Trial — square --amber, label ink
- Invited / Pending — square outline only (1px ink-muted), label ink-muted
- Suspended / Blocked / Overdue / Failed — square #A65D45, label #A65D45
- Inactive / Archived — square --line, label ink-muted
- "Live" indicator (activity feeds): --amber square with a slow 2s
  opacity pulse + mono "LIVE".
Same component everywhere: tables, feeds, subscription statuses, 2FA
on/off (On = pine square, Off = outline square).

### Filter bar
Above ledgers: a row of segmented controls and selects, mono 12px.
- Select filters ("Plan: All", "Area: All"): 1px --line border, radius
  6px, height 34px, mono 12px, chevron as "▾" text glyph. Open menu =
  A5 menu style.
- Applied filters render as REMOVABLE RULED TAGS, not pills: mono 12px
  text + "×", 1px --line border, radius 4px, background --paper-deep.
- Search input (where lists are long): underline-style field (Contact
  form pattern) but compact — 1px --line bottom border only, mono
  placeholder, width 220px, "/" keyboard shortcut focuses it.

### Drawers & modals
- Forms (Add campsite, Appoint administrator, Add pitch, Assign holder,
  Add event, Create user, Edit anything): a RIGHT-SIDE DRAWER, not a
  centered modal — 440px wide, background --paper, 1px --line left
  border, slides in 300ms system ease, page behind gets a
  rgba(20,52,43,0.32) scrim (click to close, Esc closes). Drawer header:
  Familjen Grotesk 600 1.125rem + one-line description + "×" square
  button; 1px --line rule below. Footer pinned: 1px --line top rule,
  "Cancel" underline-link left, split-arrow primary right.
- Destructive confirms (Block, Suspend, Close season, Deactivate): a
  small centered modal (420px, radius 12px, 1px --line, --shadow-soft):
  title, consequence sentence in ink-muted, and for irreversible actions
  a type-to-confirm underline field ("Type CLOSE SEASON to continue").
  Confirm button: background #A65D45, --cream text, same split-arrow
  anatomy. Cancel is the default-focused action.
- Form fields inside drawers: the underline editorial field style from
  the auth/contact spec (mono 11px uppercase labels above, 1px --line
  bottom border, focus 2px --pine-700). Selects and radios: radios as a
  vertical ruled list — each option a row with a 16px square check
  target (radius 4px, --pine-700 fill + cream ✓ when selected) — used
  for Plan pickers, Report type, Occupancy basis, etc. Toggles
  (Visible/Internal, counting rules): a 36×20 switch, track 1px --line
  border --paper-deep, thumb 14px square (radius 4px!) --pine-700 when
  on — a square-thumbed switch is a tiny signature detail.

### Menus (user menu, row "⋯", select dropdowns)
Background --paper, 1px --line border, radius 8px, --shadow-soft (one of
the three permitted shadow uses in the portal: drawers, menus, and the
export preview frame). Items 0.875rem, py-2 px-3, hover --paper-deep.
Mono for meta rows (email). Destructive items #A65D45 below a rule.

### Notifications panel (A3)
Bell button (topbar): 34px square, 1px --line border, radius 6px; unread
indicator = a 7px --amber square (not a red dot) at top-right corner.
Opens a right drawer (same drawer component, 400px):
- Header "Notifications" + mono "3 NEW" in --amber + "Mark all read"
  underline-link.
- Items as a ruled list: 7px status square (amber = needs action,
  pine = info, #A65D45 = failure) + text 0.875rem ink + timestamp mono
  11px ink-muted right-aligned. Unread rows: --paper-deep background.
  Row click deep-links to the relevant screen.

### User menu (A4)
From the sidebar user chip: menu (A5 style) anchored above it — name,
email in mono 12px, rule, "Profile", "Settings", rule, "Sign out". Fix
the current dead "Settings → #" link: point to the portal's settings/
profile page per role.

### Charts (site-wide chart language)
Minimal instrument style, all via Recharts (already in stack) restyled:
- Grid: horizontal 1px --line lines only, no vertical grid.
- Axis labels: Spline Sans Mono 11px ink-muted. No axis lines.
- Line series: 1.5px --pine-700, no area fill by default (MRR chart may
  use a flat --pine-100 area at 40%); dots hidden except last point —
  a 7px --amber square.
- Bars: --pine-700, radius 2px top; today's/current bar --amber; hover
  bar --pine-900.
- Tooltip: --pine-900 background, --cream mono 12px, radius 6px, no
  arrow.
- Donut/plan-mix: replace donuts with a HORIZONTAL SEGMENTED BAR (one
  8px-tall bar, segments in pine-700 / pine-100 / amber, radius 4px)
  + a ruled legend list with mono counts. Donut charts are a dashboard
  cliché; a segmented rule bar is the editorial equivalent.

### Heat cells (calendar + heat table)
Shared scale everywhere (marketing mockup, holder calendar, power-user
heat view): 0 = --paper with 1px --line border; 1–3 = --pine-100;
4–6 = #9DBFB0; 7+ = --pine-700 with --cream numeral. Numerals always
mono. Event days: a 2px --amber underline rule inside the cell bottom
(not a ring). Today: 1px --amber outline. Unlogged past day: diagonal
1px --line hatch (bg gradient trick) — instantly scannable "missing"
state, which is the compliance product's whole job.

### Toasts
Bottom-right (bottom-center mobile): --pine-900 background, --cream
text 0.875rem, mono for values, radius 8px, 7px status square left,
auto-dismiss 4s, "Undo" underline-link where applicable (e.g. after
Deactivate pitch).

### Activity feeds ("audit ticker")
Reused across dashboards: a ruled list, each row [avatar square 24px]
[text 0.875rem — actor in weight 500, values in mono ("4 → 5")]
[timestamp mono 11px ink-muted right]. New rows (Realtime) enter with a
single --paper-deep flash fading over 1.2s — no slide animations.

### Motion rules (portal-specific)
Less motion than marketing: NO whileInView reveals inside the app.
Permitted: drawer/menu transitions, count-ups on first mount, heat-cell
save flash (--amber outline fade 800ms), realtime row flash, chart
draw-in once (400ms). Everything else is instant. Respect
prefers-reduced-motion throughout.

---

# PART B — SCREEN-BY-SCREEN SPECS

Existing copy and data fields stay; this restructures presentation.

## B1. SUPER ADMIN — "Platform Console"

Sidebar context line: "PLATFORM". This portal may additionally show a
mono 11px "CONSOLE" tag beside the logotype — the operator's cockpit.

### B1.1 Dashboard (/super-admin/dashboard)
Order top to bottom:
1. Content header: H1 "Platform overview", the smart summary line
   ("2 trials end this week — worth a nudge." — keep; make the number
   computed, and render inline underline-links to the filtered
   campsites view). Action: compact split-arrow "Add campsite" (opens
   drawer B1.2d).
2. Instrument row (4 cells): Campsites 11/14, Total pitches 1,240,
   Nights logged 18,420, Active users 182 — with their delta lines.
3. Two-column band (7/5):
   - Left: MRR chart (line, monthly, EUR mono y-axis) in a ledger frame
     with a mini header row: "RECURRING REVENUE (MRR)" mono label +
     current value "€512" in mono 1.25rem right.
   - Right: Plan mix — segmented bar + ruled legend (Standard 5,
     Starter 4, Multi-site 2, Trial 3), plus "11 PAID" mono tag.
4. "Needs attention" ledger (this is the console's most valuable block —
   promote it visually): full-width ledger, rows = campsite entity cell +
   status mark + issue text + a RIGHT-ALIGNED compact action per issue
   type (Convert → underline-link to subscriptions row; Review →
   drawer with payment detail; Nudge → confirm modal that queues a
   reminder email). Issue severity via the status square color.
5. Two-column band (6/6): Recent signups (ledger rows with "Provision"
   compact split-arrow each, opening the Add-campsite drawer prefilled
   with the signup's name/email) · Recent activity (audit ticker, LIVE
   mark, last 6, "View audit log" underline-link).
6. The "Add campsite" form currently rendered INLINE at the page bottom
   moves entirely into the drawer — dashboards must not end in a form.

### B1.2 Campsites (/super-admin/campsites)
a. Header + "Add campsite" split-arrow.
b. Filter bar: Plan select, Status select, search by name/subdomain.
c. Ledger columns: Campsite (entity cell: square avatar, name,
   subdomain in mono 12px), Plan (plain text, mono), Status (status
   mark), Pitches (mono right), Users (mono right), Nights MTD (mono
   right), MRR (mono right, €), Joined (mono), "⋯" actions (Open,
   Change plan, Suspend/Reactivate, Sign in as admin — see note).
   Row click → campsite detail route (/super-admin/campsites/[slug])
   — spec that detail page as: header with campsite name + status,
   instrument row (pitches/users/nights/MRR), tabs-as-ruled-links
   (Overview · Team · Usage · Billing · Danger zone) using an
   underline-active pattern (2px --pine-700 bottom rule on active tab,
   radius 0), each tab a ledger of the relevant data.
   "Sign in as admin" (support impersonation) must: require a confirm
   modal, be time-boxed, banner the session (a full-width 40px --amber
   strip atop the impersonated portal: "Support session · Rairanta ·
   12 min · End session" in --pine-900 mono), and audit-log it (it
   already does — keep that).
d. Add-campsite drawer: fields Campsite name, Subdomain (with live mono
   suffix preview "→ saimaa.pakkia.fi", availability check with mono
   "✓ available"/"× taken" inline), Administrator email, Plan (ruled
   radio list incl. Trial 30 days), footer Cancel + "Create campsite".
   Success toast: "Rairanta provisioned · invite sent".

### B1.3 Administrators (/super-admin/administrators)
- Instrument row: Active 5 · Invited 2 · Blocked 1 (3 cells).
- Ledger: Administrator (entity cell with email), Campsite
  (underline-link), 2FA (status mark On/Off — consider surfacing
  "2FA Off" with an outline #A65D45 square to nudge enforcement),
  Last active (mono; "Invite pending" as invited status), Status,
  "⋯" (Resend invite / Copy invite link / Block / Unblock).
- "Appoint administrator" drawer: Campsite select, Full name, Email,
  helper line "An invite with a magic link is sent immediately." in
  ink-muted 0.8125rem, footer "Send invite".
- Block flow: destructive modal with the existing consequence copy
  ("The campsite keeps running, but no one can administer it…") —
  good copy, keep verbatim.

### B1.4 Subscriptions (/super-admin/subscriptions)
- Instrument row: MRR €512 (+18% MoM in pine-700), ARR €6,144,
  Paid subscriptions 11, Trial→paid 64%.
- Tenant subscriptions ledger: Campsite, Plan, Status mark, MRR,
  Next invoice (mono; "Trial · 2d left" gets an --amber square when
  ≤3 days; "Overdue" in #A65D45). Row "⋯": Change plan, View invoices,
  Suspend.
- Recent invoices ledger below with "Export all" underline-link:
  Campsite, Plan, Amount (mono €), Date (mono), Status mark
  (Paid pine / Payment due #A65D45), "⋯" → Download PDF.
- Footer note strip (keep content): "EU · Frankfurt · GDPR · Invoices
  issued in EUR by Growth Nexus…" as a 1px --line ruled slim strip,
  mono 12px ink-muted.

### B1.5 Audit log (/super-admin/audit)
- Header + "Export" compact split-arrow (CSV).
- Filter bar: Actor select, Event type select, Campsite select, date
  range (two underline date fields), search.
- Ledger: Timestamp (mono), Actor (entity cell; "System" gets a plain
  --paper-deep square avatar with "SY"), Event (weight 500), Campsite
  (underline-link), Detail (mono 12px ink-muted — values like
  "Starter → Standard" belong in mono). Support sessions ("Signed in
  as admin") get an --amber status square — impersonation must be
  visually loud in the log.
- Rows are append-only and non-clickable except a "⋯ → Copy as JSON".
- Infinite scroll with a mono "LOADING…" row, or ledger pagination —
  pick one and match the campsite ledger.

### B1.6 Platform settings (/super-admin/settings)
Settings pages use a two-column form layout: left column (sticky) =
group title (Familjen Grotesk 600 1.125rem) + one-line description;
right column = the fields in a ledger-framed block. Groups stacked with
py-10 and 1px --line rules between:
1. Plans & pricing — three sub-blocks (Starter/Standard/Multi-site),
   each: Price €/mo + Pitch limit as underline number fields (mono
   input text). One "Save changes" split-arrow for the group, disabled
   until dirty; saving shows toast + writes an audit event ("Plan
   pricing updated").
2. Data & region — read-only fact rows (EU · Frankfurt, GDPR, Daily
   backups) as mono ruled rows + Default retention number field.
3. Email sender — Sender address field with a "Send test email"
   underline-link.
4. Trial length — Days number field.
5. Branding — Footer credit text field with live mono preview row
   ("Powered by Growth Nexus").
Unsaved-changes guard: a slim sticky bottom bar (--pine-900, cream
text, "You have unsaved changes" + Save/Discard) appears when any
group is dirty.

## B2. ADMIN — campsite portal (Rairanta · Admin)

Sidebar context: "RAIRANTA · ADMIN". Nav: Dashboard, Users & roles,
Pitches, Reports, Audit log, Settings.

### B2.1 Dashboard (/admin/dashboard)
1. Content header: greeting H1 "Good morning, Olli." (keep — computed
   time-of-day; Finnish flavor optional: "Huomenta, Olli."), summary
   line, action "Export report" underline-link → Reports.
2. Instrument row: Active pitches 54/60, Power users 3 (pending-invite
   note line), Pitch holders 41, Nights this season 6,120 (+12% vs 2025
   in pine-700).
3. Chart band (7/5): Nights logged — June (daily bar chart, today's
   bar amber) · Occupancy block: big mono "68%" + segmented
   occupied/vacant bar + "Peak: Sat 14 Jun · 92%" mono line with a
   small --amber square.
4. Occupancy by area: NOT a chart — a ruled list where each row is
   [Area name + "14 pitches" mono 12px] [an 8px horizontal bar track
   (--paper-deep, 1px --line) filled --pine-700 to the %] [mono "82%"
   right]. Sorted desc. Rows link to Reports pre-filtered by area.
5. Recent activity ticker (LIVE), 5 rows, mono value diffs ("4 → 5"),
   "View audit log" underline-link.

### B2.2 Users & roles (/admin/users)
- Header + TWO actions: primary split-arrow "Create user" (opens
  drawer with the Role radio at top — Power user / Pitch holder — the
  current two separate buttons collapse into one drawer), secondary
  underline "Invite links".
- Instrument row: Power users 3 · Pitch holders 41 · Invites pending 4.
- Filter bar: Role select, Status select, search.
- Ledger: Name (entity cell), Role (mono text; "Administrator" row
  shows an "OWNER" mono tag in --pine-700 instead of actions), Pitch
  (mono; "All pitches" for power users; holder's pitch e.g. "A-07"),
  Status mark, "⋯" (Edit, Resend invite, Copy magic link, Block/
  Unblock). Blocked rows: name struck through in ink-muted? NO —
  never strike names; just the #A65D45 status mark.
- Create-user drawer: Role ruled-radio (switching updates the helper
  text — keep both existing helper paragraphs verbatim, they're
  excellent role documentation), Full name, Email, and for Pitch holder
  an optional Pitch select ("Assign later" default). Footer "Create
  user". Success toast with "Copy invite link" action.

### B2.3 Pitches (/admin/pitches)
- Header ("6 active of 60" → fix the copy bug: it should read "54
  active of 60") + "Add pitch" split-arrow.
- Filter bar: Area select, Status select, search by pitch number.
- Ledger: Pitch (mono weight 500, e.g. "A-12"), Area, Setup (mono 12px
  "Electric · Grass"), Assigned holder (entity cell or "— Unassigned"
  in ink-muted with an outline status square), Status mark
  (Active/Inactive), Nights MTD (mono right), "⋯" (Edit, Deactivate/
  Activate, View calendar). Unassigned+Active rows get a subtle
  --amber outline square in the holder cell — they're the actionable
  anomaly.
- Add/Edit pitch drawer: Pitch number, Area select, Hookup ruled-radio,
  Surface ruled-radio, Assign holder select (optional). Deactivate =
  confirm modal noting logged data is kept.
- Optional (phase 2, spec now build later): an "Area map" toggle —
  a flat SVG plot of pitch squares grouped by area, heat-colored by
  MTD nights, using the shared heat scale. Pure SVG, no map library.

### B2.4 Reports & export (/admin/reports)
Two-column: left options rail (sticky, 320px), right preview.
- Options rail (ledger-framed): Report type ruled-radio (Daily
  breakdown / Monthly summary / Seasonal total), Period (month select
  or date range per type), Pitches (multi-select — "All pitches (60)"
  default; selected subset renders removable ruled tags), Format
  ruled-radio CSV/PDF, then the split-arrow "Export CSV" (label follows
  the chosen format). Under the button, a mono 12px reassurance line:
  "Maps to Statistics Finland figures · logged to audit trail".
- Preview: a document frame (the third permitted shadow) — radius
  12px, 1px --line, slim title bar "PREVIEW — MONTHLY SUMMARY ·
  JUNE 2026" in mono. Inside, the totals ledger (Pitch, Area, Nights,
  Person-nights, Occupancy — all numerics mono right-aligned) with the
  Total row: --paper-deep background, 2px --pine-700 top rule, values
  weight 500. Preview updates live on option changes with a 150ms
  opacity cross-fade.
- Export flow: button → "Preparing…" with arrow-zone spinner → toast
  "June 2026 CSV exported" + browser download + audit event. PDF uses
  the board-ready template (Pakkia logotype, mono figures, generated
  timestamp).

### B2.5 Audit log (/admin/audit)
Same ledger as B1.5, scoped to the campsite: Timestamp, User (entity
cell), Action, Entity (mono, e.g. "A-07 · 19 Jun"), Detail (mono diffs
"4 → 5"). Filter bar: Action select, User select, date range. Record
edits (the compliance-critical rows) get a --pine-700 square; settings
changes an outline square; blocks #A65D45. Keep the header line
"Nothing is silently editable." — consider echoing it as the empty-state
line too.

### B2.6 Settings (/admin/settings)
Two-column settings layout (B1.6 pattern). Groups:
1. Site details — Campsite name, Subdomain (read-only with mono lock
   note "Contact platform to change").
2. Season definition — Season start/end, Peak start/end (four underline
   date fields; validation: peak within season).
3. Scoring & occupancy — Pitch capacity (number), Occupancy basis
   ruled-radio (Person-nights / Pitch-nights), Counting rules as two
   square-thumb toggles with their existing helper sentences (keep
   verbatim — "Nudge holders at 20:00…" is good).
4. Danger zone — ledger-framed block with a 1px #A65D45 border instead
   of --line (the only red border in the app): "Close season & archive"
   + consequence copy + a #A65D45 split-arrow "Close season" →
   type-to-confirm modal ("Type CLOSE 2026"). Post-close, the portal
   shows a read-only season banner (--paper-deep strip: "Season 2026
   is archived · read-only").
Unsaved-changes bar as B1.6. Every save = audit event (already true —
"pitch capacity 5 → 6" appears in the log; keep parity).

## B3. POWER USER — staff portal (Rairanta · Staff)

Sidebar context: "RAIRANTA · STAFF". Nav: Dashboard, Assignments,
Events, Pitches, Reports. No settings — correct per role; profile via
user menu.

### B3.1 Dashboard (/power-user/dashboard)
Tonight-focused — this user's job is "did everyone log?":
1. Header: mono date line "TUESDAY · 19 JUNE 2026", H1 "Hei, Mikko."
   (keep the Finnish greeting — brand personality), the status
   sentence with computed numbers, action underline-link "Assign a
   holder".
2. Instrument row: Pitches managed 24 · Logged tonight 19/24 · Pending
   assignments 3 · Occupancy tonight 78% (+6% vs last Tuesday). The
   "Logged tonight" cell is the hero: if <100% by 20:00, its value
   renders --amber and the context line shows "5 STILL TO LOG" mono —
   the whole cell click-through to Pitches filtered to unlogged.
3. Quick actions: the current three link-cards become a single ruled
   strip of three cells (Assign a holder / Add an event / View
   pitches), each: 18px stroke icon + label + mono 12px description,
   hover --paper-deep, whole cell a link. No icon squares.
4. Two-column (7/5): Recent entries by holders (ticker: "Olli Virtanen
   logged 7 persons on A-12" with area in mono 12px and heat-square
   colored by count — a 12px square beside the number using the shared
   scale; LIVE mark; realtime flash on insert) · This week (7-day bar
   chart, today amber + "1,554 THIS WEEK SO FAR" mono header).
5. Two-column (6/6): Pending assignments (ruled rows "C-08 · Meadow ·
   No holder · 2026" + compact "Assign" split-arrow each, opening the
   assign drawer prefilled) · Upcoming events (ruled rows: mono date
   range, title, scope mono tag "SITE-WIDE"/"B AREA", visibility
   status mark Visible pine / Internal outline; "Manage" underline-link).

### B3.2 Assignments (/power-user/assignments)
- Header (keep the role-boundary copy: "…only an administrator creates
  new users." — render "only an administrator creates new users" with
  a "Request from admin" underline-link that opens a prefilled mailto
  or in-app note).
- Instrument row: Assigned 7 · Unassigned 3.
- Filter bar: Area select, Status select (Active/Unassigned/Ending
  soon).
- Ledger: Pitch (mono), Area, Holder (entity cell or "— Unassigned"),
  Agreement (mono "Seasonal · since 1 May"), Status mark (Active pine /
  Ending soon amber / Unassigned outline), action: compact "Assign"
  split-arrow on unassigned rows; "⋯" (Reassign, Release, View
  calendar) on assigned rows.
- Assign/Reassign drawer: context header showing the pitch ("C-08 ·
  Meadow" in mono), Pitch holder select (searchable), Agreement
  ruled-radio (Seasonal / Short-stay), Season/date range, footer "Save
  assignment". Reassign shows the current holder with an "ends today"
  note; release = confirm modal (record history retained).

### B3.3 Events (/power-user/events)
Two-column (5/7):
- Left: "Upcoming & recent" ruled list — each row: mono date ("20–22
  JUN"), title weight 500, scope mono tag, visibility status mark +
  a square-thumb toggle to flip Visible/Internal inline (optimistic,
  toast on save), "⋯" (Edit, Delete → confirm modal).
- Right: month calendar (shared calendar component, read-only variant):
  event days get the 2px --amber bottom rule inside the cell; hovering
  an event row on the left highlights its day cells (1px --amber
  outline) — a small, delightful link between list and calendar.
  Month switcher: mono "‹ JUNE 2026 ›".
- "Add event" drawer: Title, From/To dates, Scope select (Site-wide /
  per area), "Visible to pitch holders" toggle with helper "Holders
  see visible events on their logging calendar." Footer "Save event".

### B3.4 Pitches (/power-user/pitches)
Read-only analytics — make the read-only nature explicit: under the
header, a mono 12px line "READ-ONLY VIEW · counts are logged by
holders".
- Filter bar: Range select (presets + custom), Pitch select, Client
  select. "8 PITCHES" mono result count right.
- Overnight summary ledger: Pitch, Area, Client, Nights, Person-nights,
  Busiest (mono with a heat square), Last logged (mono; unlogged
  yesterday+ shows an outline amber square), Occupancy (mono %).
- Nightly heat view: the signature screen. A ledger-framed grid:
  sticky first column (Pitch + holder mono 12px), then one column per
  day (mono day numbers header), cells = shared heat cells (28px
  square, mono numeral). Hover: 1px --pine-900 outline + tooltip
  (--pine-900, mono: "B-09 · 4 Jun · 8 persons"). Row total column
  --paper-deep, weight 500. Legend row: the five heat swatches +
  "FEWER — MORE" mono + the hatch swatch labelled "UNLOGGED".
  Horizontal scroll with sticky pitch column on mobile.

### B3.5 Reports (/power-user/reports)
- Header copy keep ("For the full Statistics Finland export, ask an
  administrator." — role boundary again; underline-link "ask an
  administrator" → mailto admin).
- View switch: "By area / By day" as the ruled-tab pattern (2px
  --pine-700 bottom rule active), month + area selects, "Export CSV"
  compact split-arrow.
- Instrument row: Pitches 60 · Nights 1,190 · Person-nights 4,330 ·
  Avg occupancy 66%.
- Summary ledger (by area): Area, Pitches, Nights, Person-nights,
  Occupancy — plus an inline bar in the Occupancy cell (the B2.1 area
  bar pattern). "All areas" total row styled as the B2.4 total row.
  By-day view: same frame, rows = dates, columns = Nights /
  Person-nights / Occupancy, weekend rows' date in --pine-700.

## B4. PITCH HOLDER — holder portal (Rairanta · A-07)

The 10-second-a-day portal. Phone-first: on mobile, NO sidebar — a
bottom tab bar (4 tabs: Dashboard, Calendar, Summary, Profile), 56px,
--paper background, 1px --line top rule, active tab icon+label
--pine-700 with a 2px --pine-700 top rule on the active tab (radius 0).
Desktop keeps the standard sidebar. Content max-w-[720px] centered —
this portal is intentionally narrow even on desktop.

### B4.1 Dashboard (/pitch-holder/dashboard)
1. H1 "Hei, Aino." + mono date line.
2. THE CARD (the one place a true card is earned): the pitch + tonight
   block — 1px --line, radius 12px, --paper background:
   - Top row: "YOUR PITCH" mono label, pitch "A-07" in Spline Sans
     Mono 500 2rem --pine-900, "Forest edge · Rairanta" ink-muted.
   - Rule.
   - Tonight zone: if unlogged → "You haven't logged tonight yet." in
     ink + a FULL-WIDTH split-arrow "Log tonight's guests" (the only
     full-width button in the entire product — thumb-reach priority).
     If logged → "Tonight · 5 persons" with mono value + underline
     "Edit" + a pine ✓ square. After 20:00 unlogged: the zone's top
     rule turns --amber and the button pulses once on load (single
     600ms opacity pulse, not looping).
3. Instrument row (2 cells): Person-nights · June 85 · Nights logged 17.
4. "What's on" ruled list (events marked visible): mono dates + titles;
   Midsummer-type ranges show the amber-underline day marks in the
   mini legend.
5. "Last few nights" ruled list: "MON 18 JUN" mono + "5 persons" with
   a heat square; each row click → calendar with that day's stepper
   open. "View all" underline-link.

### B4.2 Calendar (/pitch-holder/calendar) — the product's core screen
- Header: H1 "Calendar", line "Your pitch A-07. Tap any day to enter
  or edit the number of persons who stayed."
- Month calendar, large: cells min 44px (48px+ on phones — touch
  targets), shared heat cells with mono numerals; today amber outline;
  event days amber bottom rule; past unlogged days hatched; future
  days plain --paper at 60% opacity, non-interactive.
- Month switcher "‹ JUNE 2026 ›" mono; months outside the season
  disabled with a mono "SEASON: 1 MAY – 15 OCT" note.
- Footer strip under the grid: "PERSON-NIGHTS · JUNE" mono label +
  "85" mono 1.5rem + a compact split-arrow "Log tonight".
- Legend row: heat swatches, TODAY, EVENT DAY, UNLOGGED hatch.
- THE STEPPER (replaces the "Log night" form): tapping any editable
  day opens a BOTTOM SHEET on mobile (drawer variant sliding from
  bottom, radius 16px top corners only) / the right drawer on desktop:
  - Header: "A-07 · WED 19 JUN" in mono + event tag if any ("MIDSUMMER"
    mono amber).
  - Center: giant stepper — "−" and "+" as 56px square buttons (1px
    --line, radius 8px, active: --pine-700 fill cream glyph) flanking
    the count in Spline Sans Mono 500 at 4rem --pine-900. Long-press
    repeats. Direct numeric input on tap of the number. Range 0–[pitch
    capacity from admin settings]; exceeding shows mono note "MAX 6
    PER PITCH".
  - "0 persons" is a valid entry — a helper line clarifies: "0 = pitch
    was empty tonight" (matches the admin counting rule).
  - Footer: "Cancel" underline + full-width split-arrow "Save night".
  - Save: optimistic — sheet closes, the day cell flashes an --amber
    outline fading 800ms as the heat color updates, the month total
    ticks up. Offline: entry queues locally with the cell showing a
    dashed --amber outline + toast "Saved on this phone — will sync";
    background sync on reconnect (holders log from fields with bad
    signal — this matters).
  - Editing a past day: identical, plus a mono 11px note "Edits are
    recorded in the audit trail." — transparency, not warning.

### B4.3 Summary (/pitch-holder/summary)
- Header + "Export report" compact split-arrow (fix: currently a dead
  "#" link — wire to a holder-scoped CSV/PDF of their own pitch only).
- Season hero: "THIS SEASON · 2026" mono label, "312" mono 2.5rem,
  "person-nights across 74 nights logged" ink-muted.
- Person-nights by week: bar chart (shared chart language), current
  week amber.
- Instrument row (2×2): June nights 88 · Busiest night 9 · Avg per
  night 4.2 · Occupancy 70%.
- By month ledger: Month ("June 2026 · IN PROGRESS" mono tag), Nights
  logged, Person-nights — mono, right-aligned; rows click through to
  that month's calendar.

### B4.4 Profile (/pitch-holder/profile)
Single narrow column, ledger-framed groups:
1. Your details — Name, Email (underline fields), Save split-arrow.
2. Your pitch — read-only mono facts: "A-07 · Forest edge · Seasonal ·
   1 May – 15 Oct" + note "Assigned by campsite staff." (no self-serve
   change — role boundary).
3. Notifications — square-thumb toggles: "Remind me at 20:00 if
   tonight is unlogged" (default on), "Event announcements".
4. Language — ruled-radio: Suomi / English (the whole portal should be
   i18n-ready; Finnish holders are the real users — flag as the
   follow-on task).
5. Security — Change password (drawer), sessions list.
6. Sign out — underline-link, #A65D45.

---

# PART C — CROSS-PORTAL PRODUCTION NOTES

1. AUTH GATING (see Security flag) — middleware + server checks on all
   portal routes; Supabase RLS remains the data backstop; noindex until
   live.
2. Notifications: back all four portals' panels with one notifications
   table + Supabase Realtime channel per user (pattern proven in the
   Growth Nexus phase plan); unread count via the amber square.
3. Realtime feeds: activity tickers subscribe to scoped channels
   (platform / campsite / pitch); insert flash per A2.
4. All migrations this work generates: save as named idempotent .sql
   files for manual execution in the Supabase SQL editor — do NOT
   attempt to apply to live Supabase.
5. Every mutating action writes an audit row (provision, plan change,
   user CRUD, assignment, event, record entry/edit, settings, exports,
   impersonation). The audit ledger is the product's spine — treat any
   unaudited mutation as a bug.
6. i18n: wrap all portal strings now (next-intl or equivalent), ship
   English, add Finnish as the fast follow — holder-facing screens
   first (B4).
7. Time zone: all "tonight"/"20:00" logic in Europe/Helsinki
   server-side, never client local time.
8. Accessibility: ledgers are real <table> elements with <th scope>;
   heat cells carry aria-labels ("19 June, 4 persons"); stepper buttons
   aria-labelled; drawers trap focus and restore it on close; status
   conveyed by text+shape, never color alone (the square + label pattern
   already satisfies this).

# PART D — CONSISTENCY CHECKLIST

- [ ] One sidebar shell, one topbar, one content-header pattern across
      all four portals; only nav items and context line differ.
- [ ] Zero status pills; every status is square-mark + mono label from
      the single StatusMark component.
- [ ] Zero centered form modals; all forms are drawers, destructive
      confirms are the only centered modals.
- [ ] All numerals in Spline Sans Mono tabular-nums, right-aligned in
      ledgers.
- [ ] One heat scale shared by marketing mockup, holder calendar, and
      staff heat view.
- [ ] Shadows only on: drawers/menus, report preview frame, (marketing
      carry-overs). Nothing else.
- [ ] Amber budget holds inside the app: active-nav rule, LIVE/unread
      marks, today/current data points, attention states — never
      decorative.
- [ ] Dead links fixed: user-menu "Settings → #", holder "Export
      report → #".
- [ ] Copy bug fixed: admin Pitches header "6 active of 60" → correct
      computed count.
- [ ] Impersonation is banner-visible, time-boxed, and audit-logged.
- [ ] Portal routes auth-gated + noindexed until launch; dev quick-login
      fully removed (UI + endpoints).
- [ ] prefers-reduced-motion respected; portals are near-motionless by
      design.
