import { staffAutomodDmails_show, staffAutomodDmails_index, staffAutomodDmails_markAsRead, staffAutomodDmails_markAsUnread } from "../generated/sdk.js";
import DMail from "../models/DMail.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { StaffAutomodDmailsIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface SearchStaffAutomodDMailsOptions extends TransformDataQueryToOptions<StaffAutomodDmailsIndexData> {}

/** @category Modules */
export default class StaffAutomodDMails extends Base {
    static readonly moduleKey = "staffAutomodDMails" as const;
    @OperationID("staff/automod_dmails#show")
    async get(id: number): Promise<DMail | null> {
        return staffAutomodDmails_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, DMail));
    }

    @OperationID("staff/automod_dmails#mark_as_read")
    async markRead(id: number): Promise<null> {
        return staffAutomodDmails_markAsRead({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("staff/automod_dmails#mark_as_unread")
    async markUnread(id: number): Promise<null> {
        return staffAutomodDmails_markAsUnread({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("staff/automod_dmails#index")
    async search(options?: SearchStaffAutomodDMailsOptions): Promise<Array<DMail>> {
        return staffAutomodDmails_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, DMail));
    }
}
