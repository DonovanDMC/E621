import Base from "./Base.js";
import type Post from "./Post.js";
import type { PostReplacement as PostReplacementData } from "../generated/types.js";
import { OperationID, Schema } from "../util.js";

interface PostReplacement extends PostReplacementData {}
/** @category Models */
@Schema("PostReplacement")
class PostReplacement extends Base<PostReplacementData> {
    @OperationID("approvePostReplacement")
    async approve(): Promise<null> {
        return this.e621.postReplacements.approve(this.id);
    }

    @OperationID("deletePostReplacement")
    async delete(): Promise<null> {
        return this.e621.postReplacements.delete(this.id);
    }

    @OperationID("promotePostReplacement")
    async promote(): Promise<Post> {
        return this.e621.postReplacements.promote(this.id);
    }

    @OperationID("rejectPostReplacement")
    async reject(): Promise<null> {
        return this.e621.postReplacements.reject(this.id);
    }

    @OperationID("togglePostReplacementPenalty")
    async togglePenalize(): Promise<null> {
        return this.e621.postReplacements.togglePenalize(this.id);
    }

}

export default PostReplacement;
