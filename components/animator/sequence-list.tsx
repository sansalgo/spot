"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAnimatorStore } from "@/store/animator";
import { CheckIcon, PencilSimpleIcon, XIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { SpotPlayer } from "./spot-player";

export function SequenceList() {
  const sequences = useAnimatorStore((s) => s.sequences);
  const activeSeqIndex = useAnimatorStore((s) => s.activeSeqIndex);
  const isPlaying = useAnimatorStore((s) => s.isPlaying);
  const duration = useAnimatorStore((s) => s.duration);
  const setActiveSeq = useAnimatorStore((s) => s.setActiveSeq);
  const addSequence = useAnimatorStore((s) => s.addSequence);
  const deleteSequence = useAnimatorStore((s) => s.deleteSequence);
  const renameSequence = useAnimatorStore((s) => s.renameSequence);
  const allFrames = useMemo(() => sequences.flatMap((s) => s.frames), [sequences]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const startRename = (index: number, name: string) => {
    setEditingIndex(index);
    setEditingName(name);
  };

  const commitRename = (index: number) => {
    if (editingName.trim()) renameSequence(index, editingName.trim());
    setEditingIndex(null);
  };

  return (
    <div className="w-64 border-r border-border flex flex-col overflow-hidden">
      <div className="px-3 pt-3 text-[9px] text-muted-foreground tracking-widest shrink-0">
        SEQUENCES
      </div>

      <ScrollArea className="flex-1 min-h-0 px-3 py-1.5 [&_[data-radix-scroll-area-viewport]>:first-child]:block!">
        <div className="flex flex-col gap-1.5 pb-1">
          {sequences.map((seq, si) => (
            <div
              key={seq.id}
              onClick={() => setActiveSeq(si)}
              className={cn(
                "px-2.5 py-2 cursor-pointer flex justify-between items-center transition-all duration-150 border",
                activeSeqIndex === si
                  ? "bg-accent border-border"
                  : "bg-transparent border-border/40 hover:bg-accent/50",
              )}
            >
              <div className="flex-1 min-w-0 overflow-hidden">
                {editingIndex === si ? (
                  <input
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => commitRename(si)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitRename(si)
                      if (e.key === "Escape") setEditingIndex(null)
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full bg-transparent text-[11px] text-foreground outline-none border-b border-border"
                  />
                ) : (
                  <div className="text-[11px] truncate text-foreground">
                    {seq.name}
                  </div>
                )}
                <div className="text-[9px] text-muted-foreground mt-0.5">
                  {seq.frames.length}f
                </div>
              </div>

              <div className="flex items-center gap-1 ml-2 shrink-0">
                {editingIndex === si ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      commitRename(si)
                    }}
                    className="text-foreground hover:text-foreground/70 transition-colors"
                  >
                    <CheckIcon size={14} />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      startRename(si, seq.name)
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <PencilSimpleIcon size={14} />
                  </button>
                )}
                {sequences.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteSequence(si)
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <XIcon size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}

          <Button
            onClick={addSequence}
            variant="ghost"
            size="sm"
            className="mt-1 w-full text-[11px] border border-dashed border-border font-mono gap-1"
            title="Add sequence · Shift+N"
          >
            + ADD SEQ
          </Button>
        </div>
      </ScrollArea>

      {/* Preview all sequences */}
      <div className="p-3 border-t border-border shrink-0">
        <div className="text-[9px] text-muted-foreground tracking-widest mb-2">
          PREVIEW ALL
        </div>
        <SpotPlayer
          frames={allFrames.length > 0 ? allFrames : [[]]}
          gap
          isPlaying={isPlaying}
          duration={duration}
        />
      </div>
    </div>
  )
}
