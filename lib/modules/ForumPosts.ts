import {
    createForumPost,
    deleteForumPost,
    editForumPost,
    getForumPost,
    hideForumPost,
    markForumPost,
    searchForumPosts,
    unhideForumPost,
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
import ForumPostVotes from "./forum_posts/Votes.js";

import type {
    CreateForumPostData,
    EditForumPostData,
    MarkForumPostData,
    MarkForumPostResponses,
    SearchForumPostsData,
} from "../generated/types.js";

/** @category Modules/Types */
export interface CreateForumPostOptions extends TransformDataBodyToOptions<CreateForumPostData> {}
/** @category Modules/Types */
export interface EditForumPostOptions extends TransformDataBodyToOptions<EditForumPostData> {}
/** @category Modules/Types */
export interface SearchForumPostsOptions extends TransformDataQueryToOptions<SearchForumPostsData> {}
/** @category Modules/Types */
export interface MarkForumPostResponse extends GetResponse<MarkForumPostResponses, 200> {}

/** @category Modules */
export default class ForumPosts extends Base {
    votes = new ForumPostVotes(this.e621, this.client);
    @OperationID("createForumPost")
    async create(options: CreateForumPostOptions): Promise<ForumPost> {
        return createForumPost({
            client: this.client,
            body: prefixKeys(options, "forum_post"),
        }).then(res => this._handleResponse(res, 201, true, ForumPost));
    }

    @OperationID("deleteForumPost")
    async delete(id: number): Promise<null> {
        return deleteForumPost({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("editForumPost")
    async edit(id: number, options: EditForumPostOptions): Promise<null> {
        return editForumPost({
            client: this.client,
            path: { id },
            body: prefixKeys(options, "forum_post"),
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("getForumPost")
    async get(id: number): Promise<ForumPost | null> {
        return getForumPost({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, ForumPost));
    }

    @OperationID("hideForumPost")
    async hide(id: number): Promise<ForumPost> {
        return hideForumPost({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 201, true, ForumPost));
    }

    @OperationID("markForumPost")
    async mark(id: number, type: ExtractValue<"record_type", MarkForumPostData>): Promise<MarkForumPostResponse> {
        return markForumPost({
            client: this.client,
            path: { id },
            body: { record_type: type },
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("searchForumPosts")
    async search(options?: SearchForumPostsOptions): Promise<Array<ForumPost>> {
        return searchForumPosts({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, ForumPost));
    }

    @OperationID("unhideForumPost")
    async unhide(id: number): Promise<ForumPost> {
        return unhideForumPost({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 201, true, ForumPost));
    }
}
