import { execSync } from "node:child_process";
import { rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { withBuiltLib } from "./buildSwap.js";

process.chdir(fileURLToPath(new URL("..", import.meta.url)));

await rm("dist", { recursive: true, force: true });
await rm("build", { recursive: true, force: true });

execSync("pnpm run generate", { stdio: "inherit" });
await import("./replace-openapi.js");

await withBuiltLib(async () => {
    execSync("tsc -p tsconfig.build.json", { stdio: "inherit" });
    await import("./bundle-browser.js");
});
