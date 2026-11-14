import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { SearchTrendsPurgeResponse } from "../modules/SearchTrends.js";
import type { SearchTrendBlacklist as SearchTrendBlacklistData } from "e621-openapi/types";

interface SearchTrendBlacklist extends SearchTrendBlacklistData {}
/** @category Models */
@Schema("SearchTrendBlacklist")
class SearchTrendBlacklist extends Base<SearchTrendBlacklistData> {
    @OperationID("search_trend_blacklists#destroy")
    async delete(): Promise<null> {
        return this.e621.searchTrendBlacklists.delete(this.id);
    }

    @OperationID("search_trends#purge")
    async purge(): Promise<SearchTrendsPurgeResponse> {
        return this.e621.searchTrends.purge(this.id);
    }
}

export default SearchTrendBlacklist;
