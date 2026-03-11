import Base from "./Base.js";
import { createEmailBlacklist, deleteEmailBlacklist, searchEmailBlacklists } from "../generated/sdk.js";
import type { CreateEmailBlacklistData, SearchEmailBlacklistsData } from "../generated/types.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";
import EmailBlacklist from "../models/EmailBlacklist.js";

/** @category Modules/Types */
export interface CreateEmailBlacklistOptions extends TransformDataBodyToOptions<CreateEmailBlacklistData> {}
/** @category Modules/Types */
export interface SearchEmailBlacklistsOptions extends TransformDataQueryToOptions<SearchEmailBlacklistsData> {}

/** @category Modules */
export default class EmailBlacklists extends Base {
    @OperationID("createEmailBlacklist")
    async create(options: CreateEmailBlacklistOptions): Promise<EmailBlacklist> {
        return createEmailBlacklist({
            client: this.client,
            body:   prefixKeys(options, "email_blacklist")
        }).then(res => this._handleResponse(res, 201, true, EmailBlacklist));
    }

    @OperationID("deleteEmailBlacklist")
    async delete(id: number): Promise<null> {
        return deleteEmailBlacklist({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("searchEmailBlacklists")
    async search(options?: SearchEmailBlacklistsOptions): Promise<Array<EmailBlacklist>> {
        return searchEmailBlacklists({
            client: this.client,
            query:  prefixKeys(options, "search", ["limit", "page"])
        }).then(res => this._handleResponse(res, 200, true, EmailBlacklist));
    }
}
