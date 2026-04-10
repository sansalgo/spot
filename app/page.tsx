"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { SpotPlayer } from "@/components/animator/spot-player";
import { cn } from "@/lib/utils";

// Concentric squares expanding outward then contracting
const DEMO_FRAMES = [
  [24],
  [16, 17, 18, 23, 25, 30, 31, 32],
  [8, 9, 10, 11, 12, 15, 19, 22, 26, 29, 33, 36, 37, 38, 39, 40],
  [0, 1, 2, 3, 4, 5, 6, 7, 13, 14, 20, 21, 27, 28, 34, 35, 41, 42, 43, 44, 45, 46, 47, 48],
  [8, 9, 10, 11, 12, 15, 19, 22, 26, 29, 33, 36, 37, 38, 39, 40],
  [16, 17, 18, 23, 25, 30, 31, 32],
];

const PKG_MANAGERS = [
  { id: "pnpm", cmd: "pnpm add @sansalgo/spot-player" },
  { id: "npm",  cmd: "npm install @sansalgo/spot-player" },
  { id: "yarn", cmd: "yarn add @sansalgo/spot-player" },
  { id: "bun",  cmd: "bun add @sansalgo/spot-player" },
] as const;

type PM = (typeof PKG_MANAGERS)[number]["id"];

export default function Home() {
  const [pm, setPm] = useState<PM>("pnpm");
  const activeCmd = PKG_MANAGERS.find((p) => p.id === pm)!.cmd;

  return (
    <div className="h-screen flex flex-col overflow-hidden font-mono bg-background text-foreground">

      {/* ── Header ── */}
      <header className="h-12 px-4 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="grid grid-cols-4 gap-0.5 w-5">
            {[1,1,1,0, 1,0,1,1, 0,1,1,1, 1,1,0,0].map((v, i) => (
              <div key={i} className={`w-1 h-1 rounded-[0.5px] ${v ? "bg-foreground" : "bg-muted"}`} />
            ))}
          </div>
          <span className="text-[13px] font-semibold tracking-[0.05em]">SPOT</span>
          <span className="text-[10px] text-muted-foreground tracking-widest hidden sm:block">
            PIXEL ANIMATOR
          </span>
        </div>
        <Link
          href="/animator"
          className="flex items-center gap-1.5 text-[11px] tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          ANIMATOR <ArrowRightIcon size={12} />
        </Link>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 grid grid-cols-2 overflow-hidden">

        {/* Left — copy + install */}
        <div className="flex flex-col justify-center px-14 gap-10 border-r border-border overflow-hidden">

          {/* Hero */}
          <div className="flex flex-col gap-3">
            <div className="text-[10px] text-muted-foreground tracking-widest">SPOT PLAYER</div>
            <h1 className="text-2xl font-semibold leading-snug tracking-tight">
              Pixel animations<br />for React.
            </h1>
            <p className="text-[12px] text-muted-foreground leading-relaxed max-w-70">
              Build animations in the Spot editor. Export frames and embed them anywhere — no canvas, no heavy runtime.
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/animator"
            className="flex items-center gap-2 w-fit px-4 py-2 border border-border text-[11px] tracking-widest hover:bg-muted transition-colors"
          >
            OPEN ANIMATOR <ArrowRightIcon size={12} />
          </Link>

          {/* Install */}
          <div className="flex flex-col gap-3">
            <div className="text-[10px] text-muted-foreground tracking-widest">INSTALL</div>
            <div className="flex border border-border w-fit">
              {PKG_MANAGERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPm(p.id)}
                  className={cn(
                    "px-3 py-1.5 text-[10px] tracking-widest transition-colors",
                    pm === p.id
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {p.id}
                </button>
              ))}
            </div>
            <div className="px-3 py-2 bg-muted border border-border text-[11px] tracking-wide">
              {activeCmd}
            </div>
          </div>
        </div>

        {/* Right — live demo */}
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="text-[9px] text-muted-foreground tracking-widest">LIVE PREVIEW</div>
          <div className="border border-border p-5 w-52">
            <SpotPlayer frames={DEMO_FRAMES} size={168} isPlaying duration={220} />
          </div>
          <div className="text-[9px] text-muted-foreground tracking-widest">
            @sansalgo/spot-player
          </div>
        </div>

      </main>
    </div>
  );
}
