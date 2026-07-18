import { staffWikiVersions_show, staffWikiVersions_index } from "../../generated/sdk.js";
import StaffWikiVersion from "../../models/StaffWikiVersion.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../../util.js";
import Base from "../Base.js";

import type { StaffWikiVersionsIndexData } from "../../generated/types.js";

/** @category Modules/Types */
export interface SearchStaffWikiVersionsOptions extends TransformDataQueryToOptions<StaffWikiVersionsIndexData> {}

/** @category Modules */
export default class StaffWikiVersions extends Base {
    @OperationID("staff/wiki_versions#show")
    async get(id: number): Promise<StaffWikiVersion> {
        return staffWikiVersions_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, true, StaffWikiVersion));
    }

    @OperationID("staff/wiki_versions#index")
    async search(options?: SearchStaffWikiVersionsOptions): Promise<Array<StaffWikiVersion>> {
        return staffWikiVersions_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, StaffWikiVersion));
    }
}
