import * as react_jsx_runtime from 'react/jsx-runtime';

/** An array of active pixel indices (0–48) representing one animation frame. */
type Frame = number[];
interface SpotPlayerProps {
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
declare function SpotPlayer({ frames, gap, isPlaying, duration, repeatCount, onComplete, className, style, }: SpotPlayerProps): react_jsx_runtime.JSX.Element;

export { type Frame, SpotPlayer, type SpotPlayerProps };
