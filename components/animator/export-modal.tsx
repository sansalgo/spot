"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useAnimatorStore } from "@/store/animator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { AnimationConfig } from "@/types/animator";

function configToJsx(config: AnimationConfig): string {
  const allFrames = config.sequences.flatMap((s) => s.frames);
  const framesLiteral = `[${allFrames
    .map((f) => (f.length === 0 ? "[]" : `[${f.join(",")}]`))
    .join(", ")}]`;

  const lines = ["<SpotPlayer"];
  lines.push(`  frames={${framesLiteral}}`);
  lines.push(`  size={168}`);
  if (config.grid.gap) lines.push(`  gap`);
  if (config.duration !== 120) lines.push(`  duration={${config.duration}}`);
  lines.push("/>");
  return lines.join("\n");
}

export function ExportModal() {
  const exportConfig = useAnimatorStore((s) => s.exportConfig);
  const [copied, setCopied] = useState(false);

  const getOutput = () => configToJsx(exportConfig());

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getOutput());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2.5 text-[10px] font-mono gap-1"
        >
          <Copy size={11} />
          EXPORT
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm tracking-widest">
            SPOT PLAYER
          </DialogTitle>
        </DialogHeader>

        <pre className="bg-muted rounded-md p-3 text-[11px] font-mono overflow-auto max-h-72 leading-relaxed border border-border">
          {getOutput()}
        </pre>

        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-3 text-[10px] font-mono gap-1.5"
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? "COPIED!" : "COPY"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
