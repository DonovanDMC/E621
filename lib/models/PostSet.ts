import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { PostSet as PostSetData } from "../generated/types.js";
import type { UpdatePostSetOptions } from "../modules/PostSets.js";

interface PostSet extends PostSetData {}
/** @category Models */
@Schema("PostSet")
class PostSet extends Base<PostSetData> {
    @OperationID("post_sets#add_posts")
    async addPosts(post_ids: Array<number>): Promise<PostSet> {
        return this.e621.postSets.addPosts(this.id, post_ids);
    }

    @OperationID("post_sets#destroy")
    async delete(): Promise<null> {
        return this.e621.postSets.delete(this.id);
    }

    @OperationID("post_sets#remove_posts")
    async removePosts(post_ids: Array<number>): Promise<PostSet> {
        return this.e621.postSets.removePosts(this.id, post_ids);
    }

    @OperationID("post_sets#update")
    async update(options: UpdatePostSetOptions): Promise<null> {
        return this.e621.postSets.update(this.id, options);
    }

    @OperationID("post_sets#update_posts")
    async updatePosts(post_ids: Array<number>): Promise<PostSet> {
        return this.e621.postSets.updatePosts(this.id, post_ids);
    }
}

export default PostSet;
