import { staffWikiRefs_bulkCreate, staffWikiRefs_create, staffWikiRefs_destroy } from "../generated/sdk.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions } from "../util.js";

import Base from "./Base.js";

import type { StaffWikiRefsCreateData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreateStaffWikiRefOptions extends TransformDataBodyToOptions<StaffWikiRefsCreateData> {}

/** @category Modules */
export default class StaffWikiRefs extends Base {
    static readonly moduleKey = "staffWikiRefs" as const;
    @OperationID("staff/wiki_refs#bulk_create")
    async bulkCreate(id: number, urls: string): Promise<string> {
        return staffWikiRefs_bulkCreate({
            client: this.client,
            path: { id },
            body: { urls },
        }).then(res => this._handleResponse(res, 302, true));
    }

    @OperationID("staff/wiki_refs#create")
    async create(id: number, options: CreateStaffWikiRefOptions): Promise<string> {
        return staffWikiRefs_create({
            client: this.client,
            path: { id },
            body: prefixKeys(options, "staff_wiki_ref"),
        }).then(res => this._handleResponse(res, 302, true));
    }

    @OperationID("staff/wiki_refs#destroy")
    async delete(wiki_id: number, id: number): Promise<string> {
        return staffWikiRefs_destroy({
            client: this.client,
            path: { wiki_id, id },
        }).then(res => this._handleResponse(res, 302, true));
    }
}
