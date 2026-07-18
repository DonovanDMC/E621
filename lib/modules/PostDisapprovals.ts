import { staffPostDisapprovals_create, staffPostDisapprovals_index } from "../generated/sdk.js";
import { type StaffPostDisapprovalsCreateData, type StaffPostDisapprovalsIndexData } from "../generated/types.js";
import PostDisapproval from "../models/PostDisapproval.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

/** @category Modules/Types */
export interface CreatePostDisapprovalOptions extends TransformDataBodyToOptions<StaffPostDisapprovalsCreateData> {}
/** @category Modules/Types */
export interface DisapprovePostOptions extends Omit<CreatePostDisapprovalOptions, "post_id"> {}
/** @category Modules/Types */
export interface SearchPostDisapprovalsOptions extends TransformDataQueryToOptions<StaffPostDisapprovalsIndexData> {}

/** @category Modules */
export default class PostDisapprovals extends Base {
    static readonly moduleKey = "postDisapprovals" as const;
    @OperationID("staff/post/disapprovals#create")
    async create(options: CreatePostDisapprovalOptions): Promise<PostDisapproval> {
        return staffPostDisapprovals_create({
            client: this.client,
            body: options,
        }).then(res => this._handleResponse(res, 201, true, PostDisapproval));
    }

    @OperationID("staff/post/disapprovals#index")
    async search(options?: SearchPostDisapprovalsOptions): Promise<Array<PostDisapproval>> {
        return staffPostDisapprovals_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, PostDisapproval));
    }
}
