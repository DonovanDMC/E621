import { access, rename, rm } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const libDir = join(root, "lib");
const buildDir = join(root, "build");
const libBckDir = join(root, "lib-bck");

export interface WithBuiltLibOptions {
    /** Keep `build/` around after a successful run instead of deleting it (docs.ts wants this, build.ts doesn't). */
    keepBuildOnSuccess?: boolean;
}

/**
 * Swaps `lib/` for the JSDoc-injected `build/` copy (produced by replace-openapi.ts) for the duration of
 * `fn`, then restores the original `lib/` afterward - even if `fn` throws. On success `build/` is removed
 * unless `keepBuildOnSuccess` is set; on failure it's always left in place for debugging.
 *
 * Pure Node `fs`/`path` - no shell, so this works identically on Windows/macOS/Linux, unlike the old
 * bash `mv`/`trap` dance.
 */
export async function withBuiltLib(fn: () => Promise<void>, options: WithBuiltLibOptions = {}): Promise<void> {
    if (!await access(buildDir).then(() => true, () => false)) {
        console.error(`Build dir "${buildDir}" does not exist (build failed?)`);
        process.exit(1);
    }
    await rename(libDir, libBckDir);
    await rename(buildDir, libDir);

    let failed = false;
    try {
        await fn();
    } catch (err) {
        failed = true;
        throw err;
    } finally {
        await rename(libDir, buildDir);
        await rename(libBckDir, libDir);
        if (!failed && !options.keepBuildOnSuccess) {
            await rm(buildDir, { recursive: true, force: true });
        }
    }
}
