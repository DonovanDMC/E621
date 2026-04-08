import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { Takedown as TakedownData } from "../generated/types.js";
import type { AddPostsToTakedownByIdsResponse, AddPostsToTakedownByTagsResponse, CountMatchingPostsResponse, EditTakedownOptions } from "../modules/Takedowns.js";

interface Takedown extends TakedownData {}
/** @category Models */
@Schema("Takedown")
class Takedown extends Base<TakedownData> {
    @OperationID("addPostsToTakedownByIds")
    async addByIds(post_ids: Array<number>): Promise<AddPostsToTakedownByIdsResponse> {
        return this.e621.takedowns.addByIds(this.id, post_ids);
    }

    @OperationID("addPostsToTakedownByTags")
    async addByTags(tags: Array<string>): Promise<AddPostsToTakedownByTagsResponse> {
        return this.e621.takedowns.addByTags(this.id, tags);
    }

    @OperationID("countMatchingPosts")
    async countMatchingPosts(tags: string): Promise<CountMatchingPostsResponse> {
        return this.e621.takedowns.countMatchingPosts(this.id, tags);
    }

    @OperationID("deleteTakedown")
    async delete(): Promise<null> {
        return this.e621.takedowns.delete(this.id);
    }

    @OperationID("editTakedown")
    async edit(options: EditTakedownOptions): Promise<null> {
        return this.e621.takedowns.edit(this.id, options);
    }

    @OperationID("removePostsFromTakedownByIds")
    async removeByIds(post_ids: Array<number>): Promise<null> {
        return this.e621.takedowns.removeByIds(this.id, post_ids);
    }
}

export default Takedown;
