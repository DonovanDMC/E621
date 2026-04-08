import {
    createComment,
    deleteComment,
    editComment,
    getComment,
    hideComment,
    markComment,
    searchComments,
    unhideComment,
} from "../generated/sdk.js";
import Comment from "../models/Comment.js";
import {
    OperationID,
    type ExtractValue,
    prefixKeys,
    type TransformDataBodyToOptions,
    type TransformDataQueryToOptions,
    GetResponse,
} from "../util.js";

import Base from "./Base.js";
import CommentVotes from "./comments/Votes.js";

import type {
    CreateCommentData,
    EditCommentData,
    MarkCommentData,
    MarkCommentResponses,
    SearchCommentsData,
} from "../generated/types.js";

/** @category Modules/Types */
export interface SearchCommentsOptions extends TransformDataQueryToOptions<SearchCommentsData> {}
/** @category Modules/Types */
export interface CreateCommentOptions extends TransformDataBodyToOptions<CreateCommentData> {}
/** @category Modules/Types */
export interface EditCommentOptions extends TransformDataBodyToOptions<EditCommentData> {}
/** @category Modules/Types */
export interface MarkCommentResponse extends GetResponse<MarkCommentResponses, 200> {}

/** @category Modules */
export default class Comments extends Base {
    votes = new CommentVotes(this.e621, this.client);
    @OperationID("createComment")
    async create(options: CreateCommentOptions): Promise<Comment> {
        return createComment({
            client: this.client,
            body: prefixKeys(options, "comment"),
        }).then(res => this._handleResponse(res, 201, true, Comment));
    }

    @OperationID("deleteComment")
    async delete(id: number): Promise<null> {
        return deleteComment({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("editComment")
    async edit(id: number, options: EditCommentOptions): Promise<null> {
        return editComment({
            client: this.client,
            path: { id },
            body: prefixKeys(options, "comment"),
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("getComment")
    async get(id: number): Promise<Comment | null> {
        return getComment({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, Comment));
    }

    @OperationID("hideComment")
    async hide(id: number): Promise<Comment> {
        return hideComment({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 201, true, Comment));
    }

    @OperationID("markComment")
    async mark(id: number, type: ExtractValue<"record_type", MarkCommentData>): Promise<MarkCommentResponse> {
        return markComment({
            client: this.client,
            path: { id },
            body: { record_type: type },
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("searchComments")
    async search(options?: SearchCommentsOptions): Promise<Array<Comment>> {
        return searchComments({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, Comment));
    }

    @OperationID("unhideComment")
    async unhide(id: number): Promise<Comment> {
        return unhideComment({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 201, true, Comment));
    }
}
