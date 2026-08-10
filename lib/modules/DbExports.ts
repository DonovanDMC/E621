import { dbExports_index } from "../generated/sdk.js";
import DBExport from "../models/DBExport.js";
import { OperationID } from "../util.js";

import Base from "./Base.js";

/** @category Modules */
export default class DBExports extends Base {
    static readonly moduleKey = "dbExports" as const;
    @OperationID("db_exports#index")
    async get(): Promise<Array<DBExport>> {
        return dbExports_index({
            client: this.client,
        }).then(res => this._handleResponse(res, 200, true, DBExport));
    }
}
