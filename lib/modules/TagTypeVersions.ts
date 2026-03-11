import Base from "./Base.js";
import type { SearchTagTypeVersionsData } from "../generated/types.js";
import TagTypeVersion from "../models/TagTypeVersion.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";
import { searchTagTypeVersions } from "../generated/sdk.js";

/** @category Modules/Types */
export interface SearchTagTypeVersionsOptions extends TransformDataQueryToOptions<SearchTagTypeVersionsData> {}

/** @category Modules */
export default class TagTypeVersions extends Base {
    @OperationID("searchTagTypeVersions")
    async search(options?: SearchTagTypeVersionsOptions): Promise<Array<TagTypeVersion>> {
        return searchTagTypeVersions({
            client: this.client,
            query:  prefixKeys(options, "search", ["limit", "page"])
        }).then(res => this._handleResponse(res, 200, true, TagTypeVersion));
    }
}
