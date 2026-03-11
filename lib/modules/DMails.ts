import Base from "./Base.js";
import {
    deleteDMail,
    getDMail,
    markAllDMailsAsRead,
    markDMailAsRead,
    markDMailAsUnread,
    searchDMails
} from "../generated/sdk.js";
import type { SearchDMailsData } from "../generated/types.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";
import DMail from "../models/DMail.js";

/** @category Modules/Types */
export interface SearchDMailsOptions extends TransformDataQueryToOptions<SearchDMailsData> {}

/** @category Modules */
export default class DMails extends Base {
    @OperationID("deleteDMail")
    async delete(id: number): Promise<null> {
        return deleteDMail({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("getDMail")
    async get(id: number): Promise<DMail | null> {
        return getDMail({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 200, false, DMail));
    }

    @OperationID("markAllDMailsAsRead")
    async markAllRead(): Promise<null> {
        return markAllDMailsAsRead({
            client: this.client
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("markDMailAsRead")
    async markRead(id: number): Promise<null> {
        return markDMailAsRead({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("markDMailAsUnread")
    async markUnread(id: number): Promise<null> {
        return markDMailAsUnread({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("searchDMails")
    async search(options?: SearchDMailsOptions): Promise<Array<DMail>> {
        return searchDMails({
            client: this.client,
            query:  prefixKeys(options, "search", ["limit", "page"])
        }).then(res => this._handleResponse(res, 200, true, DMail));
    }
}
