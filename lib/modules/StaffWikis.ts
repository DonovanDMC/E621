import { staffWikis_claim, staffWikis_create, staffWikis_destroy, staffWikis_update, staffWikis_show, staffWikis_index, staffWikis_unclaim } from "../generated/sdk.js";
import StaffWiki from "../models/StaffWiki.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { StaffWikisCreateData, StaffWikisUpdateData, StaffWikisIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface SearchStaffWikisOptions extends TransformDataQueryToOptions<StaffWikisIndexData> {}
/** @category Modules/Types */
export interface CreateStaffWikiOptions extends TransformDataBodyToOptions<StaffWikisCreateData> {}
/** @category Modules/Types */
export interface UpdateStaffWikiOptions extends TransformDataBodyToOptions<StaffWikisUpdateData> {}

/** @category Modules */
export default class StaffWikis extends Base {
    static readonly moduleKey = "staffWikis" as const;
    @OperationID("staff/wikis#claim")
    async claim(id: number): Promise<StaffWiki> {
        return staffWikis_claim({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 201, true, StaffWiki));
    }

    @OperationID("staff/wikis#create")
    async create(options: CreateStaffWikiOptions): Promise<StaffWiki> {
        return staffWikis_create({
            client: this.client,
            body: prefixKeys(options, "staff_wiki"),
        }).then(res => this._handleResponse(res, 201, true, StaffWiki));
    }

    @OperationID("staff/wikis#destroy")
    async delete(id: number): Promise<null> {
        return staffWikis_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("staff/wikis#show")
    async get(id: number): Promise<StaffWiki> {
        return staffWikis_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, true, StaffWiki));
    }

    @OperationID("staff/wikis#index")
    async search(options?: SearchStaffWikisOptions): Promise<Array<StaffWiki>> {
        return staffWikis_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, StaffWiki));
    }

    @OperationID("staff/wikis#unclaim")
    async unclaim(id: number): Promise<StaffWiki> {
        return staffWikis_unclaim({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 201, true, StaffWiki));
    }

    @OperationID("staff/wikis#update")
    async update(id: number, options: UpdateStaffWikiOptions): Promise<null> {
        return staffWikis_update({
            client: this.client,
            path: { id },
            body: prefixKeys(options, "staff_wiki"),
        }).then(res => this._handleResponse(res, 204, true));
    }
}
