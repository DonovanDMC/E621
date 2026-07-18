import { editHistories_show, editHistories_index } from "../generated/sdk.js";
import EditHistory from "../models/EditHistory.js";
import { OperationID, type ExtractValue, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { EditHistoriesShowData, EditHistoriesIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface SearchEditHistoriesOptions extends TransformDataQueryToOptions<EditHistoriesIndexData> {}

/** @category Modules */
export default class EditHistories extends Base {
    static readonly moduleKey = "editHistories" as const;
    @OperationID("edit_histories#show")
    async get(id: number, type: ExtractValue<"type", EditHistoriesShowData>): Promise<Array<EditHistory> | null> {
        return editHistories_show({
            client: this.client,
            path: { id },
            query: { type },
        }).then(res => this._handleResponse(res, 200, false, EditHistory));
    }

    @OperationID("edit_histories#index")
    async search(options?: SearchEditHistoriesOptions): Promise<Array<EditHistory>> {
        return editHistories_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, EditHistory));
    }
}
