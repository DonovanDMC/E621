import { searchPoolVersions } from "../generated/sdk.js";
import PoolVersion from "../models/PoolVersion.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { SearchPoolVersionsData } from "../generated/types.js";

/** @category Modules/Types */
export interface SearchPoolVersionsOptions extends TransformDataQueryToOptions<SearchPoolVersionsData> {}

/** @category Modules */
export default class PoolVersions extends Base {
    @OperationID("searchPoolVersions")
    async search(options?: SearchPoolVersionsOptions): Promise<Array<PoolVersion>> {
        return searchPoolVersions({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, PoolVersion));
    }
}
