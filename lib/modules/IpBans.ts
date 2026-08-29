import { ipBans_create, ipBans_destroy, ipBans_index } from "../generated/sdk.js";
import IPBan from "../models/IPBan.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions, type TransformDataBodyToOptions } from "../util.js";

import Base from "./Base.js";

import type { IpBansCreateData, IpBansIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreateIpBanOptions extends TransformDataBodyToOptions<IpBansCreateData> {}
/** @category Modules/Types */
export interface SearchIpBansOptions extends TransformDataQueryToOptions<IpBansIndexData> {}

/** @category Modules */
export default class IpBans extends Base {
    static readonly moduleKey = "ipBans" as const;
    @OperationID("ip_bans#create")
    async create(options: CreateIpBanOptions): Promise<IPBan> {
        return ipBans_create({
            client: this.client,
            body: prefixKeys(options, "ip_ban"),
        }).then(res => this._handleResponse(res, 201, true, IPBan));
    }

    @OperationID("ip_bans#destroy")
    async delete(id: number): Promise<null> {
        return ipBans_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("ip_bans#index")
    async search(options?: SearchIpBansOptions): Promise<Array<IPBan>> {
        return ipBans_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, IPBan));
    }
}
