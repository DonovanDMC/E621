export { createE621Client } from "./client.js";
export type { E621ClientResult, InstanceOptions, Options } from "./client.js";

import type { Client } from "./generated/client/types.js";
import type E621 from "./index.js";

interface ModuleClass<Key extends string = string, T = unknown> {
    readonly moduleKey: Key;
    new (e621: E621 | undefined, client: Client): T;
}

type StandaloneResult<T extends ReadonlyArray<ModuleClass>> = { [C in T[number] as C["moduleKey"]]: InstanceType<C> };

/**
 * Constructs a minimal, standalone {@link E621}-like object containing only the modules you explicitly
 * provide, wired so they can call back into each other via `this.e621` (e.g. so `post.favorite()` works if
 * `favorites` is included). Unlike `new E621()`, only the modules you list here (and their own
 * dependencies) need to be bundled - useful when tree-shaking matters more than convenience.
 *
 * @category Main
 */
export function createStandalone<T extends ReadonlyArray<ModuleClass>>(modules: T, client: Client): StandaloneResult<T> {
    const e621: Record<string, unknown> = {};
    for (const ModuleCtor of modules) {
        e621[ModuleCtor.moduleKey] = new ModuleCtor(e621 as unknown as E621, client);
    }

    return e621 as StandaloneResult<T>;
}
