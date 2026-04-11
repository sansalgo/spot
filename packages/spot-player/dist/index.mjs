// src/index.tsx
import { useCallback, useEffect, useRef } from "react";
import { jsx } from "react/jsx-runtime";
var CSS = `
.spot-player {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  aspect-ratio: 1 / 1;
  gap: 0;
  box-sizing: border-box;
}
.spot-player--gap {
  gap: var(--spot-gap, 1px);
}
.spot-pixel {
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: var(--spot-off, #e4e4e4);
  transition: background-color 75ms linear;
}
.spot-pixel--on {
  background-color: var(--spot-on, #111111);
}
@media (prefers-color-scheme: dark) {
  .spot-pixel { background-color: var(--spot-off, #2a2a2a); }
  .spot-pixel--on { background-color: var(--spot-on, #f0f0f0); }
}
.dark .spot-pixel { background-color: var(--spot-off, #2a2a2a); }
.dark .spot-pixel--on { background-color: var(--spot-on, #f0f0f0); }
.light .spot-pixel { background-color: var(--spot-off, #e4e4e4); }
.light .spot-pixel--on { background-color: var(--spot-on, #111111); }
`;
var STYLE_ID = "spot-player-styles";
function injectStyle() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement("style");
  el.id = STYLE_ID;
  el.textContent = CSS;
  document.head.appendChild(el);
}
injectStyle();
var TOTAL = 49;
function SpotPlayer({
  frames,
  size,
  gap = true,
  isPlaying = true,
  duration = 120,
  repeatCount = -1,
  onComplete
}) {
  const gridRef = useRef(null);
  const currentIndex = useRef(0);
  const repeats = useRef(0);
  const intervalRef = useRef(null);
  const applyFrame = useCallback(
    (dots, frameIndex) => {
      const frame = frames[frameIndex];
      if (!frame) return;
      const active = new Set(frame);
      dots.forEach((dot, i) => {
        dot.classList.toggle("spot-pixel--on", active.has(i));
      });
    },
    [frames]
  );
  useEffect(() => {
    currentIndex.current = 0;
    repeats.current = 0;
  }, [frames]);
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (!isPlaying || frames.length === 0) return;
    if (currentIndex.current >= frames.length) currentIndex.current = 0;
    const dots = Array.from(el.children);
    applyFrame(dots, currentIndex.current);
    intervalRef.current = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % frames.length;
      applyFrame(dots, currentIndex.current);
      if (currentIndex.current === 0) {
        repeats.current += 1;
        if (repeatCount !== -1 && repeats.current >= repeatCount) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          onComplete == null ? void 0 : onComplete();
        }
      }
    }, duration);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [frames, isPlaying, applyFrame, duration, repeatCount, onComplete]);
  const rootClass = ["spot-player", gap ? "spot-player--gap" : ""].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsx("div", { ref: gridRef, className: rootClass, style: { width: size, height: size }, children: Array.from({ length: TOTAL }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "spot-pixel" }, i)) });
}
export {
  SpotPlayer
};
