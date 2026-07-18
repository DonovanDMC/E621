import { mascots_create, mascots_destroy, mascots_update, mascots_index } from "../generated/sdk.js";
import Mascot from "../models/Mascot.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { MascotsCreateData, MascotsUpdateData, MascotsIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreateMascotOptions extends TransformDataBodyToOptions<MascotsCreateData> {}
/** @category Modules/Types */
export interface UpdateMascotOptions extends TransformDataBodyToOptions<MascotsUpdateData> {}
/** @category Modules/Types */
export interface SearchMascotsOptions extends TransformDataQueryToOptions<MascotsIndexData> {}

/** @category Modules */
export default class Mascots extends Base {
    static readonly moduleKey = "mascots" as const;
    @OperationID("mascots#create")
    async create(options: CreateMascotOptions): Promise<Mascot> {
        return mascots_create({
            client: this.client,
            body: prefixKeys(options, "mascot"),
        }).then(res => this._handleResponse(res, 201, true, Mascot));
    }

    @OperationID("mascots#destroy")
    async delete(id: number): Promise<null> {
        return mascots_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("mascots#index")
    async search(options?: SearchMascotsOptions): Promise<Array<Mascot>> {
        return mascots_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, Mascot));
    }

    @OperationID("mascots#update")
    async update(id: number, options: UpdateMascotOptions): Promise<null> {
        return mascots_update({
            client: this.client,
            path: { id },
            body: prefixKeys(options, "mascot"),
        }).then(res => this._handleResponse(res, 204, true));
    }
}
