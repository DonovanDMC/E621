import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { ForumTopic as ForumTopicData } from "../generated/types.js";
import type { UpdateForumTopicOptions } from "../modules/ForumTopics.js";

interface ForumTopic extends ForumTopicData {}
/** @category Models */
@Schema("ForumTopic")
class ForumTopic extends Base<ForumTopicData> {
    @OperationID("forum_topics#destroy")
    async delete(): Promise<null> {
        return this.e621.forumTopics.delete(this.id);
    }

    @OperationID("forum_topics#hide")
    async hide(): Promise<ForumTopic> {
        return this.e621.forumTopics.hide(this.id);
    }

    @OperationID("forum_topics#subscribe")
    async subscribe(): Promise<ForumTopic> {
        return this.e621.forumTopics.subscribe(this.id);
    }

    @OperationID("forum_topics#unhide")
    async unhide(): Promise<ForumTopic> {
        return this.e621.forumTopics.unhide(this.id);
    }

    @OperationID("forum_topics#unsubscribe")
    async unsubscribe(): Promise<ForumTopic> {
        return this.e621.forumTopics.unsubscribe(this.id);
    }

    @OperationID("forum_topics#update")
    async update(options: UpdateForumTopicOptions): Promise<null> {
        return this.e621.forumTopics.update(this.id, options);
    }
}

export default ForumTopic;
