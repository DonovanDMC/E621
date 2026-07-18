import { appeals_claim, appeals_index, appeals_show, appeals_unclaim, appeals_update } from "../generated/sdk.js";
import Appeal from "../models/Appeal.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { AppealsIndexData, AppealsUpdateData } from "../generated/types.js";

/** @category Modules/Types */
export interface SearchAppealsOptions extends TransformDataQueryToOptions<AppealsIndexData> {}
/** @category Modules/Types */
export interface UpdateAppealOptions extends TransformDataBodyToOptions<AppealsUpdateData> {}

/** @category Modules */
export default class Appeals extends Base {
    @OperationID("appeals#claim")
    async claim(id: number): Promise<Appeal> {
        return appeals_claim({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 201, true, Appeal));
    }

    @OperationID("appeals#show")
    async get(id: number): Promise<Appeal | null> {
        return appeals_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, Appeal));
    }

    @OperationID("appeals#index")
    async search(options?: SearchAppealsOptions): Promise<Array<Appeal>> {
        return appeals_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then((res) => {
            // NOTE: the spec incorrectly references the "ApiKey" schema for this response - it is actually an array of Appeal.
            const data = this._handleResponse(res, 200, true) as unknown as Array<ConstructorParameters<typeof Appeal>[1]>;
            return data.map(appeal => new Appeal(this.e621, appeal));
        });
    }

    @OperationID("appeals#unclaim")
    async unclaim(id: number): Promise<Appeal> {
        return appeals_unclaim({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 201, true, Appeal));
    }

    @OperationID("appeals#update")
    async update(id: number, options: UpdateAppealOptions): Promise<null> {
        return appeals_update({
            client: this.client,
            path: { id },
            body: options,
        }).then(res => this._handleResponse(res, 204, true));
    }
}
