import { doorkeeperTokenInfo_show } from "../generated/sdk.js";
import { GetResponse, OperationID } from "../util.js";

import Base from "./Base.js";

import type { DoorkeeperTokenInfoShowResponses } from "../generated/types.js";

/** @category Modules/Types */
export interface DoorkeeperTokenInfoShowResponse extends GetResponse<DoorkeeperTokenInfoShowResponses, 200> {}

/** @category Modules */
export default class DoorkeeperTokenInfo extends Base {
    static readonly moduleKey = "doorkeeperTokenInfo" as const;
    @OperationID("doorkeeper/token_info#show")
    async get(): Promise<DoorkeeperTokenInfoShowResponse> {
        return doorkeeperTokenInfo_show({
            client: this.client,
        }).then(res => this._handleResponse(res, 200, true));
    }
}
