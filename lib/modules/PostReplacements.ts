import {
    approvePostReplacement,
    createPostReplacement,
    deletePostReplacement,
    promotePostReplacement,
    rejectPostReplacement,
    searchPostReplacements,
    togglePostReplacementPenalty,
} from "../generated/sdk.js";
import { type CreatePostReplacementResponses, type SearchPostReplacementsData, type CreatePostReplacementData } from "../generated/types.js";
import Post from "../models/Post.js";
import PostReplacement from "../models/PostReplacement.js";
import {
    GetResponse,
    OperationID,
    prefixKeys,
    type TransformDataBodyToOptions,
    type TransformDataQueryToOptions,
} from "../util.js";

import Base from "./Base.js";

/** @category Modules/Types */
export interface CreatePostReplacementOptions extends TransformDataBodyToOptions<CreatePostReplacementData> {}
/** @category Modules/Types */
export interface SearchPostReplacementsOptions extends TransformDataQueryToOptions<SearchPostReplacementsData> {}
/** @category Modules/Types */
export interface CreatePostReplacementResponse extends GetResponse<CreatePostReplacementResponses, 200> {}

/** @category Modules */
export default class PostReplacements extends Base {
    @OperationID("approvePostReplacement")
    async approve(id: number): Promise<null> {
        return approvePostReplacement({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("createPostReplacement")
    async create(options: CreatePostReplacementOptions): Promise<CreatePostReplacementResponse> {
        return createPostReplacement({
            client: this.client,
            body: prefixKeys(options, "post_replacement"),
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("deletePostReplacement")
    async delete(id: number): Promise<null> {
        return deletePostReplacement({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("promotePostReplacement")
    async promote(id: number): Promise<Post> {
        return promotePostReplacement({
            client: this.client,
            path: { id },
        }).then(res => new Post(this.e621, this._handleResponse(res, 201, true).post));
    }

    @OperationID("rejectPostReplacement")
    async reject(id: number): Promise<null> {
        return rejectPostReplacement({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("searchPostReplacements")
    async search(options?: SearchPostReplacementsOptions): Promise<Array<PostReplacement>> {
        return searchPostReplacements({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, PostReplacement));
    }

    @OperationID("togglePostReplacementPenalty")
    async togglePenalize(id: number): Promise<null> {
        return togglePostReplacementPenalty({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }
}
