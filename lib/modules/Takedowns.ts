import Base from "./Base.js";
import {
    addPostsToTakedownByIds,
    addPostsToTakedownByTags,
    countMatchingPosts,
    createTakedown,
    deleteTakedown,
    editTakedown,
    getTakedown,
    removePostsFromTakedownByIds,
    searchTakedowns
} from "../generated/sdk.js";
import type {
    AddPostsToTakedownByIdsResponses,
    AddPostsToTakedownByTagsResponses,
    CountMatchingPostsResponses,
    CreateTakedownData,
    EditTakedownData,
    SearchTakedownsData
} from "../generated/types.js";
import {
    GetResponse,
    OperationID,
    prefixKeys,
    type TransformDataBodyToOptions,
    type TransformDataQueryToOptions
} from "../util.js";
import Takedown from "../models/Takedown.js";

/** @category Modules/Types */
export interface CreateTakedownOptions extends TransformDataBodyToOptions<CreateTakedownData> {}
/** @category Modules/Types */
export interface EditTakedownOptions extends TransformDataBodyToOptions<EditTakedownData> {}
/** @category Modules/Types */
export interface SearchTakedownsOptions extends TransformDataQueryToOptions<SearchTakedownsData> {}
/** @category Modules/Types */
export interface AddPostsToTakedownByIdsResponse extends GetResponse<AddPostsToTakedownByIdsResponses, 200> {}
/** @category Modules/Types */
export interface AddPostsToTakedownByTagsResponse extends GetResponse<AddPostsToTakedownByTagsResponses, 200> {}
/** @category Modules/Types */
export interface CountMatchingPostsResponse extends GetResponse<CountMatchingPostsResponses, 200> {}

/** @category Modules */
export default class Takedowns extends Base {
    @OperationID("addPostsToTakedownByIds")
    async addByIds(id: number, post_ids: Array<number>): Promise<AddPostsToTakedownByIdsResponse> {
        return addPostsToTakedownByIds({
            client: this.client,
            path:   { id },
            body:   { post_ids: post_ids.join(" ") }
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("addPostsToTakedownByTags")
    async addByTags(id: number, tags: Array<string>): Promise<AddPostsToTakedownByTagsResponse> {
        return addPostsToTakedownByTags({
            client: this.client,
            path:   { id },
            body:   { post_tags: tags.join(" ") }
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("countMatchingPosts")
    async countMatchingPosts(id: number, tags: string): Promise<CountMatchingPostsResponse> {
        return countMatchingPosts({
            client: this.client,
            path:   { id },
            body:   { post_tags: tags }
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("createTakedown")
    async create(options: CreateTakedownOptions): Promise<Takedown> {
        return createTakedown({
            client: this.client,
            body:   prefixKeys(options, "takedown")
        }).then(res => this._handleResponse(res, 201, true, Takedown));
    }

    @OperationID("deleteTakedown")
    async delete(id: number): Promise<null> {
        return deleteTakedown({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("editTakedown")
    async edit(id: number, options: EditTakedownOptions): Promise<null> {
        return editTakedown({
            client: this.client,
            path:   { id },
            body:   prefixKeys(options, "takedown")
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("getTakedown")
    async get(id: number): Promise<Takedown | null> {
        return getTakedown({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 200, false, Takedown));
    }

    @OperationID("removePostsFromTakedownByIds")
    async removeByIds(id: number, post_ids: Array<number>): Promise<null> {
        return removePostsFromTakedownByIds({
            client: this.client,
            path:   { id },
            body:   { post_ids: post_ids.join(" ") }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("searchTakedowns")
    async search(options?: SearchTakedownsOptions): Promise<Array<Takedown>> {
        return searchTakedowns({
            client: this.client,
            query:  prefixKeys(options, "search", ["limit", "page"])
        }).then(res => this._handleResponse(res, 200, true, Takedown));
    }
}
