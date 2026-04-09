"use client";

import { useAnimatorStore } from "@/store/animator";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const GRID_SIZES = [5, 7, 8, 10, 12, 16, 20, 24, 32];

export function GridSettings() {
  const grid = useAnimatorStore((s) => s.grid);
  const setGridSize = useAnimatorStore((s) => s.setGridSize);
  const setGridGap = useAnimatorStore((s) => s.setGridGap);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Label className="text-[10px] text-white/35 tracking-widest font-mono">GRID</Label>
        <Select
          value={String(grid.size)}
          onValueChange={(v) => setGridSize(Number(v))}
        >
          <SelectTrigger className="h-7 w-[80px] text-[11px] bg-white/[0.04] border-white/[0.1] text-white/70 font-mono focus:ring-0 focus:ring-offset-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#0d0d14] border-white/10 text-white/70 font-mono">
            {GRID_SIZES.map((s) => (
              <SelectItem key={s} value={String(s)} className="text-[11px] focus:bg-white/10 focus:text-white">
                {s}×{s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Label className="text-[10px] text-white/35 tracking-widest font-mono">GAP</Label>
        <Switch
          checked={grid.gap}
          onCheckedChange={setGridGap}
          className="data-[state=checked]:bg-indigo-500 scale-75"
        />
      </div>
    </div>
  );
}
