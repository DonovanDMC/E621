import {
    postReplacements_approve,
    postReplacements_create,
    postReplacements_destroy,
    postReplacements_promote,
    postReplacements_reject,
    postReplacements_index,
    postReplacements_togglePenalize,
} from "../generated/sdk.js";
import {
    type PostReplacementsCreateResponses,
    type LegacyPost as LegacyPostData,
    type PostReplacementsIndexData,
    type PostReplacementsCreateData,
} from "../generated/types.js";
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
export interface CreatePostReplacementOptions extends TransformDataBodyToOptions<PostReplacementsCreateData> {}
/** @category Modules/Types */
export interface SearchPostReplacementsOptions extends TransformDataQueryToOptions<PostReplacementsIndexData> {}
/** @category Modules/Types */
export interface PostReplacementsCreateResponse extends GetResponse<PostReplacementsCreateResponses, 200> {}

/** @category Modules */
export default class PostReplacements extends Base {
    static readonly moduleKey = "postReplacements" as const;
    @OperationID("post_replacements#approve")
    async approve(id: number): Promise<null> {
        return postReplacements_approve({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("post_replacements#create")
    async create(options: CreatePostReplacementOptions): Promise<PostReplacementsCreateResponse> {
        return postReplacements_create({
            client: this.client,
            body: prefixKeys(options, "post_replacement"),
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("post_replacements#destroy")
    async delete(id: number): Promise<null> {
        return postReplacements_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("post_replacements#promote")
    async promote(id: number): Promise<Post> {
        return postReplacements_promote({
            client: this.client,
            path: { id },
        }).then((res) => {
            const data = this._handleResponse(res, 201, true);
            // NOTE: the spec still references the "Post" (v2 base) schema here, but this endpoint has no v2 param - the response is actually legacy-shaped.
            return new Post(this.e621, data.post as unknown as LegacyPostData);
        });
    }

    @OperationID("post_replacements#reject")
    async reject(id: number): Promise<null> {
        return postReplacements_reject({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("post_replacements#index")
    async search(options?: SearchPostReplacementsOptions): Promise<Array<PostReplacement>> {
        return postReplacements_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, PostReplacement));
    }

    @OperationID("post_replacements#toggle_penalize")
    async togglePenalize(id: number): Promise<null> {
        return postReplacements_togglePenalize({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }
}
