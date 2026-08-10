import { railsHealth_show } from "../generated/sdk.js";
import { GetResponse, OperationID } from "../util.js";

import Base from "./Base.js";

import type { RailsHealthShowResponses } from "../generated/types.js";

/** @category Modules/Types */
export interface RailsHealthShowResponse extends GetResponse<RailsHealthShowResponses, 200> {}

/** @category Modules */
export default class RailsHealth extends Base {
    static readonly moduleKey = "railsHealth" as const;
    @OperationID("rails/health#show")
    async get(): Promise<RailsHealthShowResponse> {
        return railsHealth_show({
            client: this.client,
        }).then(res => this._handleResponse(res, 200, true));
    }
}
