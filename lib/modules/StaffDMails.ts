import { staffDmails_show, staffDmails_index } from "../generated/sdk.js";
import DMail from "../models/DMail.js";
import { OperationID } from "../util.js";

import Base from "./Base.js";

/** @category Modules */
export default class StaffDMails extends Base {
    static readonly moduleKey = "staffDmails" as const;
    @OperationID("staff/dmails#show")
    async get(user_id: number, id: number): Promise<DMail | null> {
        return staffDmails_show({
            client: this.client,
            path: { id, user_id },
        }).then(res => this._handleResponse(res, 200, false, DMail));
    }

    @OperationID("staff/dmails#index")
    async search(user_id: number): Promise<Array<DMail>> {
        return staffDmails_index({
            client: this.client,
            path: { user_id },
        }).then(res => this._handleResponse(res, 200, true, DMail));
    }
}
