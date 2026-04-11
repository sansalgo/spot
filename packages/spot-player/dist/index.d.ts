import * as react_jsx_runtime from 'react/jsx-runtime';

/** An array of active pixel indices (0–48) representing one animation frame. */
type Frame = number[];
interface SpotPlayerProps {
    /** Animation frames — each frame is an array of active pixel indices (0–48). */
    frames: Frame[];
    /** Width and height of the player in pixels. */
    size: number;
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
}
declare function SpotPlayer({ frames, size, gap, isPlaying, duration, repeatCount, onComplete, }: SpotPlayerProps): react_jsx_runtime.JSX.Element;

export { type Frame, SpotPlayer, type SpotPlayerProps };
