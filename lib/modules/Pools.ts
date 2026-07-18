import {
    poolElements_create,
    pools_create,
    pools_destroy,
    pools_update,
    pools_show,
    poolElements_recent,
    poolElements_destroy,
    pools_revert,
    pools_index,
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

import type { PoolsCreateData, PoolsUpdateData, PoolElementsRecentResponses, PoolsIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreatePoolOptions extends TransformDataBodyToOptions<PoolsCreateData> {}
/** @category Modules/Types */
export interface UpdatePoolOptions extends TransformDataBodyToOptions<PoolsUpdateData> {}
/** @category Modules/Types */
export interface SearchPoolsOptions extends TransformDataQueryToOptions<PoolsIndexData> {}
/** @category Modules/Types */
export interface PoolElementsRecentResponse extends GetResponse<PoolElementsRecentResponses, 200> {}

/** @category Modules */
export default class Pools extends Base {
    @OperationID("pool_elements#create")
    async addPost(pool_id: number, post_id: number): Promise<Pool> {
        return poolElements_create({
            client: this.client,
            body: { pool_id, post_id },
        }).then(res => this._handleResponse(res, 201, true, Pool));
    }

    @OperationID("pools#create")
    async create(options: CreatePoolOptions): Promise<Pool> {
        return pools_create({
            client: this.client,
            body: options,
        }).then(res => this._handleResponse(res, 201, true, Pool));
    }

    @OperationID("pools#destroy")
    async delete(id: number): Promise<null> {
        return pools_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("pools#show")
    async get(id: number): Promise<Pool | null> {
        return pools_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, Pool));
    }

    @OperationID("pool_elements#recent")
    async getRecent(): Promise<PoolElementsRecentResponse> {
        return poolElements_recent({
            client: this.client,
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("pool_elements#destroy")
    async removePost(pool_id: number, post_id: number): Promise<null> {
        return poolElements_destroy({
            client: this.client,
            body: { pool_id, post_id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("pools#revert")
    async revert(id: number, version_id: number): Promise<null> {
        return pools_revert({
            client: this.client,
            path: { id },
            query: { version_id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("pools#index")
    async search(options?: SearchPoolsOptions): Promise<Array<Pool>> {
        return pools_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, Pool));
    }

    @OperationID("pools#update")
    async update(id: number, options: UpdatePoolOptions): Promise<null> {
        return pools_update({
            client: this.client,
            path: { id },
            body: options,
        }).then(res => this._handleResponse(res, 204, true));
    }
}
