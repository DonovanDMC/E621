import { tagTypeVersions_index } from "../generated/sdk.js";
import TagTypeVersion from "../models/TagTypeVersion.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { TagTypeVersionsIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface SearchTagTypeVersionsOptions extends TransformDataQueryToOptions<TagTypeVersionsIndexData> {}

/** @category Modules */
export default class TagTypeVersions extends Base {
    static readonly moduleKey = "tagTypeVersions" as const;
    @OperationID("tag_type_versions#index")
    async search(options?: SearchTagTypeVersionsOptions): Promise<Array<TagTypeVersion>> {
        return tagTypeVersions_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, TagTypeVersion));
    }
}
