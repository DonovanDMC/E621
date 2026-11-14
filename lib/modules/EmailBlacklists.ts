import { emailBlacklists_create, emailBlacklists_destroy, emailBlacklists_index } from "e621-openapi/sdk";

import EmailBlacklist from "../models/EmailBlacklist.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { EmailBlacklistsCreateData, EmailBlacklistsIndexData } from "e621-openapi/types";

/** @category Modules/Types */
export interface CreateEmailBlacklistOptions extends TransformDataBodyToOptions<EmailBlacklistsCreateData> {}
/** @category Modules/Types */
export interface SearchEmailBlacklistsOptions extends TransformDataQueryToOptions<EmailBlacklistsIndexData> {}

/** @category Modules */
export default class EmailBlacklists extends Base {
    static readonly moduleKey = "emailBlacklists" as const;
    @OperationID("email_blacklists#create")
    async create(options: CreateEmailBlacklistOptions): Promise<EmailBlacklist> {
        return emailBlacklists_create({
            client: this.client,
            body: prefixKeys(options, "email_blacklist"),
        }).then(res => this._handleResponse(res, 201, true, EmailBlacklist));
    }

    @OperationID("email_blacklists#destroy")
    async delete(id: number): Promise<null> {
        return emailBlacklists_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("email_blacklists#index")
    async search(options?: SearchEmailBlacklistsOptions): Promise<Array<EmailBlacklist>> {
        return emailBlacklists_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, EmailBlacklist));
    }
}
