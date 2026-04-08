import { getBan, searchBans } from "../generated/sdk.js";
import Ban from "../models/Ban.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { SearchBansData } from "../generated/types.js";

/** @category Modules/Types */
export interface SearchBansOptions extends TransformDataQueryToOptions<SearchBansData> {}

/** @category Modules */
export default class Bans extends Base {
    @OperationID("getBan")
    async get(id: number): Promise<Ban | null> {
        return getBan({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, Ban));
    }

    @OperationID("searchBans")
    async search(options?: SearchBansOptions): Promise<Array<Ban>> {
        return searchBans({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, Ban));
    }
}
