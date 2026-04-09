import { create } from "zustand";
import type { Frame, Sequence, GridConfig, AnimationConfig } from "@/types/animator";

const makeId = () => Math.random().toString(36).slice(2, 9);
const emptyFrame = (): Frame => [];

interface AnimatorState {
  // Grid settings
  grid: GridConfig;
  setGridSize: (size: number) => void;
  setGridGap: (gap: boolean) => void;

  // Playback
  isPlaying: boolean;
  duration: number;
  setIsPlaying: (v: boolean) => void;
  togglePlay: () => void;
  setDuration: (ms: number) => void;

  // Sequences
  sequences: Sequence[];
  activeSeqIndex: number;

  // Sequence actions
  setActiveSeq: (index: number) => void;
  addSequence: () => void;
  deleteSequence: (index: number) => void;
  renameSequence: (index: number, name: string) => void;

  // Frame actions (always on active sequence)
  setActiveFrame: (frameIndex: number) => void;
  addFrame: () => void;
  duplicateFrame: () => void;
  deleteFrame: (frameIndex: number) => void;
  clearFrame: () => void;
  fillFrame: () => void;
  updateFrame: (indices: number[]) => void;

  // Export
  exportConfig: () => AnimationConfig;
  importConfig: (config: AnimationConfig) => void;
}

export const useAnimatorStore = create<AnimatorState>((set, get) => ({
  grid: { size: 7, gap: true },

  setGridSize: (size) =>
    set((s) => {
      const total = size * size;
      // Clamp existing frame indices when grid shrinks
      const clampFrame = (f: Frame) => f.filter((i) => i < total);
      return {
        grid: { ...s.grid, size },
        sequences: s.sequences.map((seq) => ({
          ...seq,
          frames: seq.frames.map(clampFrame),
        })),
      };
    }),

  setGridGap: (gap) => set((s) => ({ grid: { ...s.grid, gap } })),

  isPlaying: false,
  duration: 120,
  setIsPlaying: (v) => set({ isPlaying: v }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setDuration: (ms) => set({ duration: ms }),

  sequences: [
    { id: makeId(), name: "Seq 1", frames: [emptyFrame()], activeFrame: 0 },
  ],
  activeSeqIndex: 0,

  setActiveSeq: (index) => set({ activeSeqIndex: index }),

  addSequence: () =>
    set((s) => {
      const next = [
        ...s.sequences,
        {
          id: makeId(),
          name: `Seq ${s.sequences.length + 1}`,
          frames: [emptyFrame()],
          activeFrame: 0,
        },
      ];
      return { sequences: next, activeSeqIndex: next.length - 1 };
    }),

  deleteSequence: (index) =>
    set((s) => {
      if (s.sequences.length <= 1) return {};
      const next = s.sequences.filter((_, i) => i !== index);
      return {
        sequences: next,
        activeSeqIndex: Math.min(s.activeSeqIndex, next.length - 1),
      };
    }),

  renameSequence: (index, name) =>
    set((s) => {
      const sequences = [...s.sequences];
      sequences[index] = { ...sequences[index], name };
      return { sequences };
    }),

  setActiveFrame: (frameIndex) =>
    set((s) => {
      const sequences = [...s.sequences];
      sequences[s.activeSeqIndex] = {
        ...sequences[s.activeSeqIndex],
        activeFrame: frameIndex,
      };
      return { sequences };
    }),

  addFrame: () =>
    set((s) => {
      const seq = s.sequences[s.activeSeqIndex];
      const frames = [...seq.frames, emptyFrame()];
      const sequences = [...s.sequences];
      sequences[s.activeSeqIndex] = {
        ...seq,
        frames,
        activeFrame: frames.length - 1,
      };
      return { sequences };
    }),

  duplicateFrame: () =>
    set((s) => {
      const seq = s.sequences[s.activeSeqIndex];
      const frames = [...seq.frames];
      const copy = [...frames[seq.activeFrame]];
      frames.splice(seq.activeFrame + 1, 0, copy);
      const sequences = [...s.sequences];
      sequences[s.activeSeqIndex] = {
        ...seq,
        frames,
        activeFrame: seq.activeFrame + 1,
      };
      return { sequences };
    }),

  deleteFrame: (frameIndex) =>
    set((s) => {
      const seq = s.sequences[s.activeSeqIndex];
      if (seq.frames.length <= 1) {
        const sequences = [...s.sequences];
        sequences[s.activeSeqIndex] = {
          ...seq,
          frames: [emptyFrame()],
          activeFrame: 0,
        };
        return { sequences };
      }
      const frames = seq.frames.filter((_, i) => i !== frameIndex);
      const sequences = [...s.sequences];
      sequences[s.activeSeqIndex] = {
        ...seq,
        frames,
        activeFrame: Math.min(seq.activeFrame, frames.length - 1),
      };
      return { sequences };
    }),

  clearFrame: () =>
    set((s) => {
      const seq = s.sequences[s.activeSeqIndex];
      const frames = [...seq.frames];
      frames[seq.activeFrame] = emptyFrame();
      const sequences = [...s.sequences];
      sequences[s.activeSeqIndex] = { ...seq, frames };
      return { sequences };
    }),

  fillFrame: () =>
    set((s) => {
      const total = s.grid.size * s.grid.size;
      const seq = s.sequences[s.activeSeqIndex];
      const frames = [...seq.frames];
      frames[seq.activeFrame] = Array.from({ length: total }, (_, i) => i);
      const sequences = [...s.sequences];
      sequences[s.activeSeqIndex] = { ...seq, frames };
      return { sequences };
    }),

  updateFrame: (indices) =>
    set((s) => {
      const seq = s.sequences[s.activeSeqIndex];
      const frames = [...seq.frames];
      frames[seq.activeFrame] = indices;
      const sequences = [...s.sequences];
      sequences[s.activeSeqIndex] = { ...seq, frames };
      return { sequences };
    }),

  exportConfig: (): AnimationConfig => {
    const s = get();
    return {
      version: 1,
      grid: {
        cols: s.grid.size,
        rows: s.grid.size,
        gap: s.grid.gap,
      },
      duration: s.duration,
      sequences: s.sequences.map((seq) => ({
        id: seq.id,
        name: seq.name,
        frames: seq.frames,
      })),
    };
  },

  importConfig: (config) =>
    set(() => ({
      grid: { size: config.grid.cols, gap: config.grid.gap },
      duration: config.duration,
      sequences: config.sequences.map((seq) => ({
        ...seq,
        activeFrame: 0,
      })),
      activeSeqIndex: 0,
      isPlaying: false,
    })),
}));

// Derived selectors (cheap to call, no re-render unless result changes)
export const selectActiveSeq = (s: ReturnType<typeof useAnimatorStore.getState>) =>
  s.sequences[s.activeSeqIndex];

export const selectCurrentFrame = (s: ReturnType<typeof useAnimatorStore.getState>) => {
  const seq = s.sequences[s.activeSeqIndex];
  return seq?.frames[seq.activeFrame] ?? [];
};

// selectAllFrames intentionally omitted — flatMap creates a new reference every call.
// Use: const seqs = useAnimatorStore(s => s.sequences); useMemo(() => seqs.flatMap(...), [seqs])
