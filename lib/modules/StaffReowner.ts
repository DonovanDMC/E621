import { staffReowner_create } from "e621-openapi/sdk";

import { OperationID, prefixKeys, type TransformDataBodyToOptions } from "../util.js";

import Base from "./Base.js";

import type { StaffReownerCreateData } from "e621-openapi/types";

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
