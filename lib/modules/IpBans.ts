import { createIpBan, deleteIpBan, listIpBans } from "../generated/sdk.js";
import IpBan from "../models/IpBan.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions, type TransformDataBodyToOptions } from "../util.js";

import Base from "./Base.js";

import type { CreateIpBanData, ListIpBansData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreateIpBanOptions extends TransformDataBodyToOptions<CreateIpBanData> {}
/** @category Modules/Types */
export interface SearchIpBansOptions extends TransformDataQueryToOptions<ListIpBansData> {}

/** @category Modules */
export default class IpBans extends Base {
    @OperationID("createIpBan")
    async create(options: CreateIpBanOptions): Promise<IpBan> {
        return createIpBan({
            client: this.client,
            body: prefixKeys(options, "ip_ban"),
        }).then(res => this._handleResponse(res, 201, true, IpBan));
    }

    @OperationID("deleteIpBan")
    async delete(id: number): Promise<null> {
        return deleteIpBan({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("listIpBans")
    async search(options?: SearchIpBansOptions): Promise<Array<IpBan>> {
        return listIpBans({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, IpBan));
    }
}
