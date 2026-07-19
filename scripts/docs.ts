import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { withBuiltLib } from "./buildSwap.js";

process.chdir(fileURLToPath(new URL("..", import.meta.url)));

execSync("pnpm run generate", { stdio: "inherit" });
// Run as a subprocess, not `await import(...)` - see the comment in build.ts for why.
execSync("tsx scripts/replace-openapi.ts", { stdio: "inherit" });

await withBuiltLib(async () => {
    execSync("typedoc --options typedoc/typedoc.json", { stdio: "inherit" });
}, { keepBuildOnSuccess: true });
