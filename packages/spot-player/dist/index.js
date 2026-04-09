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
  const rootClass = [
    "spot-player",
    gap ? "spot-player--gap" : "",
    className != null ? className : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: gridRef, className: rootClass, style, children: Array.from({ length: TOTAL }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "spot-pixel" }, i)) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SpotPlayer
});
