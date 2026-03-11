import Base from "./Base.js";
import type { PostApproval as PostApprovalData } from "../generated/types.js";
import { OperationID, Schema } from "../util.js";

interface PostApproval extends PostApprovalData {}
/** @category Models */
@Schema("PostApproval")
class PostApproval extends Base<PostApprovalData> {
    @OperationID("unapprovePost")
    async delete(): Promise<null> {
        return this.e621.postApprovals.delete(this.id);
    }
}

export default PostApproval;
