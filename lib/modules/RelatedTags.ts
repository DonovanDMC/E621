import { relatedTags_bulk } from "../generated/sdk.js";
import { type RelatedTagsBulkResponses, type RelatedTagsBulkData } from "../generated/types.js";
import { GetResponse, OperationID, type TransformDataBodyToOptions } from "../util.js";

import Base from "./Base.js";

/** @category Modules/Types */
export interface BulkRelatedTagsOptions extends TransformDataBodyToOptions<RelatedTagsBulkData> {}
/** @category Modules/Types */
export interface RelatedTagsBulkResponse extends GetResponse<RelatedTagsBulkResponses, 200> {}

/** @category Modules */
export default class RelatedTags extends Base {
    static readonly moduleKey = "relatedTags" as const;
    @OperationID("related_tags#bulk")
    async bulk(options?: BulkRelatedTagsOptions): Promise<RelatedTagsBulkResponse> {
        return relatedTags_bulk({
            client: this.client,
            body: options,
        }).then(res => this._handleResponse(res, 200, true));
    }
}
