import { avoidPostingVersions_index } from "e621-openapi/sdk";

import AvoidPostingVersion from "../models/AvoidPostingVersion.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { AvoidPostingVersionsIndexData } from "e621-openapi/types";

/** @category Modules/Types */
export interface SearchAvoidPostingVersionsOptions extends TransformDataQueryToOptions<AvoidPostingVersionsIndexData> {}

/** @category Modules */
export default class AvoidPostingVersions extends Base {
    static readonly moduleKey = "avoidPostingVersions" as const;
    @OperationID("avoid_posting_versions#index")
    async search(options?: SearchAvoidPostingVersionsOptions): Promise<Array<AvoidPostingVersion>> {
        return avoidPostingVersions_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => res.data?.map(d => new AvoidPostingVersion(this.e621, d)) ?? []);
    }
}
