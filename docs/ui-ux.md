# HukukAI UI/UX Design System

> Mandatory standard for a serious, premium legal practice application. This document defines the visual language that separates HukukAI from generic AI dashboards.

## Principles

* Professional, corporate, calm, trustworthy
* Information-dense without crowded feeling
* Predictable navigation (1–2 actions to any primary feature)
* Case-first: case context always visible in workspace
* Table-first for structured data; cards only where comprehension improves
* Search-first; AI as contextual tool, not visual identity
* WCAG AA, keyboard-friendly, reduced-motion respected

Not used: excessive gradients, glassmorphism, glowing AI effects, oversized rounded cards everywhere, random colorful icons, marketing hero areas, bouncing animations.

Reference feel: case-management software / premium enterprise productivity / modern legal-financial workstations.

---

## Navigation

**Persistent desktop sidebar** (260px, collapsed 76px icon-only), mobile drawer with overlay, 1–2 action reach.

**Primary (flat, per spec):**
Dashboard (Genel Bakış) — `/` — LayoutDashboard
Davalar — `/davalar` — BriefcaseBusiness
Müvekkiller — `/muvekkiller` — Users
Belgeler — `/belgeler` — FileText
Hukuki Araştırma — `/hukuki-arastirma` — FolderSearch
Emsal Kararlar — `/emsal-kararlar` — Gavel
Mevzuat — `/mevzuat` — Archive/BookOpen
Dilekçeler — `/dilekceler` — FileText
Takvim & Süreler — `/takvim` — CalendarDays
AI Asistan — `/ai-asistan` — Sparkles (restrained)
Arşiv — `/arsiv` — Archive

**Secondary:** Ayarlar — `/ayarlar` — Settings2

States: active = `bg-sidebar-accent` + inset `3px` primary indicator + primary icon; inactive = muted with hover `sidebar-accent/.72`; badges mono 10px; keyboard focus ring via `--ring`.

Collapsed desktop keeps icons + active indicator; text hidden via `md:hidden` pattern (`hukuk-shell.tsx:47-118`).

Header: search input `sm:w-[265px]` with `⌘ K` hint, mobile fallback icon button, source verification badge, theme toggle, avatar.

**Current gap:** `hukukai/src/components/hukuk-shell.tsx` groups nav into 3 sections (Çalışma alanı / Hukuk masası / Takip) vs spec flat list; labels slightly differ (Genel Bakış vs Dashboard, Takvim vs Takvim & Süreler). Functionally correct but should be flattened to single primary list in next iteration for spec compliance.

## Visual Hierarchy

`PageHeader` pattern (`hukuk-pages.tsx:165-176`):
```
Eyebrow (mono 10px uppercase, primary)
Title serif clamp(2-3.1rem) tracking -.045em
Description 14px muted, max-w-2xl
[Primary Action] [Secondary]
```
Breadcrumb/context will be added for case workspace (`Davalar → 2026/145`). Supporting metadata in mono 10px.

## Case Workspace (most important)

Header must show: case number (mono), title (serif), court, client, opposing party, status badge, next hearing, critical deadline, assigned lawyer — persistent while tabbing. Implemented partially in `CaseWorkspacePage:355-363`; needs extraction to `CaseContextHeader`.

Tabs (horizontal, scan-friendly): Genel Bakış | Belgeler | Kronoloji | Taraflar | Deliller | Mevzuat | Emsal Kararlar | AI Analizi | Dilekçeler | Duruşmalar | Süreler | Notlar | Sonuç. Current only 3 tabs (`overview/documents/timeline`) — expand with responsive grouping (overflow menu or secondary nav) to avoid horizontal nightmare.

## Dashboard

Answers “What requires my attention today?” Priority: critical deadlines → hearings → tasks → activity → documents → research. Current `DashboardPage` shows stats grid (5 cards) + priority alerts + activity + recent research/documents. Stats are secondary, not dominant — compliant, but deadlines should be actionable ` [Dosyaya Git]` and more prominent than metrics.

## Tables vs Cards

