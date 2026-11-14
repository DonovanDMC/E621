import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { TakedownsAddByIdsResponse, TakedownsAddByTagsResponse, TakedownsClearPostsResponse, TakedownsCountMatchingPostsResponse, UpdateTakedownOptions } from "../modules/Takedowns.js";
import type { Takedown as TakedownData } from "e621-openapi/types";

interface Takedown extends TakedownData {}
/** @category Models */
@Schema("Takedown")
class Takedown extends Base<TakedownData> {
    @OperationID("takedowns#add_by_ids")
    async addByIds(post_ids: Array<number>): Promise<TakedownsAddByIdsResponse> {
        return this.e621.takedowns.addByIds(this.id, post_ids);
    }

    @OperationID("takedowns#add_by_tags")
    async addByTags(tags: Array<string>): Promise<TakedownsAddByTagsResponse> {
        return this.e621.takedowns.addByTags(this.id, tags);
    }

    @OperationID("takedowns#clear_posts")
    async clearPosts(): Promise<TakedownsClearPostsResponse> {
        return this.e621.takedowns.clearPosts(this.id);
    }

    @OperationID("takedowns#count_matching_posts")
    async countMatchingPosts(tags: string): Promise<TakedownsCountMatchingPostsResponse> {
        return this.e621.takedowns.countMatchingPosts(this.id, tags);
    }

    @OperationID("takedowns#destroy")
    async delete(): Promise<null> {
        return this.e621.takedowns.delete(this.id);
    }

    @OperationID("takedowns#remove_by_ids")
    async removeByIds(post_ids: Array<number>): Promise<null> {
        return this.e621.takedowns.removeByIds(this.id, post_ids);
    }

    @OperationID("takedowns#update")
    async update(options: UpdateTakedownOptions): Promise<null> {
        return this.e621.takedowns.update(this.id, options);
    }
}

export default Takedown;
