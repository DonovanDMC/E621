import Base from "./Base.js";
import {
    createForumTopic,
    deleteForumTopic,
    editForumTopic,
    getForumTopic,
    hideForumTopic,
    markAllForumTopicsAsRead,
    searchForumTopics,
    subscribeForumTopic,
    unhideForumTopic,
    unsubscribeForumTopic
} from "../generated/sdk.js";
import type { SearchForumTopicsData } from "../generated/types.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";
import ForumTopic from "../models/ForumTopic.js";

/** @category Modules/Types */
export interface ForumTopicOptions {
    category_id: number;
    is_locked?: boolean;
    is_sticky?: boolean;
    original_post_attributes?: {
        body?: string;
        id?: number;
    };
    title: string;
}
/** @category Modules/Types */
export interface SearchForumTopicsOptions extends TransformDataQueryToOptions<SearchForumTopicsData> {}

/** @category Modules */
export default class ForumTopics extends Base {
    @OperationID("createForumTopic")
    async create(options: ForumTopicOptions): Promise<ForumTopic> {
        return createForumTopic({
            client: this.client,
            body:   {
                "forum_topic[category_id]":                    options.category_id,
                "forum_topic[is_locked]":                      options.is_locked,
                "forum_topic[is_sticky]":                      options.is_sticky,
                "forum_topic[original_post_attributes][body]": options.original_post_attributes?.body,
                "forum_topic[original_post_attributes][id]":   options.original_post_attributes?.id,
                "forum_topic[title]":                          options.title
            }
        }).then(res => this._handleResponse(res, 201, true, ForumTopic));
    }

    @OperationID("deleteForumTopic")
    async delete(id: number): Promise<null> {
        return deleteForumTopic({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("editForumTopic")
    async edit(id: number, options: ForumTopicOptions): Promise<null> {
        return editForumTopic({
            client: this.client,
            path:   { id },
            body:   {
                "forum_topic[category_id]":                    options.category_id,
                "forum_topic[is_locked]":                      options.is_locked,
                "forum_topic[is_sticky]":                      options.is_sticky,
                "forum_topic[original_post_attributes][body]": options.original_post_attributes?.body,
                "forum_topic[original_post_attributes][id]":   options.original_post_attributes?.id,
                "forum_topic[title]":                          options.title
            }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("getForumTopic")
    async get(id: number): Promise<ForumTopic | null> {
        return getForumTopic({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 200, false, ForumTopic));
    }

    @OperationID("hideForumTopic")
    async hide(id: number): Promise<ForumTopic> {
        return hideForumTopic({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 201, true, ForumTopic));
    }

    @OperationID("markAllForumTopicsAsRead")
    async markAllRead(): Promise<null> {
        return markAllForumTopicsAsRead({
            client: this.client
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("searchForumTopics")
    async search(options?: SearchForumTopicsOptions): Promise<Array<ForumTopic>> {
        return searchForumTopics({
            client: this.client,
            query:  prefixKeys(options, "search", ["limit", "page"])
        }).then(res => this._handleResponse(res, 200, true, ForumTopic));
    }

    @OperationID("subscribeForumTopic")
    async subscribe(id: number): Promise<ForumTopic> {
        return subscribeForumTopic({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 201, true, ForumTopic));
    }

    @OperationID("unhideForumTopic")
    async unhide(id: number): Promise<ForumTopic> {
        return unhideForumTopic({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 201, true, ForumTopic));
    }

    @OperationID("unsubscribeForumTopic")
    async unsubscribe(id: number): Promise<ForumTopic> {
        return unsubscribeForumTopic({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 201, true, ForumTopic));
    }
}
