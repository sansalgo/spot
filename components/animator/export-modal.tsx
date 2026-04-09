"use client";

import { useState } from "react";
import { Download, Copy, Check, Upload } from "lucide-react";
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

export function ExportModal() {
  const exportConfig = useAnimatorStore((s) => s.exportConfig);
  const importConfig = useAnimatorStore((s) => s.importConfig);
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [tab, setTab] = useState<"export" | "import">("export");
  const [importText, setImportText] = useState("");

  const getJson = () => JSON.stringify(exportConfig(), null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getJson());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([getJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spot-animation.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    setImportError(null);
    try {
      const parsed = JSON.parse(importText) as AnimationConfig;
      if (parsed.version !== 1) throw new Error("Unknown config version");
      if (!parsed.grid?.cols || !parsed.grid?.rows) throw new Error("Missing grid dimensions");
      if (!Array.isArray(parsed.sequences)) throw new Error("Missing sequences");
      importConfig(parsed);
      setImportText("");
      setTab("export");
    } catch (e) {
      setImportError(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2.5 text-[10px] font-mono gap-1"
        >
          <Download size={11} />
          EXPORT
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm tracking-widest">
            ANIMATION CONFIG
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border pb-2">
          {(["export", "import"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-[10px] font-mono tracking-widest px-3 py-1 rounded-sm transition-colors ${
                tab === t
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {tab === "export" && (
          <>
            <pre className="bg-muted rounded-md p-3 text-[11px] font-mono overflow-auto max-h-72 leading-relaxed border border-border">
              {getJson()}
            </pre>
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 px-3 text-[10px] font-mono gap-1.5"
              >
                {copied ? <Check size={11} /> : <Copy size={11} />}
                {copied ? "COPIED!" : "COPY JSON"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="h-7 px-3 text-[10px] font-mono gap-1.5"
              >
                <Download size={11} />
                DOWNLOAD
              </Button>
            </div>
          </>
        )}

        {tab === "import" && (
          <>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste animation config JSON here..."
              className="bg-muted rounded-md p-3 text-[11px] font-mono w-full h-48 resize-none border border-border outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
            />
            {importError && (
              <p className="text-[10px] text-destructive font-mono">{importError}</p>
            )}
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleImport}
                disabled={!importText.trim()}
                className="h-7 px-3 text-[10px] font-mono gap-1.5"
              >
                <Upload size={11} />
                LOAD CONFIG
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
