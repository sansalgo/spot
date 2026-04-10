# @sansalgo/spot-player

Plays [Spot](https://github.com/sansalgo/spot) pixel animations in React. Frames are plain number arrays — no canvas, no heavy runtime.

## Install

```bash
npm install @sansalgo/spot-player
bun add @sansalgo/spot-player
```

## Usage

```tsx
import { SpotPlayer } from "@sansalgo/spot-player";

<SpotPlayer frames={frames} size={128} duration={120} />
```

Export frames directly from Spot and drop them in — the format is identical.

## Frame Format

A `Frame` is an array of active pixel indices in a 7×7 grid (row-major, 0–48):

```
 0  1  2  3  4  5  6
 7  8  9 10 11 12 13
14 15 16 17 18 19 20
21 22 23 24 25 26 27
28 29 30 31 32 33 34
35 36 37 38 39 40 41
42 43 44 45 46 47 48
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `frames` | `Frame[]` | — | Animation frames. |
| `size` | `number` | — | Width and height of the player in pixels. |
| `gap` | `boolean` | `true` | Gap between pixels. |
| `isPlaying` | `boolean` | `true` | Start/stop playback. |
| `duration` | `number` | `120` | Milliseconds per frame. |
| `repeatCount` | `number` | `-1` | Loops before stopping. `-1` = infinite. |
| `onComplete` | `() => void` | — | Called when `repeatCount` is reached. |

## Theming

```css
.player {
  --spot-on:  #111111;
  --spot-off: #e4e4e4;
  --spot-gap: 1px;
}
```

## License

MIT
