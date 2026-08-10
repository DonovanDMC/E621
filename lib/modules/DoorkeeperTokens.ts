import { doorkeeperTokens_create, doorkeeperTokens_introspect, doorkeeperTokens_revoke } from "../generated/sdk.js";
import { GetResponse, OperationID, type TransformDataBodyToOptions } from "../util.js";

import Base from "./Base.js";

import type {
    DoorkeeperTokensCreateData,
    DoorkeeperTokensCreateResponses,
    DoorkeeperTokensIntrospectData,
    DoorkeeperTokensIntrospectResponses,
    DoorkeeperTokensRevokeData,
    DoorkeeperTokensRevokeResponses,
} from "../generated/types.js";

/** @category Modules/Types */
export interface CreateOAuthTokenOptions extends TransformDataBodyToOptions<DoorkeeperTokensCreateData> {}
/** @category Modules/Types */
export interface IntrospectOAuthTokenOptions extends TransformDataBodyToOptions<DoorkeeperTokensIntrospectData> {}
/** @category Modules/Types */
export interface RevokeOAuthTokenOptions extends TransformDataBodyToOptions<DoorkeeperTokensRevokeData> {}
/** @category Modules/Types */
export interface DoorkeeperTokensCreateResponse extends GetResponse<DoorkeeperTokensCreateResponses, 200> {}
/** @category Modules/Types */
export interface DoorkeeperTokensIntrospectResponse extends GetResponse<DoorkeeperTokensIntrospectResponses, 200> {}
/** @category Modules/Types */
export interface DoorkeeperTokensRevokeResponse extends GetResponse<DoorkeeperTokensRevokeResponses, 200> {}

/**
 * @category Modules
 *
 * OAuth 2.0 / OpenID Connect support is present in the spec but has not been publicly released on e621
 * yet - these endpoints are not yet available for use.
 */
export default class DoorkeeperTokens extends Base {
    static readonly moduleKey = "doorkeeperTokens" as const;
    @OperationID("doorkeeper/tokens#create")
    async create(options: CreateOAuthTokenOptions): Promise<DoorkeeperTokensCreateResponse> {
        return doorkeeperTokens_create({
            client: this.client,
            body: options,
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("doorkeeper/tokens#introspect")
    async introspect(options: IntrospectOAuthTokenOptions): Promise<DoorkeeperTokensIntrospectResponse> {
        return doorkeeperTokens_introspect({
            client: this.client,
            body: options,
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("doorkeeper/tokens#revoke")
    async revoke(options: RevokeOAuthTokenOptions): Promise<DoorkeeperTokensRevokeResponse> {
        return doorkeeperTokens_revoke({
            client: this.client,
            body: options,
        }).then(res => this._handleResponse(res, 200, true));
    }
}
