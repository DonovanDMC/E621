import { staffPostApprovals_create, postApprovals_index, staffPostApprovals_destroy } from "../generated/sdk.js";
import { type PostApprovalsIndexData } from "../generated/types.js";
import PostApproval from "../models/PostApproval.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

/** @category Modules/Types */
export interface SearchPostApprovalsOptions extends TransformDataQueryToOptions<PostApprovalsIndexData> {}

/** @category Modules */
export default class PostApprovals extends Base {
    static readonly moduleKey = "postApprovals" as const;
    @OperationID("staff/post/approvals#create")
    async create(post_id: number): Promise<null> {
        return staffPostApprovals_create({
            client: this.client,
            body: { post_id },
        }).then((res) => {
            this._handleResponse(res, 201, true); // 201 returns an empty object, note 204 here is an error
            return null;
        });
    }

    @OperationID("staff/post/approvals#destroy")
    async delete(post_id: number): Promise<null> {
        return staffPostApprovals_destroy({
            client: this.client,
            body: { post_id },
        }).then(res => this._handleResponse(res, 204, true)); // 204 may be success or failure
    }

    @OperationID("post_approvals#index")
    async search(options?: SearchPostApprovalsOptions): Promise<Array<PostApproval>> {
        return postApprovals_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, PostApproval));
    }
}
