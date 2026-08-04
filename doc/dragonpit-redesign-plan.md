# Dragonpit Redesign Plan
**Branch:** `feature/dragonpit-redesign`

## Current Frontend Structure (Audit)
- `layout.tsx`: Inter + Outfit fonts, Navbar + Footer + InteractiveBackground
- `page.tsx`: 1,298-line monolith — all sections + all Firestore fetching inline
- `globals.css`: Tailwind v4, glass-card utility, scrollbar, fadeInUp
- Color: indigo/purple/pink throughout → REPLACE with Dragonpit tokens

## Firebase Contracts (Preserved)
- `config/about`: name, role, title, subtitle, heroPhrases[], bio, secondaryBio, avatarUrl, resumeUrl, isAvailable, availabilityStatus, social links
- `projects`: id, title, description, longDescription, techStack[], imageUrl, githubUrl, liveUrl, featured, visibility, order
- `blogs`: id, title, summary, slug, imageUrl, publishedAt, createdAt, published
- `competitions`: id, title, award, date, description, imageUrl, imageUrl2, link, order
- `thoughts`: id, content, category, date, likes, dislikes (votes via localStorage + Firestore increment)
- `skills`: id, name, iconUrl, category, level, visible, order
- `messages`: write-only from public (name, email, subject, message)

## Files to Modify
- `frontend/src/app/layout.tsx` - fonts, metadata, swap components
- `frontend/src/app/globals.css` - Dragonpit CSS variables + utilities
- `frontend/src/app/page.tsx` - new visual layer, preserve all data logic
- `frontend/src/components/Navbar.tsx` - DragonpitNavbar
- `frontend/src/components/Footer.tsx` - DragonpitFooter
- `frontend/src/components/InteractiveBackground.tsx` - EmberField

## Files to Create
- `frontend/src/components/dragonpit/DragonpitLoader.tsx`
- `frontend/src/components/dragonpit/DragonpitLoader.module.css`
- `frontend/src/components/dragonpit/DragonSigil.tsx`
- `frontend/src/components/dragonpit/DragonpitSectionHeader.tsx`
- `frontend/src/components/sections/AboutSection.tsx`
- `frontend/src/components/sections/SkillsSection.tsx`
- `frontend/src/components/sections/ProjectsSection.tsx`
- `frontend/src/components/sections/CompetitionsSection.tsx`
- `frontend/src/components/sections/BlogSection.tsx`
- `frontend/src/components/sections/ThoughtsSection.tsx`
- `frontend/src/components/sections/ContactSection.tsx`
- `frontend/public/dragonpit/sigil-three-headed-red.svg`
- `frontend/public/dragonpit/favicon-dragonpit.svg`
- `frontend/public/dragonpit/README.md`
- `doc/dragonpit-asset-manifest.md`
