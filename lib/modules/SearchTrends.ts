import { searchTrends_clearCache, searchTrends_purge, searchTrends_rising, searchTrends_index, searchTrends_updateSettings, searchTrends_track } from "../generated/sdk.js";
import RisingSearchTrend from "../models/RisingSearchTrend.js";
import SearchTrend from "../models/SearchTrend.js";
import { GetResponse, OperationID, TransformDataBodyToOptions, TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type {
    SearchTrendsClearCacheResponses,
    SearchTrendsIndexData,
    SearchTrendsPurgeResponses,
    SearchTrendsUpdateSettingsData,
    SearchTrendsUpdateSettingsResponses,
    SearchTrendsTrackResponses,
} from "../generated/types.js";

/** @category Modules/Types */
export interface ListSearchTrendsOptions extends TransformDataQueryToOptions<SearchTrendsIndexData> {}
/** @category Modules/Types */
export interface UpdateSearchTrendsSettingsOptions extends TransformDataBodyToOptions<SearchTrendsUpdateSettingsData> {}
/** @category Modules/Types */
export interface SearchTrendsClearCacheResponse extends GetResponse<SearchTrendsClearCacheResponses, 200> {}
/** @category Modules/Types */
export interface SearchTrendsUpdateSettingsResponse extends GetResponse<SearchTrendsUpdateSettingsResponses, 200> {}
/** @category Modules/Types */
export interface SearchTrendsPurgeResponse extends GetResponse<SearchTrendsPurgeResponses, 200> {}
/** @category Modules/Types */
export interface SearchTrendsTrackResponse extends GetResponse<SearchTrendsTrackResponses, 200> {}

/** @category Modules */
export default class SearchTrends extends Base {
    static readonly moduleKey = "searchTrends" as const;
    @OperationID("search_trends#clear_cache")
    async clearCache(): Promise<SearchTrendsClearCacheResponse> {
        return searchTrends_clearCache({
            client: this.client,
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("search_trends#index")
    async list(options?: ListSearchTrendsOptions): Promise<Array<SearchTrend>> {
        return searchTrends_index({
            client: this.client,
            query: options,
        }).then(res => this._handleResponse(res, 200, true, SearchTrend));
    }

    @OperationID("search_trends#rising")
    async listRising(): Promise<Array<RisingSearchTrend>> {
        return searchTrends_rising({
            client: this.client,
        }).then(res => this._handleResponse(res, 200, true, RisingSearchTrend));
    }

    @OperationID("search_trends#purge")
    async purge(id: number): Promise<SearchTrendsPurgeResponse> {
        return searchTrends_purge({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("search_trends#track")
    async track(tag?: string): Promise<SearchTrendsTrackResponse> {
        return searchTrends_track({
            client: this.client,
            query: tag === undefined ? undefined : { tag },
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("search_trends#update_settings")
    async updateSettings(options: UpdateSearchTrendsSettingsOptions): Promise<SearchTrendsUpdateSettingsResponse> {
        return searchTrends_updateSettings({
            client: this.client,
            body: options,
        }).then(res => this._handleResponse(res, 200, true));
    }
}
