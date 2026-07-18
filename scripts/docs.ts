import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { withBuiltLib } from "./buildSwap.js";

process.chdir(fileURLToPath(new URL("..", import.meta.url)));

execSync("pnpm run generate", { stdio: "inherit" });
await import("./replace-openapi.js");

await withBuiltLib(async () => {
    execSync("typedoc --options typedoc/typedoc.json", { stdio: "inherit" });
}, { keepBuildOnSuccess: true });
