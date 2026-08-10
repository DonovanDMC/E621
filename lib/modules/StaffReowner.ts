import { staffReowner_create } from "../generated/sdk.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions } from "../util.js";

import Base from "./Base.js";

import type { StaffReownerCreateData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreateStaffReownerOptions extends TransformDataBodyToOptions<StaffReownerCreateData> {}

/** @category Modules */
export default class StaffReowner extends Base {
    static readonly moduleKey = "staffReowner" as const;
    @OperationID("staff/reowner#create")
    async create(options: CreateStaffReownerOptions): Promise<string> {
        return staffReowner_create({
            client: this.client,
            body: prefixKeys(options, "reowner"),
        }).then(res => this._handleResponse(res, 302, true));
    }
}
