import { staffFiles_create, staffFiles_destroy, staffFiles_update, staffFiles_show, staffFiles_index } from "../../generated/sdk.js";
import StaffFile from "../../models/StaffFile.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../../util.js";
import Base from "../Base.js";

import type { StaffFilesCreateData, StaffFilesUpdateData, StaffFilesIndexData } from "../../generated/types.js";

/** @category Modules/Types */
export interface SearchStaffFilesOptions extends TransformDataQueryToOptions<StaffFilesIndexData> {}
/** @category Modules/Types */
export interface CreateStaffFileOptions extends TransformDataBodyToOptions<StaffFilesCreateData> {}
/** @category Modules/Types */
export interface UpdateStaffFileOptions extends TransformDataBodyToOptions<StaffFilesUpdateData> {}

/** @category Modules */
export default class StaffFiles extends Base {
    @OperationID("staff/files#create")
    async create(options: CreateStaffFileOptions): Promise<StaffFile> {
        return staffFiles_create({
            client: this.client,
            body: prefixKeys(options, "staff_file"),
        }).then(res => this._handleResponse(res, 201, true, StaffFile));
    }

    @OperationID("staff/files#destroy")
    async delete(id: number): Promise<null> {
        return staffFiles_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("staff/files#show")
    async get(id: number): Promise<StaffFile> {
        return staffFiles_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, true, StaffFile));
    }

    @OperationID("staff/files#index")
    async search(options?: SearchStaffFilesOptions): Promise<Array<StaffFile>> {
        return staffFiles_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, StaffFile));
    }

    @OperationID("staff/files#update")
    async update(id: number, options: UpdateStaffFileOptions): Promise<null> {
        return staffFiles_update({
            client: this.client,
            path: { id },
            body: prefixKeys(options, "staff_file"),
        }).then(res => this._handleResponse(res, 204, true));
    }
}
