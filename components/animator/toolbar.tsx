"use client";

import { Play, Square } from "lucide-react";
import { useAnimatorStore } from "@/store/animator";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

export function Toolbar() {
  const isPlaying = useAnimatorStore((s) => s.isPlaying);
  const duration = useAnimatorStore((s) => s.duration);
  const togglePlay = useAnimatorStore((s) => s.togglePlay);
  const setDuration = useAnimatorStore((s) => s.setDuration);

  return (
    <div className="px-4 py-2 border-b border-border flex items-center gap-4">
      {/* Logo */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="grid grid-cols-4 gap-0.5 w-5">
          {[1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0].map((v, i) => (
            <div
              key={i}
              className={`w-1 h-1 rounded-[0.5px] ${v ? "bg-foreground" : "bg-muted"}`}
            />
          ))}
        </div>
        <span className="text-[13px] font-semibold tracking-[0.05em] font-mono">
          SPOT
        </span>
        <span className="text-[10px] text-muted-foreground tracking-widest font-mono hidden sm:block">
          PIXEL ANIMATOR
        </span>
      </div>

      <Separator orientation="vertical" className="h-5" />

      {/* Speed + Play */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[10px] text-muted-foreground font-mono">SPEED</span>
        <Slider
          min={40}
          max={600}
          step={10}
          value={[duration]}
          onValueChange={([v]) => setDuration(v)}
          className="w-20"
        />
        <span className="text-[10px] text-muted-foreground font-mono w-10">{duration}ms</span>

        <Button
          onClick={togglePlay}
          size="sm"
          variant="outline"
          className="h-7 px-3 text-[11px] font-mono"
        >
          {isPlaying ? (
            <><Square size={10} className="mr-1" /> STOP</>
          ) : (
            <><Play size={10} className="mr-1" /> PLAY</>
          )}
        </Button>
      </div>
    </div>
  );
}
