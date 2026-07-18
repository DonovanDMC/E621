import { modActions_show, modActions_index } from "../generated/sdk.js";
import ModAction from "../models/ModAction.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { ModActionsIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface SearchModActionsOptions extends TransformDataQueryToOptions<ModActionsIndexData> {}

/** @category Modules */
export default class ModActions extends Base {
    @OperationID("mod_actions#show")
    async get(id: number): Promise<ModAction | null> {
        return modActions_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, ModAction));
    }

    @OperationID("mod_actions#index")
    async search(options?: SearchModActionsOptions): Promise<Array<ModAction>> {
        return modActions_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, ModAction));
    }
}
