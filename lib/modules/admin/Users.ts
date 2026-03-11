import { adminAnonymizeUser, adminEditUser, getAltList } from "../../generated/sdk.js";
import { type AdminEditUserData, type GetAltListResponses } from "../../generated/types.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions } from "../../util.js";
import Base from "../Base.js";

/** @category Modules/Types */
export interface AdminEditUserOptions extends TransformDataBodyToOptions<AdminEditUserData> {}

/** @category Modules */
export default class AdminUsers extends Base {
    @OperationID("getAltList")
    async altList(): Promise<GetAltListResponses[200]> {
        return getAltList({
            client: this.client
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("adminAnonymizeUser")
    async anonymize(id: number): Promise<unknown> {
        return adminAnonymizeUser({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("adminEditUser")
    async edit(id: number, options: AdminEditUserOptions): Promise<null> {
        return adminEditUser({
            client: this.client,
            path:   { id },
            body:   prefixKeys(options, "user")
        }).then(res => this._handleResponse(res, 204, true));
    }
}
