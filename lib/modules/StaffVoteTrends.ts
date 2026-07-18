import { staffVoteTrends_index } from "../generated/sdk.js";
import { OperationID, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { StaffVoteTrendsIndexData, VoteTrend } from "../generated/types.js";

/** @category Modules/Types */
export interface GetStaffVoteTrendsOptions extends TransformDataQueryToOptions<StaffVoteTrendsIndexData> {}
/** @category Modules/Types */
export interface StaffVoteTrendResult {
    scores: Array<number>;
    trend: VoteTrend;
}

/** @category Modules */
export default class StaffVoteTrends extends Base {
    static readonly moduleKey = "staffVoteTrends" as const;
    @OperationID("staff/vote_trends#index")
    async get(options: GetStaffVoteTrendsOptions): Promise<Array<StaffVoteTrendResult>> {
        return staffVoteTrends_index({
            client: this.client,
            query: options,
        }).then((res) => {
            const data = this._handleResponse(res, 200, true);
            const results: Array<StaffVoteTrendResult> = [];
            // NOTE: the spec describes this as a "2D array" of [VoteTrend, scores] pairs, flattened by the generator into an alternating array.
            for (let i = 0; i < data.length; i += 2) {
                results.push({ trend: data[i] as VoteTrend, scores: data[i + 1] as Array<number> });
            }
            return results;
        });
    }
}
