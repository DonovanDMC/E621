import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { PostFlag as PostFlagData } from "../generated/types.js";
import type { ResolvePostFlagResponse } from "../modules/PostFlags.js";

interface PostFlag extends PostFlagData {}
/** @category Models */
@Schema("PostFlag")
class PostFlag extends Base<PostFlagData> {
    @OperationID("post_flags#clear_note")
    async clearNote(): Promise<PostFlag> {
        return this.e621.postFlags.clearNote(this.id);
    }

    @OperationID("post_flags#destroy")
    async resolve(): Promise<ResolvePostFlagResponse> {
        return this.e621.postFlags.resolve(this.post_id);
    }
}

export default PostFlag;
