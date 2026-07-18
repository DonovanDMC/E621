import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type Post from "./Post.js";
import type { PostReplacement as PostReplacementData } from "../generated/types.js";

interface PostReplacement extends PostReplacementData {}
/** @category Models */
@Schema("PostReplacement")
class PostReplacement extends Base<PostReplacementData> {
    @OperationID("post_replacements#approve")
    async approve(): Promise<null> {
        return this.e621.postReplacements.approve(this.id);
    }

    @OperationID("post_replacements#destroy")
    async delete(): Promise<null> {
        return this.e621.postReplacements.delete(this.id);
    }

    @OperationID("post_replacements#promote")
    async promote(): Promise<Post> {
        return this.e621.postReplacements.promote(this.id);
    }

    @OperationID("post_replacements#reject")
    async reject(): Promise<null> {
        return this.e621.postReplacements.reject(this.id);
    }

    @OperationID("post_replacements#toggle_penalize")
    async togglePenalize(): Promise<null> {
        return this.e621.postReplacements.togglePenalize(this.id);
    }
}

export default PostReplacement;
