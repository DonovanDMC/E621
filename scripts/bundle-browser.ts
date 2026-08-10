import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { build } from "esbuild";

const entryPoint = fileURLToPath(new URL("../dist/lib/index.js", import.meta.url));
const outfile = fileURLToPath(new URL("../dist/browser/e621.js", import.meta.url));
const dtsFile = fileURLToPath(new URL("../dist/browser/e621.d.ts", import.meta.url));

await build({
    entryPoints: [entryPoint],
    outfile,
    bundle: true,
    platform: "browser",
    format: "esm",
    target: "esnext",
    sourcemap: true,
});

// The bundle re-exports the exact same surface as dist/lib/index.js, so point
// consumers of e621/browser at those existing declarations instead of generating
// a second copy.
await writeFile(dtsFile, [
    "export * from \"../lib/index.js\";",
    "export { default } from \"../lib/index.js\";",
    "",
].join("\n"));
