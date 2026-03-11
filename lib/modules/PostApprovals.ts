import Base from "./Base.js";
import { approvePost, searchPostApprovals, unapprovePost } from "../generated/sdk.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";
import { type SearchPostApprovalsData } from "../generated/types.js";
import PostApproval from "../models/PostApproval.js";

/** @category Modules/Types */
export interface SearchPostApprovalsOptions extends TransformDataQueryToOptions<SearchPostApprovalsData> {}

/** @category Modules */
export default class PostApprovals extends Base {
    @OperationID("approvePost")
    async create(post_id: number): Promise<null> {
        return approvePost({
            client: this.client,
            body:   { post_id }
        }).then(res => {
            this._handleResponse(res, 201, true); // 201 returns an empty object, note 204 here is an error
            return null;
        });
    }

    @OperationID("unapprovePost")
    async delete(post_id: number): Promise<null> {
        return unapprovePost({
            client: this.client,
            body:   { post_id }
        }).then(res => this._handleResponse(res, 204, true)); // 204 may be success or failure
    }

    @OperationID("searchPostApprovals")
    async search(options?: SearchPostApprovalsOptions): Promise<Array<PostApproval>> {
        return searchPostApprovals({
            client: this.client,
            query:  prefixKeys(options, "search", ["limit", "page"])
        }).then(res => this._handleResponse(res, 200, true, PostApproval));
    }
}
