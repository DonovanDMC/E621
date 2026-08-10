import { staffUsers_anonymizeConfirm, staffUsers_update, staffUsers_altList, staffUsers_totpReset, staffUsers_updateBlacklist } from "../generated/sdk.js";
import { type StaffUsersUpdateData } from "../generated/types.js";
import { OperationID, type TransformDataBodyToOptions } from "../util.js";

import Base from "./Base.js";

/** @category Modules/Types */
export interface UpdateStaffUserOptions extends TransformDataBodyToOptions<StaffUsersUpdateData> {}

/** @category Modules */
export default class StaffUsers extends Base {
    static readonly moduleKey = "staffUsers" as const;
    @OperationID("staff/users#alt_list")
    async altList(): Promise<Array<[number, Array<number>]>> {
        return staffUsers_altList({
            client: this.client,
        }).then(res => this._handleResponse(res, 200, true)) as never;
    }

    @OperationID("staff/users#anonymize_confirm")
    async anonymize(id: number): Promise<string> {
        return staffUsers_anonymizeConfirm({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 302, true));
    }

    @OperationID("staff/users#totp_reset")
    async totpReset(id: number): Promise<string> {
        return staffUsers_totpReset({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 302, true));
    }

    @OperationID("staff/users#update")
    async update(id: number, options: UpdateStaffUserOptions): Promise<null> {
        return staffUsers_update({
            client: this.client,
            path: { id },
            body: options,
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("staff/users#update_blacklist")
    async updateBlacklist(id: number, blacklisted_tags: string): Promise<string> {
        return staffUsers_updateBlacklist({
            client: this.client,
            path: { id },
            body: { user: { blacklisted_tags } },
        }).then(res => this._handleResponse(res, 302, true));
    }
}
