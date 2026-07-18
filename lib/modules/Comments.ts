import {
    comments_create,
    comments_destroy,
    comments_update,
    comments_show,
    comments_hide,
    comments_warning,
    comments_index,
    comments_unhide,
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

import type {
    CommentsCreateData,
    CommentsUpdateData,
    CommentsWarningData,
    CommentsWarningResponses,
    CommentsIndexData,
} from "../generated/types.js";

/** @category Modules/Types */
export interface SearchCommentsOptions extends TransformDataQueryToOptions<CommentsIndexData> {}
/** @category Modules/Types */
export interface CreateCommentOptions extends TransformDataBodyToOptions<CommentsCreateData> {}
/** @category Modules/Types */
export interface UpdateCommentOptions extends TransformDataBodyToOptions<CommentsUpdateData> {}
/** @category Modules/Types */
export interface CommentsWarningResponse extends GetResponse<CommentsWarningResponses, 200> {}

/** @category Modules */
export default class Comments extends Base {
    @OperationID("comments#create")
    async create(options: CreateCommentOptions): Promise<Comment> {
        return comments_create({
            client: this.client,
            body: options,
        }).then(res => this._handleResponse(res, 201, true, Comment));
    }

    @OperationID("comments#destroy")
    async delete(id: number): Promise<null> {
        return comments_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("comments#show")
    async get(id: number): Promise<Comment | null> {
        return comments_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, Comment));
    }

    @OperationID("comments#hide")
    async hide(id: number): Promise<Comment> {
        return comments_hide({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 201, true, Comment));
    }

    @OperationID("comments#warning")
    async mark(id: number, type: ExtractValue<"record_type", CommentsWarningData>): Promise<CommentsWarningResponse> {
        return comments_warning({
            client: this.client,
            path: { id },
            body: { record_type: type },
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("comments#index")
    async search(options?: SearchCommentsOptions): Promise<Array<Comment>> {
        return comments_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, Comment));
    }

    @OperationID("comments#unhide")
    async unhide(id: number): Promise<Comment> {
        return comments_unhide({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 201, true, Comment));
    }

    @OperationID("comments#update")
    async update(id: number, options: UpdateCommentOptions): Promise<null> {
        return comments_update({
            client: this.client,
            path: { id },
            body: options,
        }).then(res => this._handleResponse(res, 204, true));
    }
}
