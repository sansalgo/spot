export type Frame = number[];

export interface Sequence {
  id: string;
  name: string;
  frames: Frame[];
  activeFrame: number;
}

export interface GridConfig {
  size: number; // e.g. 7, 16, 32 — always square
  gap: boolean; // whether to show gap between pixels
}

// The portable config format for export/import
export interface AnimationConfig {
  version: 1;
  grid: {
    cols: number;
    rows: number;
    gap: boolean;
  };
  duration: number; // ms per frame
  sequences: {
    id: string;
    name: string;
    frames: Frame[];
  }[];
}
