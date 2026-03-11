import Base from "./Base.js";
import type { AddPostsToTakedownByIdsResponses, AddPostsToTakedownByTagsResponses, CountMatchingPostsResponses, Takedown as TakedownData } from "../generated/types.js";
import { OperationID, Schema } from "../util.js";
import type { EditTakedownOptions } from "../modules/Takedowns.js";

interface Takedown extends TakedownData {}
/** @category Models */
@Schema("Takedown")
class Takedown extends Base<TakedownData> {
    @OperationID("addPostsToTakedownByIds")
    async addByIds(post_ids: Array<number>): Promise<AddPostsToTakedownByIdsResponses[200]> {
        return this.e621.takedowns.addByIds(this.id, post_ids);
    }

    @OperationID("addPostsToTakedownByTags")
    async addByTags(tags: Array<string>): Promise<AddPostsToTakedownByTagsResponses[200]> {
        return this.e621.takedowns.addByTags(this.id, tags);
    }

    @OperationID("countMatchingPosts")
    async countMatchingPosts(tags: string): Promise<CountMatchingPostsResponses[200]> {
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
