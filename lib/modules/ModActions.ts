import Base from "./Base.js";
import { getModAction, searchModActions } from "../generated/sdk.js";
import type { SearchModActionsData } from "../generated/types.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";
import ModAction from "../models/ModAction.js";

/** @category Modules/Types */
export interface SearchModActionsOptions extends TransformDataQueryToOptions<SearchModActionsData> {}

/** @category Modules */
export default class ModActions extends Base {
    @OperationID("getModAction")
    async get(id: number): Promise<ModAction | null> {
        return getModAction({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 200, false, ModAction));
    }

    @OperationID("searchModActions")
    async search(options?: SearchModActionsOptions): Promise<Array<ModAction>> {
        return searchModActions({
            client: this.client,
            query:  prefixKeys(options, "search", ["limit", "page"])
        }).then(res => this._handleResponse(res, 200, true, ModAction));
    }
}
