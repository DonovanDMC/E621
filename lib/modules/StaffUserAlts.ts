import { staffUserAlts_show } from "../generated/sdk.js";
import UserAlt from "../models/UserAlt.js";
import { OperationID } from "../util.js";

import Base from "./Base.js";

/** @category Modules */
export default class StaffUserAlts extends Base {
    static readonly moduleKey = "staffUserAlts" as const;
    @OperationID("staff/user_alts#show")
    async get(user_id: number): Promise<Array<UserAlt>> {
        return staffUserAlts_show({
            client: this.client,
            query: { user_id },
        }).then(res => this._handleResponse(res, 200, true, UserAlt));
    }
}
