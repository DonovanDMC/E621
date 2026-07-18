import {
    postSets_addPosts,
    postSets_create,
    postSets_destroy,
    postSets_update,
    postSets_show,
    postSets_forSelect,
    postSets_removePosts,
    postSets_index,
    postSets_updatePosts,
} from "../generated/sdk.js";
import PostSet from "../models/PostSet.js";
import {
    GetResponse,
    OperationID,
    prefixKeys,
    type TransformDataBodyToOptions,
    type TransformDataQueryToOptions,
} from "../util.js";

import Base from "./Base.js";

import type { PostSetsCreateData, PostSetsUpdateData, PostSetsForSelectResponses, PostSetsIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreatePostSetOptions extends TransformDataBodyToOptions<PostSetsCreateData> {}
/** @category Modules/Types */
export interface UpdatePostSetOptions extends TransformDataBodyToOptions<PostSetsUpdateData> {}
/** @category Modules/Types */
export interface SearchPostSetsOptions extends TransformDataQueryToOptions<PostSetsIndexData> {}
/** @category Modules/Types */
export interface PostSetsForSelectResponse extends GetResponse<PostSetsForSelectResponses, 200> {}

/** @category Modules */
export default class PostSets extends Base {
    static readonly moduleKey = "postSets" as const;
    @OperationID("post_sets#add_posts")
    async addPosts(id: number, post_ids: Array<number>): Promise<PostSet> {
        return postSets_addPosts({
            client: this.client,
            path: { id },
            body: { post_ids },
        }).then(res => this._handleResponse(res, 201, true, PostSet));
    }

    @OperationID("post_sets#create")
    async create(options: CreatePostSetOptions): Promise<PostSet> {
        return postSets_create({
            client: this.client,
            body: options,
        }).then(res => this._handleResponse(res, 201, true, PostSet));
    }

    @OperationID("post_sets#destroy")
    async delete(id: number): Promise<null> {
        return postSets_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("post_sets#for_select")
    async forSelect(): Promise<PostSetsForSelectResponse> {
        return postSets_forSelect({
            client: this.client,
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("post_sets#show")
    async get(id: number): Promise<PostSet | null> {
        return postSets_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, PostSet));
    }

    @OperationID("post_sets#remove_posts")
    async removePosts(id: number, post_ids: Array<number>): Promise<PostSet> {
        return postSets_removePosts({
            client: this.client,
            path: { id },
            body: { post_ids },
        }).then(res => this._handleResponse(res, 201, true, PostSet));
    }

    @OperationID("post_sets#index")
    async search(options?: SearchPostSetsOptions): Promise<Array<PostSet>> {
        return postSets_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, PostSet));
    }

    @OperationID("post_sets#update")
    async update(id: number, options: UpdatePostSetOptions): Promise<null> {
        return postSets_update({
            client: this.client,
            path: { id },
            body: options,
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("post_sets#update_posts")
    async updatePosts(id: number, post_ids: Array<number>): Promise<PostSet> {
        return postSets_updatePosts({
            client: this.client,
            path: { id },
            body: { post_ids_string: post_ids.join(" ") },
        }).then(res => this._handleResponse(res, 200, true, PostSet));
    }
}
