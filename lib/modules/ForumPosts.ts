import {
    forumPosts_create,
    forumPosts_destroy,
    forumPosts_update,
    forumPosts_show,
    forumPosts_hide,
    forumPosts_warning,
    forumPosts_index,
    forumPosts_unhide,
} from "../generated/sdk.js";
import ForumPost from "../models/ForumPost.js";
import {
    OperationID,
    type ExtractValue,
    prefixKeys,
    type TransformDataBodyToOptions,
    type TransformDataQueryToOptions,
    GetResponse,
} from "../util.js";

import Base from "./Base.js";

import type {
    ForumPostsCreateData,
    ForumPostsUpdateData,
    ForumPostsWarningData,
    ForumPostsWarningResponses,
    ForumPostsIndexData,
} from "../generated/types.js";

/** @category Modules/Types */
export interface CreateForumPostOptions extends TransformDataBodyToOptions<ForumPostsCreateData> {}
/** @category Modules/Types */
export interface UpdateForumPostOptions extends TransformDataBodyToOptions<ForumPostsUpdateData> {}
/** @category Modules/Types */
export interface SearchForumPostsOptions extends TransformDataQueryToOptions<ForumPostsIndexData> {}
/** @category Modules/Types */
export interface ForumPostsWarningResponse extends GetResponse<ForumPostsWarningResponses, 200> {}

/** @category Modules */
export default class ForumPosts extends Base {
    static readonly moduleKey = "forumPosts" as const;
    @OperationID("forum_posts#create")
    async create(options: CreateForumPostOptions): Promise<ForumPost> {
        return forumPosts_create({
            client: this.client,
            body: options,
        }).then(res => this._handleResponse(res, 201, true, ForumPost));
    }

    @OperationID("forum_posts#destroy")
    async delete(id: number): Promise<null> {
        return forumPosts_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("forum_posts#show")
    async get(id: number): Promise<ForumPost | null> {
        return forumPosts_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, ForumPost));
    }

    @OperationID("forum_posts#hide")
    async hide(id: number): Promise<ForumPost> {
        return forumPosts_hide({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 201, true, ForumPost));
    }

    @OperationID("forum_posts#warning")
    async mark(id: number, type: ExtractValue<"record_type", ForumPostsWarningData>): Promise<ForumPostsWarningResponse> {
        return forumPosts_warning({
            client: this.client,
            path: { id },
            body: { record_type: type },
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("forum_posts#index")
    async search(options?: SearchForumPostsOptions): Promise<Array<ForumPost>> {
        return forumPosts_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, ForumPost));
    }

    @OperationID("forum_posts#unhide")
    async unhide(id: number): Promise<ForumPost> {
        return forumPosts_unhide({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 201, true, ForumPost));
    }

    @OperationID("forum_posts#update")
    async update(id: number, options: UpdateForumPostOptions): Promise<null> {
        return forumPosts_update({
            client: this.client,
            path: { id },
            body: options,
        }).then(res => this._handleResponse(res, 204, true));
    }
}
