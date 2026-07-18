import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { build } from "esbuild";

/** Assumes `npm run build` has already produced `dist/`. */
export const distLib = new URL("../../dist/lib/", import.meta.url);

export async function bundle(entryCode: string): Promise<string> {
    const dir = await mkdtemp(join(tmpdir(), "e621-test-bundle-"));
    const entryFile = join(dir, "entry.mjs");
    await writeFile(entryFile, entryCode, "utf8");
    try {
        const result = await build({
            entryPoints: [entryFile],
            bundle: true,
            platform: "browser",
            format: "esm",
            write: false,
            logLevel: "silent",
        });

        return result.outputFiles[0].text;
    } finally {
        // await rm(dir, { recursive: true, force: true });
    }
}

/**
 * Matching against `class Foo extends Base` is unreliable: esbuild compiles decorated classes to
 * `var Foo = class extends Base2 { ... }` (an anonymous class expression), so the class's own name never
 * appears in the output. Each module's `static moduleKey = "..."` (see lib/modules/Base.ts) is a plain
 * string literal though, and bundlers/minifiers don't rename those - so it's a reliable presence signal.
 */
export function hasModule(bundleText: string, moduleKey: string): boolean {
    return bundleText.includes(`moduleKey = ${JSON.stringify(moduleKey)}`);
}
