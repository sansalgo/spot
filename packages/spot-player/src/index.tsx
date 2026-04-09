import { useCallback, useEffect, useRef } from "react";

/** An array of active pixel indices (0–48) representing one animation frame. */
export type Frame = number[];

export interface SpotPlayerProps {
  /** Animation frames — each frame is an array of active pixel indices (0–48). */
  frames: Frame[];
  /** Render a gap between pixels. Default: true. */
  gap?: boolean;
  /** Play the animation automatically. Default: true. */
  isPlaying?: boolean;
  /** Milliseconds per frame. Default: 120. */
  duration?: number;
  /** Full loops before stopping. -1 = infinite. Default: -1. */
  repeatCount?: number;
  /** Called when repeatCount is reached. */
  onComplete?: () => void;
  /**
   * CSS class for sizing — e.g. set width/height here.
   * The grid always fills its container and keeps a 1:1 aspect ratio.
   *
   * @example
   * // Inline size
   * <SpotPlayer frames={...} style={{ width: 64 }} />
   *
   * // Tailwind
   * <SpotPlayer frames={...} className="w-16" />
   */
  className?: string;
  style?: React.CSSProperties;
}

const TOTAL = 49; // 7 × 7

export function SpotPlayer({
  frames,
  gap = true,
  isPlaying = true,
  duration = 120,
  repeatCount = -1,
  onComplete,
  className,
  style,
}: SpotPlayerProps) {
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

  const rootClass = [
    "spot-player",
    gap ? "spot-player--gap" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={gridRef} className={rootClass} style={style}>
      {Array.from({ length: TOTAL }).map((_, i) => (
        <div key={i} className="spot-pixel" />
      ))}
    </div>
  );
}
