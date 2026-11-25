import { staffUsers_update, staffUsers_altList } from "e621-openapi/sdk";
import { type StaffUsersUpdateData } from "e621-openapi/types";

import { OperationID, prefixKeys, type TransformDataBodyToOptions } from "../util.js";

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

    @OperationID("staff/users#update")
    async update(id: number, options: UpdateStaffUserOptions): Promise<string> {
        return staffUsers_update({
            client: this.client,
            path: { id },
            body: prefixKeys(options, "user"),
            // the spec says 200, but that's only after following the redirect
            redirect: "manual",
        }).then(res => this._handleResponse(res, 302, true));
    }
}
