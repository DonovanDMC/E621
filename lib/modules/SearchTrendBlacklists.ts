import Base from "./Base.js";
import { createSearchTrendBlacklist, deleteSearchTrendBlacklist, purgeSearchTrendBlacklist, searchSearchTrendBlacklists } from "../generated/sdk.js";
import type { CreateSearchTrendBlacklistData, PurgeSearchTrendBlacklistResponses, SearchSearchTrendBlacklistsData } from "../generated/types.js";
import { OperationID, TransformDataBodyToOptions, TransformDataQueryToOptions } from "../util.js";
import SearchTrendBlacklist from "../models/SearchTrendBlacklist.js";

/** @category Modules/Types */
export interface CreateSearchTrendBlacklistsOptions extends TransformDataBodyToOptions<CreateSearchTrendBlacklistData> {}
/** @category Modules/Types */
export interface SearchSearchTrendBlacklistsOptions extends TransformDataQueryToOptions<SearchSearchTrendBlacklistsData> {}

/** @category Modules */
export default class SearchTrendBlacklists extends Base {
    @OperationID("createSearchTrendBlacklist")
    async create(options: CreateSearchTrendBlacklistsOptions): Promise<SearchTrendBlacklist> {
        return createSearchTrendBlacklist({
            client: this.client,
            body:   options
        }).then(res => this._handleResponse(res, 200, true, SearchTrendBlacklist));
    }

    @OperationID("deleteSearchTrendBlacklist")
    async delete(id: number): Promise<null> {
        return deleteSearchTrendBlacklist({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("purgeSearchTrendBlacklist")
    async purge(id: number): Promise<PurgeSearchTrendBlacklistResponses[200]> {
        return purgeSearchTrendBlacklist({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("searchSearchTrendBlacklists")
    async search(options?: SearchSearchTrendBlacklistsOptions): Promise<Array<SearchTrendBlacklist>> {
        return searchSearchTrendBlacklists({
            client: this.client,
            query:  options
        }).then(res => this._handleResponse(res, 200, true, SearchTrendBlacklist));
    }
}
