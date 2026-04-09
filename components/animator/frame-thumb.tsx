"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Frame } from "@/types/animator";

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
          ? "bg-accent border-border"
          : "bg-transparent border-border/40 hover:bg-accent/50"
      )}
    >
      <div className="text-[9px] text-muted-foreground font-mono mb-1">
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Mini pixel preview */}
      <div className="grid grid-cols-7 gap-px w-10.5">
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
        className="absolute top-0.5 right-0.5 w-3.5 h-3.5 flex items-center justify-center rounded-[3px] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        <X size={8} />
      </button>
    </div>
  );
}
