import Base from "./Base.js";
import { clearSearchTrendsCache, listRisingSearchTrends, listSearchTrends, updateSearchTrendsSettings } from "../generated/sdk.js";
import type { ClearSearchTrendsCacheResponses, UpdateSearchTrendsSettingsData, UpdateSearchTrendsSettingsResponses } from "../generated/types.js";
import { GetResponse, OperationID, TransformDataBodyToOptions } from "../util.js";
import SearchTrend from "../models/SearchTrend.js";
import RisingSearchTrend from "../models/RisingSearchTrend.js";

/** @category Modules/Types */
export interface UpdateSearchTrendsSettingsOptions extends TransformDataBodyToOptions<UpdateSearchTrendsSettingsData> {}
/** @category Modules/Types */
export interface ClearSearchTrendsCacheResponse extends GetResponse<ClearSearchTrendsCacheResponses, 200> {}
/** @category Modules/Types */
export interface UpdateSearchTrendsSettingsResponse extends GetResponse<UpdateSearchTrendsSettingsResponses, 200> {}

/** @category Modules */
export default class SearchTrends extends Base {
    @OperationID("clearSearchTrendsCache")
    async clearCache(): Promise<ClearSearchTrendsCacheResponse> {
        return clearSearchTrendsCache({
            client: this.client
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("listSearchTrends")
    async list(day?: string): Promise<Array<SearchTrend>> {
        return listSearchTrends({
            client: this.client,
            query:  { day }
        }).then(res => this._handleResponse(res, 200, true, SearchTrend));
    }

    @OperationID("listRisingSearchTrends")
    async listRising(): Promise<Array<RisingSearchTrend>> {
        return listRisingSearchTrends({
            client: this.client
        }).then(res => this._handleResponse(res, 200, true, RisingSearchTrend));
    }

    @OperationID("updateSearchTrendsSettings")
    async updateSettings(options: UpdateSearchTrendsSettingsOptions): Promise<UpdateSearchTrendsSettingsResponse> {
        return updateSearchTrendsSettings({
            client: this.client,
            body:   options
        }).then(res => this._handleResponse(res, 200, true));
    }
}
