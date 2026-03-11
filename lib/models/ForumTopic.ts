import Base from "./Base.js";
import type { ForumTopic as ForumTopicData } from "../generated/types.js";
import { OperationID, Schema } from "../util.js";
import type { ForumTopicOptions } from "../modules/ForumTopics.js";

interface ForumTopic extends ForumTopicData {}
/** @category Models */
@Schema("ForumTopic")
class ForumTopic extends Base<ForumTopicData> {
    @OperationID("deleteForumTopic")
    async delete(): Promise<null> {
        return this.e621.forumTopics.delete(this.id);
    }

    @OperationID("editForumTopic")
    async edit(options: ForumTopicOptions): Promise<null> {
        return this.e621.forumTopics.edit(this.id, options);
    }

    @OperationID("hideForumTopic")
    async hide(): Promise<ForumTopic> {
        return this.e621.forumTopics.hide(this.id);
    }

    @OperationID("subscribeForumTopic")
    async subscribe(): Promise<ForumTopic> {
        return this.e621.forumTopics.subscribe(this.id);
    }

    @OperationID("unhideForumTopic")
    async unhide(): Promise<ForumTopic> {
        return this.e621.forumTopics.unhide(this.id);
    }

    @OperationID("unsubscribeForumTopic")
    async unsubscribe(): Promise<ForumTopic> {
        return this.e621.forumTopics.unsubscribe(this.id);
    }

}

export default ForumTopic;
