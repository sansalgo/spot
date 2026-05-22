"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, CopyIcon, CheckIcon } from "@phosphor-icons/react";
import { SpotPlayer } from "@/components/animator/spot-player";
import { cn } from "@/lib/utils";

// Phase 1: diamond expands outward (Manhattan distance rings from center)
// Phase 2: outer square ring → X → plus → diagonal slashes
// Phase 3: contracts back through diamond rings to center, then empty pause
const DEMO_FRAMES = [
  [24],
  [17, 23, 25, 31],
  [10, 16, 18, 22, 26, 30, 32, 38],
  [3, 9, 11, 15, 19, 21, 27, 29, 33, 37, 39, 45],
  [0,1,2,3,4,5,6,7,13,14,20,21,27,28,34,35,41,42,43,44,45,46,47,48],
  [0,6,8,12,16,18,24,30,32,36,40,42,48],
  [3,10,17,21,22,23,24,25,26,27,31,38,45],
  [0,1,7,8,9,15,16,17,23,24,25,31,32,33,39,40,41,47,48],
  [5,6,11,12,13,17,18,19,23,24,25,29,30,31,35,36,37,42,43],
  [3, 9, 11, 15, 19, 21, 27, 29, 33, 37, 39, 45],
  [10, 16, 18, 22, 26, 30, 32, 38],
  [17, 23, 25, 31],
  [24],
  [],
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
  const [copied, setCopied] = useState(false);
  const activeCmd = PKG_MANAGERS.find((p) => p.id === pm)!.cmd;

  function copyCmd() {
    navigator.clipboard.writeText(activeCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden font-mono bg-background text-foreground">

      {/* ── Header ── */}
      <header className="h-12 px-4 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
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
          <div className="flex flex-col gap-3 w-80">
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
            <div className="flex items-center justify-between px-3 py-2 bg-muted border border-border">
              <span className="text-[11px] tracking-wide truncate">{activeCmd}</span>
              <button
                onClick={copyCmd}
                className="ml-3 shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Copy command"
              >
                {copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
              </button>
            </div>
          </div>
        </div>

        {/* Right — live demo */}
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="text-[9px] text-muted-foreground tracking-widest">LIVE PREVIEW</div>
          <div className="border border-border p-5 w-52">
            <SpotPlayer frames={DEMO_FRAMES} size={168} isPlaying duration={180} />
          </div>
          <div className="text-[9px] text-muted-foreground tracking-widest">
            @sansalgo/spot-player
          </div>
        </div>

      </main>
    </div>
  );
}
