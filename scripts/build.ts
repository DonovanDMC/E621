import { execSync } from "node:child_process";
import { rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { withBuiltLib } from "./buildSwap.js";

process.chdir(fileURLToPath(new URL("..", import.meta.url)));

await rm("dist", { recursive: true, force: true });
await rm("build", { recursive: true, force: true });

execSync("pnpm run generate", { stdio: "inherit" });
// Run as a subprocess, not `await import(...)` - replace-openapi.ts imports lib/generated/source.json,
// and importing it in-process would keep it (and thus the whole lib/ dir) open for the rest of this
// process's lifetime. On Windows that prevents withBuiltLib's rename(lib, ...) below from succeeding.
execSync("tsx scripts/replace-openapi.ts", { stdio: "inherit" });

await withBuiltLib(async () => {
    execSync("tsc -p tsconfig.build.json", { stdio: "inherit" });
    await import("./bundle-browser.js");
});
