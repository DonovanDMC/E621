import { createMascot, deleteMascot, editMascot, searchMascots } from "../generated/sdk.js";
import Mascot from "../models/Mascot.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { CreateMascotData, EditMascotData, SearchMascotsData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreateMascotOptions extends TransformDataBodyToOptions<CreateMascotData> {}
/** @category Modules/Types */
export interface EditMascotOptions extends TransformDataBodyToOptions<EditMascotData> {}
/** @category Modules/Types */
export interface SearchMascotsOptions extends TransformDataQueryToOptions<SearchMascotsData> {}

/** @category Modules */
export default class Mascots extends Base {
    @OperationID("createMascot")
    async create(options: CreateMascotOptions): Promise<Mascot> {
        return createMascot({
            client: this.client,
            body: prefixKeys(options, "mascot"),
        }).then(res => this._handleResponse(res, 201, true, Mascot));
    }

    @OperationID("deleteMascot")
    async delete(id: number): Promise<null> {
        return deleteMascot({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("editMascot")
    async edit(id: number, options: EditMascotOptions): Promise<null> {
        return editMascot({
            client: this.client,
            path: { id },
            body: prefixKeys(options, "mascot"),
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("searchMascots")
    async search(options?: SearchMascotsOptions): Promise<Array<Mascot>> {
        return searchMascots({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, Mascot));
    }
}
