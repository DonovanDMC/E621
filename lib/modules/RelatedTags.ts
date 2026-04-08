import { listBulkRelatedTags } from "../generated/sdk.js";
import { type ListBulkRelatedTagsResponses, type ListBulkRelatedTagsData } from "../generated/types.js";
import { GetResponse, OperationID, type TransformDataBodyToOptions } from "../util.js";

import Base from "./Base.js";

/** @category Modules/Types */
export interface BulkRelatedTagsOptions extends TransformDataBodyToOptions<ListBulkRelatedTagsData> {}
/** @category Modules/Types */
export interface ListBulkRelatedTagsResponse extends GetResponse<ListBulkRelatedTagsResponses, 200> {}

/** @category Modules */
export default class RelatedTags extends Base {
    @OperationID("listBulkRelatedTags")
    async bulk(options?: BulkRelatedTagsOptions): Promise<ListBulkRelatedTagsResponse> {
        return listBulkRelatedTags({
            client: this.client,
            body: options,
        }).then(res => this._handleResponse(res, 200, true));
    }
}
