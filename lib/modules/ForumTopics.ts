import {
    forumTopics_create,
    forumTopics_destroy,
    forumTopics_update,
    forumTopics_show,
    forumTopics_hide,
    forumTopics_markAllAsRead,
    forumTopics_index,
    forumTopics_subscribe,
    forumTopics_unhide,
    forumTopics_unsubscribe,
} from "../generated/sdk.js";
import ForumTopic from "../models/ForumTopic.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { ForumTopicsCreateData, ForumTopicsIndexData, ForumTopicsUpdateData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreateForumTopicOptions extends TransformDataBodyToOptions<ForumTopicsCreateData> {}
/** @category Modules/Types */
export interface UpdateForumTopicOptions extends TransformDataBodyToOptions<ForumTopicsUpdateData> {}
/** @category Modules/Types */
export interface SearchForumTopicsOptions extends TransformDataQueryToOptions<ForumTopicsIndexData> {}

/** @category Modules */
export default class ForumTopics extends Base {
    @OperationID("forum_topics#create")
    async create(options: CreateForumTopicOptions): Promise<ForumTopic> {
        return forumTopics_create({
            client: this.client,
            body: options,
        }).then(res => this._handleResponse(res, 201, true, ForumTopic));
    }

    @OperationID("forum_topics#destroy")
    async delete(id: number): Promise<null> {
        return forumTopics_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("forum_topics#show")
    async get(id: number): Promise<ForumTopic | null> {
        return forumTopics_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, ForumTopic));
    }

    @OperationID("forum_topics#hide")
    async hide(id: number): Promise<ForumTopic> {
        return forumTopics_hide({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 201, true, ForumTopic));
    }

    @OperationID("forum_topics#mark_all_as_read")
    async markAllRead(): Promise<null> {
        return forumTopics_markAllAsRead({
            client: this.client,
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("forum_topics#index")
    async search(options?: SearchForumTopicsOptions): Promise<Array<ForumTopic>> {
        return forumTopics_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, ForumTopic));
    }

    @OperationID("forum_topics#subscribe")
    async subscribe(id: number): Promise<ForumTopic> {
        return forumTopics_subscribe({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 201, true, ForumTopic));
    }

    @OperationID("forum_topics#unhide")
    async unhide(id: number): Promise<ForumTopic> {
        return forumTopics_unhide({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 201, true, ForumTopic));
    }

    @OperationID("forum_topics#unsubscribe")
    async unsubscribe(id: number): Promise<ForumTopic> {
        return forumTopics_unsubscribe({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 201, true, ForumTopic));
    }

    @OperationID("forum_topics#update")
    async update(id: number, options: UpdateForumTopicOptions): Promise<null> {
        return forumTopics_update({
            client: this.client,
            path: { id },
            body: options,
        }).then(res => this._handleResponse(res, 204, true));
    }
}
