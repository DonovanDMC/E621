import { ipBans_create, ipBans_destroy, ipBans_index } from "../generated/sdk.js";
import IpBan from "../models/IpBan.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions, type TransformDataBodyToOptions } from "../util.js";

import Base from "./Base.js";

import type { IpBansCreateData, IpBansIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreateIpBanOptions extends TransformDataBodyToOptions<IpBansCreateData> {}
/** @category Modules/Types */
export interface SearchIpBansOptions extends TransformDataQueryToOptions<IpBansIndexData> {}

/** @category Modules */
export default class IpBans extends Base {
    @OperationID("ip_bans#create")
    async create(options: CreateIpBanOptions): Promise<IpBan> {
        return ipBans_create({
            client: this.client,
            body: options,
        }).then(res => this._handleResponse(res, 201, true, IpBan));
    }

    @OperationID("ip_bans#destroy")
    async delete(id: number): Promise<null> {
        return ipBans_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("ip_bans#index")
    async search(options?: SearchIpBansOptions): Promise<Array<IpBan>> {
        return ipBans_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, IpBan));
    }
}
