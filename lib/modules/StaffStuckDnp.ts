import { staffStuckDnp_create } from "../generated/sdk.js";
import { OperationID } from "../util.js";

import Base from "./Base.js";

/** @category Modules */
export default class StaffStuckDnp extends Base {
    static readonly moduleKey = "staffStuckDnp" as const;
    @OperationID("staff/stuck_dnp#create")
    async create(query: string): Promise<string> {
        return staffStuckDnp_create({
            client: this.client,
            body: { "stuck_dnp[query]": query },
        }).then(res => this._handleResponse(res, 302, true));
    }
}
