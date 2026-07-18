import {
    dmails_destroy,
    dmails_show,
    dmails_markAllAsRead,
    dmails_markAsRead,
    dmails_markAsUnread,
    dmails_index,
} from "../generated/sdk.js";
import DMail from "../models/DMail.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { DmailsIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface SearchDMailsOptions extends TransformDataQueryToOptions<DmailsIndexData> {}

/** @category Modules */
export default class DMails extends Base {
    @OperationID("dmails#destroy")
    async delete(id: number): Promise<null> {
        return dmails_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("dmails#show")
    async get(id: number): Promise<DMail | null> {
        return dmails_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, DMail));
    }

    @OperationID("dmails#mark_all_as_read")
    async markAllRead(): Promise<null> {
        return dmails_markAllAsRead({
            client: this.client,
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("dmails#mark_as_read")
    async markRead(id: number): Promise<null> {
        return dmails_markAsRead({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("dmails#mark_as_unread")
    async markUnread(id: number): Promise<null> {
        return dmails_markAsUnread({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("dmails#index")
    async search(options?: SearchDMailsOptions): Promise<Array<DMail>> {
        return dmails_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, DMail));
    }
}
