import { bans_show, bans_index } from "../generated/sdk.js";
import Ban from "../models/Ban.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { BansIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface SearchBansOptions extends TransformDataQueryToOptions<BansIndexData> {}

/** @category Modules */
export default class Bans extends Base {
    @OperationID("bans#show")
    async get(id: number): Promise<Ban | null> {
        return bans_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, Ban));
    }

    @OperationID("bans#index")
    async search(options?: SearchBansOptions): Promise<Array<Ban>> {
        return bans_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, Ban));
    }
}
