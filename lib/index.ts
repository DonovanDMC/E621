import { createE621Client } from "./client.js";
import { apply, type Modules } from "./modules/index.js";

import type { InstanceOptions, Options } from "./client.js";
import type { Client } from "./generated/client/types.js";

export type * from "./modules/index.js";
export * from "./models/index.js";
export * from "./errors.js";
export * as Generated from "./generated.js";
export type { Options } from "./client.js";

interface E621 extends Modules {}
/** @category Main */
class E621 {
    client: Client;
    options: InstanceOptions;
    constructor(options?: Options) {
        const { client, options: resolved } = createE621Client(options);
        this.client = client;
        this.options = resolved;
        apply(this, this.client);
    }
}

export default E621;
