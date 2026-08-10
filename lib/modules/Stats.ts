import { stats_index } from "../generated/sdk.js";
import { GetResponse, OperationID } from "../util.js";

import Base from "./Base.js";

import type { StatsIndexResponses } from "../generated/types.js";

/** @category Modules/Types */
export interface StatsIndexResponse extends GetResponse<StatsIndexResponses, 200> {}

/** @category Modules */
export default class Stats extends Base {
    static readonly moduleKey = "stats" as const;
    @OperationID("stats#index")
    async get(): Promise<StatsIndexResponse> {
        return stats_index({
            client: this.client,
        }).then(res => this._handleResponse(res, 200, true));
    }
}
