import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { PostApproval as PostApprovalData } from "../generated/types.js";

interface PostApproval extends PostApprovalData {}
/** @category Models */
@Schema("PostApproval")
class PostApproval extends Base<PostApprovalData> {
    @OperationID("staff/post/approvals#destroy")
    async delete(): Promise<null> {
        return this.e621.postApprovals.delete(this.id);
    }
}

export default PostApproval;
