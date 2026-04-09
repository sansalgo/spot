// src/index.tsx
import { useCallback, useEffect, useRef } from "react";
import { jsx } from "react/jsx-runtime";
var TOTAL = 49;
function SpotPlayer({
  frames,
  gap = true,
  isPlaying = true,
  duration = 120,
  repeatCount = -1,
  onComplete,
  className,
  style
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
  const rootClass = [
    "spot-player",
    gap ? "spot-player--gap" : "",
    className != null ? className : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsx("div", { ref: gridRef, className: rootClass, style, children: Array.from({ length: TOTAL }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "spot-pixel" }, i)) });
}
export {
  SpotPlayer
};
