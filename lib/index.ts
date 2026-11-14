import { createE621Client } from "./client.js";
import { apply, type Modules } from "./modules/index.js";
import { type NoV1Options, type PostFormatOptions } from "./modules/posts/Format.js";

import type { InstanceOptions, Options } from "./client.js";
import type { Client } from "e621-openapi/client/types";

export type * from "./modules/index.js";
export * from "./models/index.js";
export * from "./errors.js";
export * as Generated from "./generated.js";
export type { AuthToken, Options, RatelimitInfo, RatelimitOptions } from "./client.js";
export { default as OAuthClient } from "./OAuthClient.js";
export type * from "./OAuthClient.js";

interface E621<PF extends PostFormatOptions = NoV1Options> extends Modules<PF> {}
/** @category Main */
class E621<const PF extends PostFormatOptions = NoV1Options> {
    client: Client;
    options: InstanceOptions;
    constructor(options?: Options<PF>) {
        const { client, options: resolved } = createE621Client(options);
        this.client = client;
        this.options = resolved;
        apply(this, this.client, options?.defaultPostFormat ?? ({} as PF));
    }
}

export default E621;
