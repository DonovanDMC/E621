import Base from "./Base.js";
import {
    addPostsToPostSet,
    createPostSet,
    deletePostSet,
    editPostSet,
    getPostSet,
    listPostSetsForSelect,
    removePostsFromPostSet,
    searchPostSets,
    updatePostSetPosts
} from "../generated/sdk.js";
import type { CreatePostSetData, EditPostSetData, ListPostSetsForSelectResponses, SearchPostSetsData } from "../generated/types.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";
import PostSet from "../models/PostSet.js";

/** @category Modules/Types */
export interface CreatePostSetOptions extends TransformDataBodyToOptions<CreatePostSetData> {}
/** @category Modules/Types */
export interface EditPostSetOptions extends TransformDataBodyToOptions<EditPostSetData> {}
/** @category Modules/Types */
export interface SearchPostSetsOptions extends TransformDataQueryToOptions<SearchPostSetsData> {}

/** @category Modules */
export default class PostSets extends Base {
    @OperationID("addPostsToPostSet")
    async addPosts(id: number, post_ids: Array<number>): Promise<PostSet> {
        return addPostsToPostSet({
            client: this.client,
            path:   { id },
            body:   { post_ids }
        }).then(res => this._handleResponse(res, 201, true, PostSet));
    }

    @OperationID("createPostSet")
    async create(options: CreatePostSetOptions): Promise<PostSet> {
        return createPostSet({
            client: this.client,
            body:   prefixKeys(options, "post_set")
        }).then(res => this._handleResponse(res, 201, true, PostSet));
    }

    @OperationID("deletePostSet")
    async delete(id: number): Promise<null> {
        return deletePostSet({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("editPostSet")
    async edit(id: number, options: EditPostSetOptions): Promise<null> {
        return editPostSet({
            client: this.client,
            path:   { id },
            body:   prefixKeys(options, "post_set")
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("listPostSetsForSelect")
    async forSelect(): Promise<ListPostSetsForSelectResponses[200]> {
        return listPostSetsForSelect({
            client: this.client
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("getPostSet")
    async get(id: number): Promise<PostSet | null> {
        return getPostSet({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 200, false, PostSet));
    }

    @OperationID("removePostsFromPostSet")
    async removePosts(id: number, post_ids: Array<number>): Promise<PostSet> {
        return removePostsFromPostSet({
            client: this.client,
            path:   { id },
            body:   { post_ids }
        }).then(res => this._handleResponse(res, 201, true, PostSet));
    }

    @OperationID("searchPostSets")
    async search(options?: SearchPostSetsOptions): Promise<Array<PostSet>> {
        return searchPostSets({
            client: this.client,
            query:  prefixKeys(options, "search", ["limit", "page"])
        }).then(res => this._handleResponse(res, 200, true, PostSet));
    }

    @OperationID("updatePostSetPosts")
    async updatePosts(id: number, post_ids: Array<number>): Promise<PostSet> {
        return updatePostSetPosts({
            client: this.client,
            path:   { id },
            body:   { "post_set[post_ids_string]": post_ids.join(" ") }
        }).then(res => this._handleResponse(res, 200, true, PostSet));
    }
}
