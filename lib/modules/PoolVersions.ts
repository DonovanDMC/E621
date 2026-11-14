import { poolVersions_index } from "e621-openapi/sdk";

import PoolVersion from "../models/PoolVersion.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { PoolVersionsIndexData } from "e621-openapi/types";

/** @category Modules/Types */
export interface SearchPoolVersionsOptions extends TransformDataQueryToOptions<PoolVersionsIndexData> {}

/** @category Modules */
export default class PoolVersions extends Base {
    static readonly moduleKey = "poolVersions" as const;
    @OperationID("pool_versions#index")
    async search(options?: SearchPoolVersionsOptions): Promise<Array<PoolVersion>> {
        return poolVersions_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, PoolVersion));
    }
}
