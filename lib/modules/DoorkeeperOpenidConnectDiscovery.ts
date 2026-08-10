import { doorkeeperOpenidConnectDiscovery_keys, doorkeeperOpenidConnectDiscovery_provider } from "../generated/sdk.js";
import { GetResponse, OperationID } from "../util.js";

import Base from "./Base.js";

import type { DoorkeeperOpenidConnectDiscoveryKeysResponses, DoorkeeperOpenidConnectDiscoveryProviderResponses } from "../generated/types.js";

/** @category Modules/Types */
export interface DoorkeeperOpenidConnectDiscoveryKeysResponse extends GetResponse<DoorkeeperOpenidConnectDiscoveryKeysResponses, 200> {}
/** @category Modules/Types */
export interface DoorkeeperOpenidConnectDiscoveryProviderResponse extends GetResponse<DoorkeeperOpenidConnectDiscoveryProviderResponses, 200> {}

/**
 * @category Modules
 *
 * OAuth 2.0 / OpenID Connect support is present in the spec but has not been publicly released on e621
 * yet - these endpoints are not yet available for use.
 */
export default class DoorkeeperOpenidConnectDiscovery extends Base {
    static readonly moduleKey = "doorkeeperOpenidConnectDiscovery" as const;
    @OperationID("doorkeeper/openid_connect/discovery#keys")
    async keys(): Promise<DoorkeeperOpenidConnectDiscoveryKeysResponse> {
        return doorkeeperOpenidConnectDiscovery_keys({
            client: this.client,
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("doorkeeper/openid_connect/discovery#provider")
    async provider(): Promise<DoorkeeperOpenidConnectDiscoveryProviderResponse> {
        return doorkeeperOpenidConnectDiscovery_provider({
            client: this.client,
        }).then(res => this._handleResponse(res, 200, true));
    }
}
