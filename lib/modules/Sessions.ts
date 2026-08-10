import { sessions_create, sessions_destroy, sessions_verifyTotp } from "../generated/sdk.js";
import { GetResponse, OperationID, prefixKeys, type TransformDataBodyToOptions } from "../util.js";

import Base from "./Base.js";

import type { SessionsCreateData, SessionsCreateResponses, SessionsVerifyTotpData, SessionsVerifyTotpResponses } from "../generated/types.js";

/** @category Modules/Types */
export interface LoginOptions extends TransformDataBodyToOptions<SessionsCreateData> {}
/** @category Modules/Types */
export interface VerifyTotpOptions extends TransformDataBodyToOptions<SessionsVerifyTotpData> {}
/** @category Modules/Types */
export interface SessionsCreateResponse extends GetResponse<SessionsCreateResponses, 200> {}
/** @category Modules/Types */
export interface SessionsVerifyTotpResponse extends GetResponse<SessionsVerifyTotpResponses, 200> {}

/** @category Modules */
export default class Sessions extends Base {
    static readonly moduleKey = "sessions" as const;
    @OperationID("sessions#create")
    async create(options: LoginOptions): Promise<SessionsCreateResponse> {
        return sessions_create({
            client: this.client,
            body: prefixKeys(options, "session", ["authenticity_token"]),
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("sessions#destroy")
    async destroy(authenticity_token: string): Promise<string> {
        return sessions_destroy({
            client: this.client,
            body: { authenticity_token },
        }).then(res => this._handleResponse(res, 302, true));
    }

    @OperationID("sessions#verify_totp")
    async verifyTotp(options: VerifyTotpOptions): Promise<SessionsVerifyTotpResponse> {
        return sessions_verifyTotp({
            client: this.client,
            body: prefixKeys(options, "totp", ["authenticity_token"]),
        }).then(res => this._handleResponse(res, 200, true));
    }
}
