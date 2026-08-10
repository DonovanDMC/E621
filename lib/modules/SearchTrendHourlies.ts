import { searchTrendHourlies_index } from "../generated/sdk.js";
import SearchTrendHourly from "../models/SearchTrendHourly.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { SearchTrendHourliesIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface SearchSearchTrendHourliesOptions extends TransformDataQueryToOptions<SearchTrendHourliesIndexData> {}

/** @category Modules */
export default class SearchTrendHourlies extends Base {
    static readonly moduleKey = "searchTrendHourlies" as const;
    @OperationID("search_trend_hourlies#index")
    async search(options?: SearchSearchTrendHourliesOptions): Promise<Array<SearchTrendHourly>> {
        return searchTrendHourlies_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page", "hour"]),
        }).then(res => this._handleResponse(res, 200, true, SearchTrendHourly));
    }
}
