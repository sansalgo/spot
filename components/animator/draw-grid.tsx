"use client";

import { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

const COLS = 7;
const ROWS = 7;
const TOTAL = COLS * ROWS;

interface DrawGridProps {
  activeIndices: number[];
  onChange: (indices: number[]) => void;
}

export function DrawGrid({ activeIndices, onChange }: DrawGridProps) {
  const isDrawing = useRef(false);
  const drawMode = useRef<"add" | "remove">("add");
  const activeSet = useRef(new Set(activeIndices));

  useEffect(() => {
    activeSet.current = new Set(activeIndices);
  }, [activeIndices]);

  const commit = useCallback(
    (updated: Set<number>) => {
      onChange([...updated]);
    },
    [onChange]
  );

  const handleMouseDown = (i: number) => {
    isDrawing.current = true;
    const mode = activeSet.current.has(i) ? "remove" : "add";
    drawMode.current = mode;
    const next = new Set(activeSet.current);
    mode === "add" ? next.add(i) : next.delete(i);
    activeSet.current = next;
    commit(next);
  };

  const handleMouseEnter = (i: number) => {
    if (!isDrawing.current) return;
    const next = new Set(activeSet.current);
    drawMode.current === "add" ? next.add(i) : next.delete(i);
    activeSet.current = next;
    commit(next);
  };

  useEffect(() => {
    const up = () => { isDrawing.current = false; };
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, []);

  return (
    <div className="grid grid-cols-7 gap-0.5 select-none cursor-crosshair w-full">
      {Array.from({ length: TOTAL }).map((_, i) => (
        <div
          key={i}
          onMouseDown={() => handleMouseDown(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          className={cn(
            "aspect-square border border-border transition-colors duration-75",
            activeIndices.includes(i)
              ? "bg-foreground"
              : "bg-muted hover:bg-muted-foreground/20"
          )}
        />
      ))}
    </div>
  );
}
