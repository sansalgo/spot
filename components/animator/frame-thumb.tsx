"use client";

import { cn } from "@/lib/utils";
import type { Frame } from "@/types/animator";
import { XIcon } from "@phosphor-icons/react";

const COLS = 7;
const ROWS = 7;
const TOTAL = COLS * ROWS;

interface FrameThumbProps {
  frame: Frame;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export function FrameThumb({ frame, index, isActive, onClick, onDelete }: FrameThumbProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative p-1.5 cursor-pointer transition-all duration-150 border select-none",
        isActive
          ? "border-foreground/60 bg-transparent"
          : "border-border/40 bg-transparent hover:border-border/70"
      )}
    >
      <div className="text-[9px] text-muted-foreground font-mono mb-1">
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Mini pixel preview */}
      <div className="grid grid-cols-7 gap-px w-full bg-background">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "aspect-square",
              frame.includes(i) ? "bg-foreground" : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-0.5 right-0.5 w-5 h-5 flex items-center justify-center rounded-[3px] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        title="Remove frame · Del"
      >
        <XIcon size={12} />
      </button>
    </div>
  );
}
