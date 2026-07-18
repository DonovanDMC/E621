import { staffExceptions_show, staffExceptions_index } from "../../generated/sdk.js";
import ExceptionLog from "../../models/ExceptionLog.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../../util.js";
import Base from "../Base.js";

import type { StaffExceptionsIndexData } from "../../generated/types.js";

/** @category Modules/Types */
export interface SearchExceptionLogsOptions extends TransformDataQueryToOptions<StaffExceptionsIndexData> {}

/** @category Modules */
export default class StaffExceptionLogs extends Base {
    @OperationID("staff/exceptions#show")
    async get(id: number): Promise<ExceptionLog> {
        return staffExceptions_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, true, ExceptionLog));
    }

    @OperationID("staff/exceptions#index")
    async search(options?: SearchExceptionLogsOptions): Promise<Array<ExceptionLog>> {
        return staffExceptions_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, ExceptionLog));
    }
}
