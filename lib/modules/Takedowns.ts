import {
    takedowns_addByIds,
    takedowns_addByTags,
    takedowns_countMatchingPosts,
    takedowns_create,
    takedowns_destroy,
    takedowns_update,
    takedowns_show,
    takedowns_removeByIds,
    takedowns_index,
} from "../generated/sdk.js";
import Takedown from "../models/Takedown.js";
import {
    GetResponse,
    OperationID,
    prefixKeys,
    type TransformDataBodyToOptions,
    type TransformDataQueryToOptions,
} from "../util.js";

import Base from "./Base.js";

import type {
    TakedownsAddByIdsResponses,
    TakedownsAddByTagsResponses,
    TakedownsCountMatchingPostsResponses,
    TakedownsCreateData,
    TakedownsUpdateData,
    TakedownsIndexData,
} from "../generated/types.js";

/** @category Modules/Types */
export interface CreateTakedownOptions extends TransformDataBodyToOptions<TakedownsCreateData> {}
/** @category Modules/Types */
export interface UpdateTakedownOptions extends TransformDataBodyToOptions<TakedownsUpdateData> {}
/** @category Modules/Types */
export interface SearchTakedownsOptions extends TransformDataQueryToOptions<TakedownsIndexData> {}
/** @category Modules/Types */
export interface TakedownsAddByIdsResponse extends GetResponse<TakedownsAddByIdsResponses, 200> {}
/** @category Modules/Types */
export interface TakedownsAddByTagsResponse extends GetResponse<TakedownsAddByTagsResponses, 200> {}
/** @category Modules/Types */
export interface TakedownsCountMatchingPostsResponse extends GetResponse<TakedownsCountMatchingPostsResponses, 200> {}

/** @category Modules */
export default class Takedowns extends Base {
    static readonly moduleKey = "takedowns" as const;
    @OperationID("takedowns#add_by_ids")
    async addByIds(id: number, post_ids: Array<number>): Promise<TakedownsAddByIdsResponse> {
        return takedowns_addByIds({
            client: this.client,
            path: { id },
            body: { post_ids: post_ids.join(" ") },
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("takedowns#add_by_tags")
    async addByTags(id: number, tags: Array<string>): Promise<TakedownsAddByTagsResponse> {
        return takedowns_addByTags({
            client: this.client,
            path: { id },
            body: { post_tags: tags.join(" ") },
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("takedowns#count_matching_posts")
    async countMatchingPosts(id: number, tags: string): Promise<TakedownsCountMatchingPostsResponse> {
        return takedowns_countMatchingPosts({
            client: this.client,
            path: { id },
            body: { post_tags: tags },
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("takedowns#create")
    async create(options: CreateTakedownOptions): Promise<Takedown> {
        return takedowns_create({
            client: this.client,
            body: options,
        }).then(res => this._handleResponse(res, 201, true, Takedown));
    }

    @OperationID("takedowns#destroy")
    async delete(id: number): Promise<null> {
        return takedowns_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("takedowns#show")
    async get(id: number): Promise<Takedown | null> {
        return takedowns_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, Takedown));
    }

    @OperationID("takedowns#remove_by_ids")
    async removeByIds(id: number, post_ids: Array<number>): Promise<null> {
        return takedowns_removeByIds({
            client: this.client,
            path: { id },
            body: { post_ids: post_ids.join(" ") },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("takedowns#index")
    async search(options?: SearchTakedownsOptions): Promise<Array<Takedown>> {
        return takedowns_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, Takedown));
    }

    @OperationID("takedowns#update")
    async update(id: number, options: UpdateTakedownOptions): Promise<null> {
        return takedowns_update({
            client: this.client,
            path: { id },
            body: options,
        }).then(res => this._handleResponse(res, 204, true));
    }
}
