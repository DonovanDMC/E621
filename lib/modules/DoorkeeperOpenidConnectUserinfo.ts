import { doorkeeperOpenidConnectUserinfo_show } from "../generated/sdk.js";
import { GetResponse, OperationID } from "../util.js";

import Base from "./Base.js";

import type { DoorkeeperOpenidConnectUserinfoShowResponses } from "../generated/types.js";

/** @category Modules/Types */
export interface DoorkeeperOpenidConnectUserinfoShowResponse extends GetResponse<DoorkeeperOpenidConnectUserinfoShowResponses, 200> {}

/** @category Modules */
export default class DoorkeeperOpenidConnectUserinfo extends Base {
    static readonly moduleKey = "doorkeeperOpenidConnectUserinfo" as const;
    @OperationID("doorkeeper/openid_connect/userinfo#show")
    async get(): Promise<DoorkeeperOpenidConnectUserinfoShowResponse> {
        return doorkeeperOpenidConnectUserinfo_show({
            client: this.client,
        }).then(res => this._handleResponse(res, 200, true));
    }
}
