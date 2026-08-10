import { staffIpAddrs_export, staffIpAddrs_index } from "../generated/sdk.js";
import { GetResponse, OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { StaffIpAddrsExportData, StaffIpAddrsExportResponses, StaffIpAddrsIndexData, StaffIpAddrsIndexResponses } from "../generated/types.js";

/** @category Modules/Types */
export interface SearchStaffIpAddrsOptions extends TransformDataQueryToOptions<StaffIpAddrsIndexData> {}
/** @category Modules/Types */
export interface ExportStaffIpAddrsOptions extends TransformDataQueryToOptions<StaffIpAddrsExportData> {}
/** @category Modules/Types */
export interface StaffIpAddrsIndexResponse extends GetResponse<StaffIpAddrsIndexResponses, 200> {}
/** @category Modules/Types */
export interface StaffIpAddrsExportResponse extends GetResponse<StaffIpAddrsExportResponses, 200> {}

/** @category Modules */
export default class StaffIpAddrs extends Base {
    static readonly moduleKey = "staffIpAddrs" as const;
    @OperationID("staff/ip_addrs#export")
    async export(options?: ExportStaffIpAddrsOptions): Promise<StaffIpAddrsExportResponse> {
        return staffIpAddrs_export({
            client: this.client,
            query: prefixKeys(options, "search"),
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("staff/ip_addrs#index")
    async search(options?: SearchStaffIpAddrsOptions): Promise<StaffIpAddrsIndexResponse> {
        return staffIpAddrs_index({
            client: this.client,
            query: prefixKeys(options, "search"),
        }).then(res => this._handleResponse(res, 200, true));
    }
}
