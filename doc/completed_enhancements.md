# Log of Completed Enhancements

This document tracks all functional, visual, and architectural enhancements applied to the portfolio project, starting from the original baseline.

---

## 1. Database & Schema Enhancements

To support a dynamic, content-rich portfolio, the Firestore schemas were modernized:

*   **Projects**: Added `imageUrl` to support cover illustrations and `visibility` (boolean) to hide drafts.
*   **Blogs**: Added `imageUrl`, `readingTime` (e.g. `"4 min read"`), `featured` (to highlight posts), and `published` (boolean) to keep drafts private.
*   **Academics**: Added `imageUrl` (for school/university logos) and a `skills` string array (to specify technologies or competencies gained at each milestone).
*   **Profile/About Config**: Added `resumeUrl` (to download the CV), `availabilityStatus` (to control the active hiring badge), and `avatarUrl` (to customize the main profile photo).
*   **Skills with Icons**: Enhanced the `skills` array to support structured skills with custom icons, either as objects `{ name, iconUrl }` or name-pipe formats (`"React|https://..."`).
*   **Database Seeding**: Injected structured mock records across all collections using Firebase MCP tools to ensure the frontend renders full layouts immediately upon deployment.

---

## 2. Admin Panel Enhancements

The administration panel's capabilities were expanded to handle the new database models while keeping the UI clean and simple:

*   **Image Management**: Integrated input fields for image/logo URLs across Projects, Blogs, and Academics editors.
*   **Draft Switches**: Added toggle checkboxes for Project `visibility` and Blog `published` states.
*   **Profile Settings**: Added inputs for the Availability status badge, Resume PDF download link, and Profile Picture URL.
*   **Crash Resolution**: Resolved a critical crash (`ReferenceError: linkedinUrl is not defined`) by declaring the missing `linkedinUrl` state hooks and initializing them during document fetching.
*   **Biography Recovery**: Fixed a bug where saving the profile discarded the Detailed biography (`secondaryBio`) by whitelisting it in the update payload.
*   **Skills Manager Upgrade**: Replaced the simple text skill adder with an advanced form that accepts both the **Skill Name** and an optional **Icon URL** (such as Simple Icons assets). The admin panel dynamically renders these custom logos inside the active tags preview.

---

## 3. Frontend UI/UX Redesign & Animation Fixes

The user-facing site has been upgraded to deliver a premium, responsive, and reliable experience:

### 3.1 Hero Section Redesign
*   **Grid Layout**: Replaced the original centered text layout with a modern two-column grid. On desktop, the profile card sits on the right, and the text alignment is left-justified. On mobile devices, they stack cleanly with the profile photo on top.
*   **Cool Framed Image**: The profile picture is styled in a glassmorphic container with a rotating glowing gradient border (`indigo-500` to `pink-500`), retro tech corner tick marks, and a floating `"MORATUWA CSE"` badge that micro-bounces.
*   **Hover Interactions**: Added custom CSS filters to the image; it is slightly desaturated by default and transitions to full color while scaling up gently when hovered.
*   **Typography Balance**: Scaled down fonts across the system to look elegant and balanced (Hero section, headers, projects directory, academics timeline, and developer blog).

### 3.2 GSAP Animation Fixes (Element Disappearing Bug)
*   **Hydration Bug Fix**: In Next.js, elements sometimes disappeared or got stuck at `opacity: 0` during hydration or page navigation. This was caused by GSAP `.from` animations. When React re-rendered elements or StrictMode ran components twice, GSAP recorded the initial `opacity: 0` as the target value, locking the elements in a hidden state.
*   **Resolution**: Converted all Hero and Scroll Reveal triggers to use explicit `fromTo` animations. Added `clearProps: 'all'` to all tweens so that once the opening animation finishes, GSAP removes all inline style overrides, letting normal CSS styling and hovers operate normally.

### 3.3 Tech Arsenal Icons
*   **Icon Parsing**: Configured the Tech Stack section to parse incoming skills. If a skill has an icon URL, it displays the logo alongside the skill name inside the pill chip. If no icon is configured, it falls back to a text-only pill chip.

### 3.4 Contact Navigation Consolidation
*   **Consolidated Forms**: Removed the standalone `/contact` page directory and updated all navbar links and buttons to point to the home page's `#contact` anchor. This simplifies navigation, removes redundant pages, and scrolls the user down to the contact form.

---

## 4. HEIC Image Pipeline
*   **Format Conversion**: The raw HEIC image (`IMG_6814.HEIC`) was converted into a standard `hero.jpg` (JPEG) using a custom `heic-convert` Node pipeline to ensure compatibility across Chrome, Safari, Firefox, and mobile browsers.

---

## 5. Competitions & Achievements Integration
*   **Database Schema & Rules**: Added a new Firestore collection `competitions` and configured appropriate security rules in `firestore.rules` to allow read-access to guests and write-access to administrators.
*   **Admin Panel Manager**: Created a new page `admin_panel/src/app/competitions/page.tsx` displaying existing competitions in an interactive layout and providing forms for creating, editing, and deleting records. Added input fields for Primary and Secondary image URLs to showcase trophy/event and team photos.
*   **Sidebar Navigation**: Added a link to the Competitions page with a Trophy icon in `AdminSidebar.tsx`.
*   **Frontend Section**: Added a new section `Competitions & Achievements` on the main page layout, displaying a grid of competition wins. If multiple images are provided, it renders them in a two-column grid inside the card. Implemented skeleton loading with `CompetitionsSkeleton` and GSAP scroll animations.

