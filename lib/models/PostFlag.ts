import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { PostFlag as PostFlagData } from "../generated/types.js";

interface PostFlag extends PostFlagData {}
/** @category Models */
@Schema("PostFlag")
class PostFlag extends Base<PostFlagData> {
    @OperationID("clearPostFlagNote")
    async clearNote(): Promise<PostFlag> {
        return this.e621.postFlags.clearNote(this.id);
    }

    @OperationID("unflagPost")
    async resolve(): Promise<null> {
        return this.e621.posts.flag.delete(this.post_id);
    }
}

export default PostFlag;
