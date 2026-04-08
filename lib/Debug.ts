/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */
import type NormalDebug from "debug";
import type PersistentDebug from "persistent-debug";

let pDebug: typeof PersistentDebug | undefined, debug: typeof NormalDebug | undefined;
await import("persistent-debug").then((module) => {
    pDebug = module.default;
}, () => {});
await import("debug").then((module) => {
    debug = module.default;
}, () => {});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function Debug(namespace: string, formatter: any, ...args: Array<any>): void {
    if (pDebug) {
        pDebug(`e621:${namespace}`, formatter, ...args);
    } else if (debug) {
        debug(`e621:${namespace}`)(formatter, ...args);
    }
}