**Use tables for:** cases, clients, documents, precedents, deadlines, hearings, research results. Requirements: sorting, filtering, search, pagination, compact/comfortable density, row hover, contextual actions. Current `CasesPage` renders list as `grid` links mimicking table (hidden header on lg) — should migrate to `DataTable` component (`components/shared/DataTable`).

**Cards** only where they improve comprehension (e.g., case context header, source excerpt). Avoid oversized rounded cards everywhere (current dashboard uses `rounded-2xl` appropriately but should tighten radius to `0.75rem` per token).

## Search

Prominent header input (desktop) + global `Cmd+K` shortcut (hint shown). Future: unified search across cases/clients/documents/precedents/research/notes. Current search is per-page local state — elevate to global.

## AI UX

AI never dominates visuals. Contextual actions: Dosyayı Analiz Et, Karşı Taraf Gibi Analiz Et, Benzer Davaları Bul, Mevzuatı Araştır, Dilekçe Taslağı Oluştur. Clearly badge states:
`AI TASLAĞI` (muted), `AVUKAT İNCELEMESİNDE` (amber), `DOĞRULANDI` (green), `KISMEN DOĞRULANDI` (amber), `DOĞRULANAMADI` (red), `NİHAİ` (primary). Current `StatusChip` handles green/amber/red/slate — extend to six.

## Source UX

Source item shows: Authority, Title/Decision, Date, Reference, Verification status, expandable excerpt. Verified sources visually distinct (border primary/.2) from AI interpretation (destructive/.2). Current `fallback*` uses `DEMO VERİ` amber chip — correct pattern.

## Forms & Modals

Forms: labels always visible, sensible grouping, tab order, inline validation, meaningful errors, primary action identifiable. Current `Field` + `Modal` does this but case creation is inside modal — spec says use page/drawer for complex workflows; consider dedicated `/davalar/yeni`.

Modals only for short confirmations/small forms/destructive confirms. Pages/drawers for complex.

## Color System

Restrained corporate palette from `index.css:71-125`:

* Background `42 35% 96%`, Foreground `218 34% 17%`
* Primary `165 38% 38%` (teal — single brand accent)
* Accent `29 78% 62%` (amber for warning)
* Destructive `2 63% 49%` (critical)
* Muted `39 21% 91%`
* Sidebar `218 34% 17%` dark

Semantic only: red critical, amber review, green verified, blue/neutral informational. No gradients as primary language (current `workspace-grid` subtle grid, not gradient — acceptable).

## Typography

* Sans `Manrope` 400/500/600/700/800 for UI
* Serif `Newsreader` for titles
* Mono `DM Mono` for numbers/dates/badges
* Scale restrained (no giant headings: title clamp 2-3.1rem, eyebrow 10px, body 13-14px, mono 10px). Long-form legal text: line-height 6 (1.5) and max-width 2xl for readability.

## Spacing & Density

Desktop uses available space productively: `mx-auto max-w-[1480px]`, `gap-3-5`, `p-4-5`, `grid-cols`. Avoid huge empty margins/giant cards — current padding `p-5` with `gap-3` is dense but readable. Density toggle (compact/comfortable) planned for tables.

## Responsive

Desktop primary. Tablet courtroom use priority. Mobile prioritizes case lookup, next hearings, deadlines, quick notes, document viewing, AI quick query — not just shrunken desktop. Current shell has `md:hidden` drawer + `md:pl-[260px]` — correct.

## Empty / Error / Loading

* Empty: explains next action + CTA, e.g., “Bu davaya henüz belge eklenmedi.” [Belge Yükle]; no cartoon art. Current `EmptyState` does this with icon + dashed border.
* Error: human-readable, actionable, no stack trace. Current `ErrorState` with `ShieldAlert` + retry.
* Loading: `Skeleton` shimmer + `LoadingBlock` 3-col grid. Use throughout.

## Accessibility

Target WCAG AA: keyboard nav (sidebar links, tab buttons have `data-testid` + focus), visible focus via `ring`, contrast from HSL tokens, semantic HTML (aside/nav/main/header), no color-only indicators (chips have dot + text), touch target 44px (buttons `px-3.5 py-2.5`). Respect `prefers-reduced-motion` for `.animate-in` .

