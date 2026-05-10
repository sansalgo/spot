# Spot

Pixel animation editor — draw, sequence, and export frame-by-frame animations.

Built with Next.js, React 19, Zustand, and Tailwind CSS v4.

## Getting Started

```bash
bun dev
```

Open [http://localhost:3000/animator](http://localhost:3000/animator) to use the editor.

## Commands

```bash
bun dev      # Start development server
bun build    # Production build
bun start    # Start production server
bun lint     # Run ESLint
```

## How It Works

The editor has a three-panel layout:

- **Left** — Sequence list: create and switch between named animation sequences
- **Center** — Drawing canvas + live preview
- **Right** — Frame strip: add, reorder, and delete frames

All state is client-side (Zustand). Use **Export** to save your animation as JSON and **Import** to restore it.

## Packages

This repo also contains [`@sansalgo/spot-player`](packages/spot-player) — a lightweight React component for playing back Spot animations in any React app.

```bash
npm install @sansalgo/spot-player
```

## Tech Stack

- [Next.js 16](https://nextjs.org)
- [React 19](https://react.dev)
- [Zustand 5](https://zustand.docs.pmnd.rs)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com) + [shadcn/ui](https://ui.shadcn.com)
- [Phosphor Icons](https://phosphoricons.com)
- [Bun](https://bun.sh)
