import { userReverts_create } from "e621-openapi/sdk";

import { OperationID } from "../util.js";

import Base from "./Base.js";

/** @category Modules */
export default class UserReverts extends Base {
    static readonly moduleKey = "userReverts" as const;
    @OperationID("user_reverts#create")
    async create(user_id: number): Promise<string> {
        return userReverts_create({
            client: this.client,
            body: { user_id },
        }).then(res => this._handleResponse(res, 302, true));
    }
}
