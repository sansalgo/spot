import { copyFileSync, mkdirSync } from "fs";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.tsx"],
  format: ["esm", "cjs"],
  dts: true,
  external: ["react", "react-dom"],
  clean: true,
  onSuccess: async () => {
    mkdirSync("dist", { recursive: true });
    copyFileSync("src/index.css", "dist/index.css");
    console.log("Copied index.css → dist/index.css");
  },
});
