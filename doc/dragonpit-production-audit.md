# 🐉 The Dragonpit — Production Audit & Stabilization Plan

## Baseline Audit Overview
- **Repository**: `shashika-mora/shashika-mora`
- **Safety Branch**: `fix/dragonpit-production-audit` (branched from `feature/dragonpit-redesign`)
- **Frontend Framework**: Next.js App Router (`frontend/`)
- **Database & Auth**: Cloud Firestore + Firebase Authentication
- **Admin Interface**: `admin_panel/` (Separate Next.js application — UI/UX untouched)

---

## Audit Checklist & Fix Objectives

### 1. Data Credibility & Fallback Policies (Phase 1)
- Remove all fabricated fallback content (`DEFAULT_COMPETITIONS` with fake ranks, hardcoded demo blog articles).
- Implement explicit `LoadState = 'loading' | 'success' | 'empty' | 'error'` across all sections.
- Render honest empty states ("No records published yet.") and graceful error handlers when Firestore is empty or fails.

### 2. Publication & Visibility Filtering (Phase 2)
- Define strict `ProjectFetchMode = 'all' | 'featured' | 'published'`.
- Enforce public filtering:
  - Homepage: `getProjects('featured')` & `getBlogs(true)`.
  - `/projects`: `getProjects('published')` (hidden records excluded).
  - `/projects/[id]`: Refuse to render if `visibility === false`.
  - `/blog`: `getBlogs(true)`.
  - `/blog/[slug]`: Refuse to render if `published === false`.
  - Static export params: Filter strictly to published/visible items.

### 3. Permanent Hero & Session-based Loader (Phase 3 & 4)
- Extract reusable `DragonpitHero.tsx` with locked typography, non-shrinking 4.5rem title, Outfit heading font, and right profile photo frame.
- Fix `DragonpitLoader.tsx`:
  - Skip automatically if `sessionStorage.getItem('dragonpit-intro-seen')` is set.
  - Play intro once per session with `my_icon.png` centered medallion.
  - Idempotent `handleExit` with body scroll locking.

### 4. Navigation & Hamburger Fix (Phase 5)
- Remove inline `display: flex` on mobile menu button in `DragonpitNavbar.tsx` so desktop hides the hamburger button.
- Clean hash anchor navigation for `#about` and `#contact`.

### 5. Secondary Routes & Calmer UI/UX (Phase 6 & 7)
- Redesign secondary routes using the new dragon artwork (`caraxes_1.jpg`, `silverwing_1.jpg`, `sunfyre_1.jpg`, `meleys_1.jpg`, `dreamfyre.jpg`):
  - `/projects` & `/projects/[id]` (Caraxes)
  - `/academics` (Silverwing)
  - `/competitions` (Sunfyre)
  - `/thoughts` (Meleys)
  - `/blog` & `/blog/[slug]` (Dreamfyre)
- Update `MarkdownRenderer.tsx` with Dragonpit obsidian panels, gold links, and Outfit headings.
- Enforce responsive layout safety (`minmax(min(100%, 360px), 1fr)`) for 320px–1920px viewports.

### 6. Code Quality & Strict Validation (Phase 12)
- Remove `typescript: { ignoreBuildErrors: true }` from `next.config.mjs`.
- Provide TypeScript types for `Project`, `BlogPost`, `Competition`, `Thought`, `Skill`, `AcademicRecord`, `AboutConfig`, `LoadState`.
- Verify `npx tsc --noEmit` and `npm run build` succeed with **0 errors**.

---

## Preserved Architectural Constraints
- Firebase Firestore & Auth architecture remains 100% active.
- Admin panel (`admin_panel/`) UI and CRUD routes remain untouched.
- Thought voting & Contact form submission remain fully functional.
