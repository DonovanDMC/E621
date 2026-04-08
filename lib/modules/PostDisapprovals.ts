import { createPostDisapproval, searchPostDisapprovals } from "../generated/sdk.js";
import { type CreatePostDisapprovalData, type SearchPostDisapprovalsData } from "../generated/types.js";
import PostDisapproval from "../models/PostDisapproval.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

/** @category Modules/Types */
export interface CreatePostDisapprovalOptions extends TransformDataBodyToOptions<CreatePostDisapprovalData> {}
/** @category Modules/Types */
export interface SearchPostDisapprovalsOptions extends TransformDataQueryToOptions<SearchPostDisapprovalsData> {}

/** @category Modules */
export default class PostDisapprovals extends Base {
    @OperationID("createPostDisapproval")
    async create(options: CreatePostDisapprovalOptions): Promise<PostDisapproval> {
        return createPostDisapproval({
            client: this.client,
            body: prefixKeys(options, "post_disapproval"),
        }).then(res => this._handleResponse(res, 201, true, PostDisapproval));
    }

    @OperationID("searchPostDisapprovals")
    async search(options?: SearchPostDisapprovalsOptions): Promise<Array<PostDisapproval>> {
        return searchPostDisapprovals({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, PostDisapproval));
    }
}
