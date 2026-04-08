import {
    addPostToPool,
    createPool,
    deletePool,
    editPool,
    getPool,
    getRecentPools,
    removePostFromPool,
    revertPool,
    searchPools,
} from "../generated/sdk.js";
import Pool from "../models/Pool.js";
import {
    GetResponse,
    OperationID,
    prefixKeys,
    type TransformDataBodyToOptions,
    type TransformDataQueryToOptions,
} from "../util.js";

import Base from "./Base.js";

import type { CreatePoolData, EditPoolData, GetRecentPoolsResponses, SearchPoolsData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreatePoolOptions extends TransformDataBodyToOptions<CreatePoolData> {}
/** @category Modules/Types */
export interface EditPoolOptions extends TransformDataBodyToOptions<EditPoolData> {}
/** @category Modules/Types */
export interface SearchPoolsOptions extends TransformDataQueryToOptions<SearchPoolsData> {}
/** @category Modules/Types */
export interface GetRecentPoolsResponse extends GetResponse<GetRecentPoolsResponses, 200> {}

/** @category Modules */
export default class Pools extends Base {
    @OperationID("addPostToPool")
    async addPost(pool_id: number, post_id: number): Promise<Pool> {
        return addPostToPool({
            client: this.client,
            body: { pool_id, post_id },
        }).then(res => this._handleResponse(res, 201, true, Pool));
    }

    @OperationID("createPool")
    async create(options: CreatePoolOptions): Promise<Pool> {
        return createPool({
            client: this.client,
            body: prefixKeys(options, "pool"),
        }).then(res => this._handleResponse(res, 201, true, Pool));
    }

    @OperationID("deletePool")
    async delete(id: number): Promise<null> {
        return deletePool({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("editPool")
    async edit(id: number, options: EditPoolOptions): Promise<null> {
        return editPool({
            client: this.client,
            path: { id },
            body: prefixKeys(options, "pool"),
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("getPool")
    async get(id: number): Promise<Pool | null> {
        return getPool({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, Pool));
    }

    @OperationID("getRecentPools")
    async getRecent(): Promise<GetRecentPoolsResponse> {
        return getRecentPools({
            client: this.client,
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("removePostFromPool")
    async removePost(pool_id: number, post_id: number): Promise<null> {
        return removePostFromPool({
            client: this.client,
            body: { pool_id, post_id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("revertPool")
    async revert(id: number, version_id: number): Promise<null> {
        return revertPool({
            client: this.client,
            path: { id },
            query: { version_id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("searchPools")
    async search(options?: SearchPoolsOptions): Promise<Array<Pool>> {
        return searchPools({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, Pool));
    }
}
