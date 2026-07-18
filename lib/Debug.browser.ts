/**
 * Browser build of {@link Debug}. `debug`/`persistent-debug` are Node-only optional dependencies whose
 * dynamic imports break browser bundlers (see #15), so this no-op variant is swapped in via
 * package.json's `browser` field.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
export default function Debug(_namespace: string, _formatter: unknown, ..._args: Array<unknown>): void {}
