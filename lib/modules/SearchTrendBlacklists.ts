import { searchTrendBlacklists_create, searchTrendBlacklists_destroy, searchTrendBlacklists_index, searchTrendBlacklists_update } from "../generated/sdk.js";
import SearchTrendBlacklist from "../models/SearchTrendBlacklist.js";
import { OperationID, TransformDataBodyToOptions, TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { SearchTrendBlacklistsCreateData, SearchTrendBlacklistsIndexData, SearchTrendBlacklistsUpdateData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreateSearchTrendBlacklistsOptions extends TransformDataBodyToOptions<SearchTrendBlacklistsCreateData> {}
/** @category Modules/Types */
export interface SearchSearchTrendBlacklistsOptions extends TransformDataQueryToOptions<SearchTrendBlacklistsIndexData> {}
/** @category Modules/Types */
export interface UpdateSearchTrendBlacklistOptions extends TransformDataBodyToOptions<SearchTrendBlacklistsUpdateData> {}

/** @category Modules */
export default class SearchTrendBlacklists extends Base {
    static readonly moduleKey = "searchTrendBlacklists" as const;
    @OperationID("search_trend_blacklists#create")
    async create(options: CreateSearchTrendBlacklistsOptions): Promise<SearchTrendBlacklist> {
        return searchTrendBlacklists_create({
            client: this.client,
            body: options,
        }).then(res => this._handleResponse(res, 200, true, SearchTrendBlacklist));
    }

    @OperationID("search_trend_blacklists#destroy")
    async delete(id: number): Promise<null> {
        return searchTrendBlacklists_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("search_trend_blacklists#index")
    async search(options?: SearchSearchTrendBlacklistsOptions): Promise<Array<SearchTrendBlacklist>> {
        return searchTrendBlacklists_index({
            client: this.client,
            query: options,
        }).then(res => this._handleResponse(res, 200, true, SearchTrendBlacklist));
    }

    @OperationID("search_trend_blacklists#update")
    async update(id: number, options: UpdateSearchTrendBlacklistOptions): Promise<null> {
        return searchTrendBlacklists_update({
            client: this.client,
            path: { id },
            body: options,
        }).then(res => this._handleResponse(res, 204, true));
    }
}
