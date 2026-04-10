"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAnimatorStore } from "@/store/animator";
import { PlayIcon, StopIcon } from "@phosphor-icons/react";

export function Toolbar() {
  const isPlaying = useAnimatorStore((s) => s.isPlaying);
  const duration = useAnimatorStore((s) => s.duration);
  const togglePlay = useAnimatorStore((s) => s.togglePlay);
  const setDuration = useAnimatorStore((s) => s.setDuration);

  return (
    <div className="h-12 px-4 border-b border-border flex items-center gap-4">
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

      <Separator orientation="vertical" />

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

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={togglePlay}
              size="sm"
              variant="outline"
              className="h-8 px-3 text-[11px] font-mono gap-1.5"
            >
              {isPlaying ? (
                <><StopIcon size={16} /> STOP</>
              ) : (
                <><PlayIcon size={16} /> PLAY</>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-[10px]">
            {isPlaying ? "Stop · Space" : "Play · Space"}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
