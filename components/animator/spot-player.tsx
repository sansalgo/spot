"use client";

/**
 * SpotPlayer
 *
 * A self-contained, resizable player that renders and animates a sequence of
 * pixel frames. Scales like an SVG icon — set width/height via className and
 * the grid fills the container proportionally.
 *
 * Can be driven either by:
 *  a) Raw `frames` + grid props (used internally by the builder)
 *  b) A full `AnimationConfig` object from an export (use the `config` prop)
 *
 * Usage with exported config:
 *   <SpotPlayer config={myAnimationConfig} />
 *
 * Usage with raw frames (builder-internal):
 *   <SpotPlayer frames={[[0,1,2],[1,2,3]]} cols={7} rows={7} gap isPlaying duration={120} />
 */

import { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { Frame, AnimationConfig } from "@/types/animator";

interface RawProps {
  config?: never;
  frames: Frame[];
  cols: number;
  rows: number;
  gap?: boolean;
  isPlaying?: boolean;
  duration?: number;
  repeatCount?: number;
  onComplete?: () => void;
  className?: string;
}

interface ConfigProps {
  config: AnimationConfig;
  frames?: never;
  cols?: never;
  rows?: never;
  gap?: boolean;
  isPlaying?: boolean;
  duration?: number;
  repeatCount?: number;
  onComplete?: () => void;
  className?: string;
}

type SpotPlayerProps = RawProps | ConfigProps;

export function SpotPlayer(props: SpotPlayerProps) {
  const resolved =
    props.config != null
      ? {
          frames: props.config.sequences.flatMap((s) => s.frames),
          gap: props.gap ?? props.config.grid.gap,
          isPlaying: props.isPlaying ?? true,
          duration: props.duration ?? props.config.duration,
          repeatCount: props.repeatCount ?? -1,
          onComplete: props.onComplete,
        }
      : {
          frames: props.frames,
          gap: props.gap ?? true,
          isPlaying: props.isPlaying ?? false,
          duration: props.duration ?? 120,
          repeatCount: props.repeatCount ?? -1,
          onComplete: props.onComplete,
        };

  const { frames, gap, isPlaying, duration, repeatCount, onComplete } = resolved;

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
      className={cn(
        "grid grid-cols-7 w-full aspect-square",
        gap ? "gap-0.5" : "gap-0",
        props.className
      )}
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
