import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { PostVersion as PostVersionData } from "../generated/types.js";

interface PostVersion extends PostVersionData {}
/** @category Models */
@Schema("PostVersion")
class PostVersion extends Base<PostVersionData> {
    @OperationID("post_versions#hide")
    async hide(): Promise<string> {
        return this.e621.postVersions.hide(this.id);
    }

    @OperationID("posts#revert")
    async revertTo(): Promise<null> {
        return this.e621.posts.revert(this.post_id, this.id);
    }

    @OperationID("post_versions#undo")
    async undo(): Promise<null> {
        return this.e621.postVersions.undo(this.id);
    }

    @OperationID("post_versions#unhide")
    async unhide(): Promise<string> {
        return this.e621.postVersions.unhide(this.id);
    }
}

export default PostVersion;
