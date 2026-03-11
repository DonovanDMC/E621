import Base from "./Base.js";
import { searchAvoidPostingVersions } from "../generated/sdk.js";
import type { SearchAvoidPostingVersionsData } from "../generated/types.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";
import AvoidPostingVersion from "../models/AvoidPostingVersion.js";

/** @category Modules/Types */
export interface SearchAvoidPostingVersionsOptions extends TransformDataQueryToOptions<SearchAvoidPostingVersionsData> {}

/** @category Modules */
export default class AvoidPostingVersions extends Base {
    @OperationID("searchAvoidPostingVersions")
    async search(options?: SearchAvoidPostingVersionsOptions): Promise<Array<AvoidPostingVersion>> {
        return searchAvoidPostingVersions({
            client: this.client,
            query:  prefixKeys(options, "search", ["limit", "page"])
        }).then(res => res.data?.map(d => new AvoidPostingVersion(this.e621, d)) ?? []);
    }
}
