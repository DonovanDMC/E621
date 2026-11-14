import { doorkeeperOpenidConnectUserinfo_show } from "e621-openapi/sdk";

import { GetResponse, OperationID } from "../util.js";

import Base from "./Base.js";

import type { DoorkeeperOpenidConnectUserinfoShowResponses } from "e621-openapi/types";

/** @category Modules/Types */
export interface DoorkeeperOpenidConnectUserinfoShowResponse extends GetResponse<DoorkeeperOpenidConnectUserinfoShowResponses, 200> {}

/**
 * @category Modules
 *
 * OAuth 2.0 / OpenID Connect support is present in the spec but has not been publicly released on e621
 * yet - these endpoints are not yet available for use.
 */
export default class DoorkeeperOpenidConnectUserinfo extends Base {
    static readonly moduleKey = "doorkeeperOpenidConnectUserinfo" as const;
    @OperationID("doorkeeper/openid_connect/userinfo#show")
    async get(): Promise<DoorkeeperOpenidConnectUserinfoShowResponse> {
        return doorkeeperOpenidConnectUserinfo_show({
            client: this.client,
        }).then(res => this._handleResponse(res, 200, true));
    }
}
