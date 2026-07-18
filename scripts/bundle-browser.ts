import { build } from "esbuild";

const entryPoint = new URL("../dist/lib/index.js", import.meta.url).pathname;
const outfile = new URL("../dist/browser/e621.js", import.meta.url).pathname;

await build({
    entryPoints: [entryPoint],
    outfile,
    bundle: true,
    platform: "browser",
    format: "esm",
    target: "esnext",
    sourcemap: true,
});
