import { avoidPostingVersions_index } from "../generated/sdk.js";
import AvoidPostingVersion from "../models/AvoidPostingVersion.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { AvoidPostingVersionsIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface SearchAvoidPostingVersionsOptions extends TransformDataQueryToOptions<AvoidPostingVersionsIndexData> {}

/** @category Modules */
export default class AvoidPostingVersions extends Base {
    @OperationID("avoid_posting_versions#index")
    async search(options?: SearchAvoidPostingVersionsOptions): Promise<Array<AvoidPostingVersion>> {
        return avoidPostingVersions_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => res.data?.map(d => new AvoidPostingVersion(this.e621, d)) ?? []);
    }
}
