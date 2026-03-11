import Base from "./Base.js";
import { getEditHistory, searchEditHistories } from "../generated/sdk.js";
import type { GetEditHistoryData, SearchEditHistoriesData } from "../generated/types.js";
import { OperationID, type ExtractValue, prefixKeys, type TransformDataQueryToOptions } from "../util.js";
import EditHistory from "../models/EditHistory.js";

/** @category Modules/Types */
export interface SearchEditHistoriesOptions extends TransformDataQueryToOptions<SearchEditHistoriesData> {}

/** @category Modules */
export default class EditHistories extends Base {
    @OperationID("getEditHistory")
    async get(id: number, type: ExtractValue<"type", GetEditHistoryData>): Promise<Array<EditHistory> | null> {
        return getEditHistory({
            client: this.client,
            path:   { id },
            query:  { type }
        }).then(res => this._handleResponse(res, 200, false, EditHistory));
    }

    @OperationID("searchEditHistories")
    async search(options?: SearchEditHistoriesOptions): Promise<Array<EditHistory>> {
        return searchEditHistories({
            client: this.client,
            query:  prefixKeys(options, "search", ["limit", "page"])
        }).then(res => this._handleResponse(res, 200, true, EditHistory));
    }
}
