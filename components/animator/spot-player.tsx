"use client";

/**
 * SpotPlayer
 *
 * A self-contained, resizable 7×7 pixel animation player.
 * Scales like an SVG icon — set a width/height via className and
 * the grid fills the container proportionally.
 *
 * Usage:
 *   <SpotPlayer frames={[[0,1,2],[1,2,3]]} gap duration={120} />
 *
 * Props:
 *   frames      — array of frames; each frame is an array of active pixel indices (0–48)
 *   gap         — render a 1px gap between pixels (default true)
 *   isPlaying   — animate automatically (default true)
 *   duration    — ms per frame (default 120)
 *   repeatCount — how many full loops before stopping; -1 = infinite (default -1)
 *   onComplete  — called when repeatCount is reached
 *   className   — forwarded to the root element for sizing (e.g. "w-16 h-16")
 */

import { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { Frame } from "@/types/animator";

export interface SpotPlayerProps {
  frames: Frame[];
  /** Width and height of the player in pixels. */
  size: number;
  gap?: boolean;
  isPlaying?: boolean;
  duration?: number;
  repeatCount?: number;
  onComplete?: () => void;
}

export function SpotPlayer({
  frames,
  size,
  gap = true,
  isPlaying = true,
  duration = 120,
  repeatCount = -1,
  onComplete,
}: SpotPlayerProps) {
  const total = 7 * 7;
  const gridRef = useRef<HTMLDivElement>(null);
  const currentIndex = useRef(0);
  const repeats = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const applyFrame = useCallback(
    (dots: HTMLElement[], frameIndex: number) => {
      const frame = frames[frameIndex];
      if (!frame) return;
      const active = new Set(frame);
      dots.forEach((dot, i) => {
        dot.classList.toggle("bg-foreground", active.has(i));
        dot.classList.toggle("bg-muted", !active.has(i));
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
    const dots = Array.from(el.children) as HTMLElement[];

    applyFrame(dots, currentIndex.current);

    intervalRef.current = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % frames.length;
      applyFrame(dots, currentIndex.current);

      if (currentIndex.current === 0) {
        repeats.current += 1;
        if (repeatCount !== -1 && repeats.current >= repeatCount) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          onComplete?.();
        }
      }
    }, duration);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [frames, isPlaying, applyFrame, duration, repeatCount, onComplete]);

  return (
    <div
      ref={gridRef}
      className={cn("grid grid-cols-7", gap ? "gap-0.5" : "gap-0")}
      style={{ width: size, height: size }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="w-full aspect-square bg-muted transition-colors duration-75"
        />
      ))}
    </div>
  );
}
