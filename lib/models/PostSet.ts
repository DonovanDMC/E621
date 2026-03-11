import Base from "./Base.js";
import type { PostSet as PostSetData } from "../generated/types.js";
import { OperationID, Schema } from "../util.js";
import type { EditPostSetOptions } from "../modules/PostSets.js";

interface PostSet extends PostSetData {}
/** @category Models */
@Schema("PostSet")
class PostSet extends Base<PostSetData> {
    @OperationID("addPostsToPostSet")
    async addPosts(post_ids: Array<number>): Promise<PostSet> {
        return this.e621.postSets.addPosts(this.id, post_ids);
    }

    @OperationID("deletePostSet")
    async delete(): Promise<null> {
        return this.e621.postSets.delete(this.id);
    }

    @OperationID("editPostSet")
    async edit(options: EditPostSetOptions): Promise<null> {
        return this.e621.postSets.edit(this.id, options);
    }

    @OperationID("removePostsFromPostSet")
    async removePosts(post_ids: Array<number>): Promise<PostSet> {
        return this.e621.postSets.removePosts(this.id, post_ids);
    }

    @OperationID("updatePostSetPosts")
    async updatePosts(post_ids: Array<number>): Promise<PostSet> {
        return this.e621.postSets.updatePosts(this.id, post_ids);
    }

}

export default PostSet;
