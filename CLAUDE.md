# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
bun dev        # Start development server
bun build      # Production build
bun start      # Start production server
bun lint       # Run ESLint
```

This project uses **Bun** as the package manager (not npm/yarn).

## What This Is

**Spot** is a pixel animation editor — a Next.js App Router application with a three-panel layout:
- **Left** — Sequence list (`sequence-list.tsx`)
- **Center** — Drawing canvas + live preview (`draw-grid.tsx`, `spot-player.tsx`)
- **Right** — Frame thumbnail strip (`frame-strip.tsx`)

The main page is at `/animator`. The root `/` page is an unused Next.js placeholder.

## Architecture

### State Management
All application state lives in [store/animator.ts](store/animator.ts) (Zustand). There is **no server state** — everything is client-side. Key state shape:

- `sequences: Sequence[]` — list of named animation sequences
- `activeSeqId` — which sequence is being edited
- `gridConfig: GridConfig` — pixel grid size (5–32) and gap toggle
- `playback` — isPlaying, speed (ms/frame), currentFrameIndex

Selectors (`selectActiveSeq`, `selectCurrentFrame`) are exported for optimized re-renders. Actions mutate state directly via Zustand's `set`.

### Data Model
- **Frame** = `number[]` — indices of active (filled) pixels in the grid
- **Sequence** = `{ id, name, frames: Frame[], activeFrame: number }`
- **AnimationConfig** — portable export/import format with a `version` field

### Component Conventions
- All animator components are under [components/animator/](components/animator/)
- All components are `"use client"` — no RSC patterns in use
- UI primitives come from [components/ui/](components/ui/) (shadcn/ui on Radix + Tailwind v4)
- Use `cn()` from `@/lib/utils` for conditional Tailwind classes

### Tech Stack Versions (non-obvious)
- **Next.js 16.2.2** — breaking changes vs. older versions; check `node_modules/next/dist/docs/` before assuming API behavior
- **React 19.2.4**
- **Tailwind CSS v4** — PostCSS-based, uses CSS custom properties in oklch color space
- **Zustand 5.x** — API differs from v4
- **Radix UI 1.4.x**

### Icons
Primary: `@phosphor-icons/react`. Secondary: `lucide-react`. Prefer Phosphor for new UI.

### Styling Conventions
- Monospace font for all UI labels ("SPOT", "FRAME", "SPEED", etc.)
- Text sizes use arbitrary values: `text-[9px]`, `text-[10px]`, `text-[11px]`, `text-[13px]`
- Theme colors via CSS custom properties; light/dark via `next-themes`

### Export/Import
`exportConfig()` serializes full state to JSON (clipboard or download). `importConfig()` restores it. The `version: 1` field on `AnimationConfig` guards against breaking changes.
