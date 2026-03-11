import Base from "./Base.js";
import { type ListBulkRelatedTagsResponses, type ListBulkRelatedTagsData } from "../generated/types.js";
import { OperationID, type TransformDataBodyToOptions } from "../util.js";
import { listBulkRelatedTags } from "../generated/sdk.js";

/** @category Modules/Types */
export interface BulkRelatedTagsOptions extends TransformDataBodyToOptions<ListBulkRelatedTagsData> {}

/** @category Modules */
export default class RelatedTags extends Base {
    @OperationID("listBulkRelatedTags")
    async bulk(options?: BulkRelatedTagsOptions): Promise<ListBulkRelatedTagsResponses[200]> {
        return listBulkRelatedTags({
            client: this.client,
            body:   options
        }).then(res => this._handleResponse(res, 200, true));
    }
}
