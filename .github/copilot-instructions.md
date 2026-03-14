# OCA-EU PWA – Copilot Instructions

## Project Overview
Progressive Web App for OCA-EU, an international cultural association with country branches (France, Belgium, UK, Finland, Italy, etc.).

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: GSAP (GreenSock)
- **PWA**: next-pwa
- **Icons**: Lucide React

## Architecture Principles
- Server Components by default; Client Components only for animations/interactivity
- Feature-based folder structure under `/features`
- Shared UI components under `/components/ui`
- Branch data driven by `/data/branches.ts` config file
- New branches added by extending the branches config — no routing changes needed

## Folder Structure
```
/app                    → Next.js App Router pages & layouts
/components             → Shared, reusable UI components
  /ui                   → Primitive UI (Button, Card, Badge, etc.)
  /layout               → Layout components (Navbar, Footer, Sidebar)
  /sections             → Page section components (Hero, Features, etc.)
/features               → Feature modules
  /branches             → Branch listing & detail components
  /members              → Member cards & grid
  /events               → Event cards & listing
  /gallery              → Gallery grid component
/lib                    → Utilities, helpers, constants
/data                   → Static data (branches, members, events)
/hooks                  → Custom React hooks
/animations             → GSAP animation helpers & presets
/public                 → Static assets, icons, PWA manifest
```

## Branch System
- Each branch is defined in `/data/branches.ts` as a `Branch` object
- Dynamic routes auto-generated via `/app/branches/[slug]/page.tsx`
- Adding a new branch = adding an entry to the branches array

## Coding Conventions
- Use `'use client'` only when hooks, GSAP or browser APIs are needed
- Prefer named exports for components
- Use `cn()` utility from `/lib/utils.ts` for conditional class names
- All animations live in `/animations/` and are imported into client components
- Types defined in `/lib/types.ts`
