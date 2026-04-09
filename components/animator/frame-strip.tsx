"use client";

import { useAnimatorStore, selectActiveSeq } from "@/store/animator";
import { FrameThumb } from "./frame-thumb";
import { ScrollArea } from "@/components/ui/scroll-area";

export function FrameStrip() {
  const seq = useAnimatorStore(selectActiveSeq);
  const setActiveFrame = useAnimatorStore((s) => s.setActiveFrame);
  const deleteFrame = useAnimatorStore((s) => s.deleteFrame);
  const sequences = useAnimatorStore((s) => s.sequences);
  const activeSeqIndex = useAnimatorStore((s) => s.activeSeqIndex);

  if (!seq) return null;

  return (
    <div className="w-64 border-l border-border flex flex-col overflow-hidden">
      <div className="px-3 pt-3 text-[9px] text-muted-foreground truncate tracking-widest shrink-0">
        FRAMES — {sequences[activeSeqIndex]?.name}
      </div>

      <ScrollArea className="flex-1 p-3 min-h-0">
        <div className="grid grid-cols-2 gap-1.5">
          {seq.frames.map((frame, fi) => (
            <FrameThumb
              key={fi}
              frame={frame}
              index={fi}
              isActive={seq.activeFrame === fi}
              onClick={() => setActiveFrame(fi)}
              onDelete={() => deleteFrame(fi)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
