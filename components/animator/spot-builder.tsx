"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { selectActiveSeq, selectCurrentFrame, useAnimatorStore } from "@/store/animator";
import { CopyIcon, PlusSquareIcon, StackIcon, TrashIcon } from "@phosphor-icons/react";
import React, { useEffect } from "react";
import { DrawGrid } from "./draw-grid";
import { ExportModal } from "./export-modal";
import { FrameStrip } from "./frame-strip";
import { SequenceList } from "./sequence-list";
import { SpotPlayer } from "./spot-player";
import { Toolbar } from "./toolbar";

export function SpotBuilder() {
  const isPlaying = useAnimatorStore((s) => s.isPlaying);
  const duration = useAnimatorStore((s) => s.duration);
  const updateFrame = useAnimatorStore((s) => s.updateFrame);
  const addFrame = useAnimatorStore((s) => s.addFrame);
  const duplicateFrame = useAnimatorStore((s) => s.duplicateFrame);
  const clearFrame = useAnimatorStore((s) => s.clearFrame);
  const fillFrame = useAnimatorStore((s) => s.fillFrame);
  const seq = useAnimatorStore(selectActiveSeq);
  const currentFrame = useAnimatorStore(selectCurrentFrame);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const { togglePlay, addFrame, duplicateFrame, clearFrame, deleteFrame, addSequence, sequences, activeSeqIndex } =
        useAnimatorStore.getState();
      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "n":
        case "N":
          if (e.shiftKey) addSequence();
          else addFrame();
          break;
        case "d":
        case "D":
          if (!e.shiftKey && !e.ctrlKey && !e.metaKey) duplicateFrame();
          break;
        case "c":
        case "C":
          if (!e.shiftKey && !e.ctrlKey && !e.metaKey) clearFrame();
          break;
        case "Delete":
        case "Backspace": {
          const active = sequences[activeSeqIndex];
          if (active) deleteFrame(active.activeFrame);
          break;
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  if (!seq) return null;

  const frameActions = [
    {
      label: "CLEAR",
      action: clearFrame,
      icon: <TrashIcon size={16} />,
      tip: "Clear frame · C",
    },
    {
      label: "FILL",
      action: fillFrame,
      icon: <StackIcon size={16} />,
      tip: "Fill all pixels",
    },
    {
      label: "FRAME",
      action: addFrame,
      icon: <PlusSquareIcon size={16} />,
      tip: "Add frame · N",
    },
    {
      label: "DUPE",
      action: duplicateFrame,
      icon: <CopyIcon size={16} />,
      tip: "Duplicate frame · D",
    },
  ] as Array<{
    label: string
    action: () => void
    icon: React.ReactNode
    tip: string
  }>

  return (
    <div className="h-screen flex flex-col font-mono bg-background text-foreground overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Toolbar />
        </div>
        <div className="pr-3 border-b border-border py-2">
          <ExportModal />
        </div>
      </div>

      {/* ── Three-panel layout ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Sequence list */}
        <SequenceList />

        {/* Center: Drawing area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-5">
          {/* Action buttons above grid */}
          <div className="flex items-center justify-between gap-1 w-full max-w-xs">
            {frameActions.map((btn) => (
              <Tooltip key={btn.label}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={btn.action}
                    className="h-8 px-2.5 text-[10px] font-mono gap-1.5"
                  >
                    {btn.icon}
                    {btn.label}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-[10px]">
                  {btn.tip}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Draw canvas */}
          <div className="border border-border p-4 w-full max-w-xs">
            <DrawGrid
              activeIndices={currentFrame}
              onChange={updateFrame}
            />
          </div>

          {/* Frame info */}
          <div className="text-[10px] text-muted-foreground tracking-widest">
            FRAME {seq.activeFrame + 1} / {seq.frames.length} · {currentFrame.length} px ON
          </div>

          {/* Live preview */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-[9px] text-muted-foreground tracking-widest">LIVE PREVIEW</div>
            <div className="border border-border p-2.5 w-20">
              <SpotPlayer
                frames={seq.frames.length > 0 ? seq.frames : [[]]}
                gap
                isPlaying={isPlaying}
                duration={duration}
              />
            </div>
          </div>
        </div>

        {/* Right: Frame strip */}
        <FrameStrip />
      </div>
    </div>
  );
}
