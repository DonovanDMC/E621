import { health_index } from "../generated/sdk.js";
import { OperationID } from "../util.js";

import Base from "./Base.js";

/** @category Modules */
export default class Health extends Base {
    @OperationID("health#index")
    async get(): Promise<string> {
        return health_index({
            client: this.client,
        }).then(res => this._handleResponse(res, 200, true));
    }
}
