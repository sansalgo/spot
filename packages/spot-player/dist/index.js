"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var index_exports = {};
__export(index_exports, {
  SpotPlayer: () => SpotPlayer
});
module.exports = __toCommonJS(index_exports);
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
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
  const gridRef = (0, import_react.useRef)(null);
  const currentIndex = (0, import_react.useRef)(0);
  const repeats = (0, import_react.useRef)(0);
  const intervalRef = (0, import_react.useRef)(null);
  const applyFrame = (0, import_react.useCallback)(
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
  (0, import_react.useEffect)(() => {
    currentIndex.current = 0;
    repeats.current = 0;
  }, [frames]);
  (0, import_react.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: gridRef, className: rootClass, style: { width: size, height: size }, children: Array.from({ length: TOTAL }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spot-pixel" }, i)) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SpotPlayer
});