## Animation

Subtle only: drawer `transition-transform duration-300`, hover `transition`, loading shimmer. No bouncing/glow/parallax. Current `rise-in .45s` acceptable but should be disabled under reduced-motion.

## Component Architecture (Clean Code)

**Must not** keep entire product in `hukuk-pages.tsx` (currently 373 lines, but will grow; tech debt recorded). Target:

```
src/
  pages/
    dashboard/ DashboardPage.tsx
    cases/ CasesPage.tsx, CaseWorkspacePage.tsx
    clients/ ClientsPage.tsx
    documents/ DocumentsPage.tsx
    research/ ResearchPage.tsx
    precedents/ PrecedentPage.tsx
    legislation/ LegislationPage.tsx
    drafts/ DraftsPage.tsx
    calendar/ CalendarPage.tsx
    assistant/ AssistantPage.tsx
    archive/ ArchivePage.tsx
    settings/ SettingsPage.tsx
  components/
    layout/ HukukShell, PageHeader, Breadcrumb
    navigation/ Sidebar, NavLink
    cases/ CaseContextHeader, CaseTabs
    shared/ DataTable, StatusBadge, SourceBadge, FilterBar, SearchInput, EmptyState, ErrorState, LoadingState, ConfirmDialog
    ui/ (shadcn primitives)
```

Reusable: `PageHeader`, `Breadcrumb`, `DataTable`, `StatusBadge`, `SourceBadge`, `EmptyState`, `ErrorState`, `LoadingState`, `ConfirmDialog`, `CaseContextHeader`, `FilterBar`, `SearchInput`.

Extract only with clear responsibility; avoid premature abstraction.

## Design Tokens (documented in index.css)

* **Typography:** Manrope / Newsreader / DM Mono; scale eyebrow 10px, title serif 2-3.1rem, body 13-14px, mono 10px
* **Spacing:** `--spacing 0.25rem`, gap 3=12px, 4=16px, 5=20px
* **Radius:** `--radius 0.75rem`, sm -4px, md -2px, lg 0.75, xl +4px
* **Borders:** `214 24% 86%` light, `218 22% 27%` dark, computed `--*border` via `from h s calc(l + -8%)`
* **Shadows:** 2xs–2xl tokens (0.03–0.2 opacity)
* **Icons:** lucide-react 15-19px, stroke 1.8 vs 2.2 active
* **Badges:** `StatusChip` 10px bold rounded-full + dot; six states mapped to primary/accent/destructive
* **Buttons:** primary `bg-primary` + shadow, outline `border-border`, quiet `muted` — `px-3.5 py-2.5 text-xs font-extrabold`
* **Tables:** header `10px font-extrabold uppercase tracking .1em muted`, row hover `muted/.42`, border `border`
* **Nav:** active inset 3px primary, p-3-2.5, 13px-semibold
* **States:** loading shimmer, empty dashed, error destructive border

## UX Acceptance Checklist (per feature)

- [ ] Clear navigation + hierarchy
- [ ] Responsive (desktop/tablet/mobile)
- [ ] Keyboard usable
- [ ] Loading/empty/error states
- [ ] Accessible labels/contrast
- [ ] Professional consistency, not AI template

## Design Review Questions (pre-complete)

1. Is navigation obvious? 2. Primary action quickly findable? 3. Space wasted? 4. Tables where appropriate? 5. Enterprise feel vs AI demo? 6. Verified vs AI distinct? 7. Deadlines/hearings visible? 8. Typography for long use? 9. Consistency? 10. Mobile/tablet usable?

---

**Current compliance:** Shell + dashboard roughly professional and calm, but `hukuk-pages.tsx` monolith, tables rendered as card-like grids, search local not global, tabs minimal. No file violates Phase 0A “no UI redesign” rule; this doc sets foundation for incremental PDCA refactor (next: extract pages + DataTable + CaseContextHeader).
