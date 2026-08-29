import {
    staffNotes_create,
    staffNotes_delete,
    staffNotes_update,
    staffNotes_show,
    staffNotes_index,
    staffNotes_undelete,
} from "../generated/sdk.js";
import StaffNote from "../models/StaffNote.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { StaffNotesCreateData, StaffNotesUpdateData, StaffNotesIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreateStaffNoteOptions extends TransformDataBodyToOptions<StaffNotesCreateData> {}
/** @category Modules/Types */
export interface UpdateStaffNoteOptions extends TransformDataBodyToOptions<StaffNotesUpdateData> {}
/** @category Modules/Types */
export interface SearchStaffNotesOptions extends TransformDataQueryToOptions<StaffNotesIndexData> {}

/** @category Modules */
export default class StaffNotes extends Base {
    static readonly moduleKey = "staffNotes" as const;
    @OperationID("staff_notes#create")
    async create(options: CreateStaffNoteOptions): Promise<StaffNote> {
        return staffNotes_create({
            client: this.client,
            body: prefixKeys(options, "staff_note"),
        }).then(res => this._handleResponse(res, 201, true, StaffNote));
    }

    @OperationID("staff_notes#delete")
    async delete(id: number): Promise<StaffNote> {
        return staffNotes_delete({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 201, true, StaffNote));
    }

    @OperationID("staff_notes#show")
    async get(id: number): Promise<StaffNote | null> {
        return staffNotes_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, StaffNote));
    }

    @OperationID("staff_notes#index")
    async search(options?: SearchStaffNotesOptions): Promise<Array<StaffNote>> {
        return staffNotes_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, StaffNote));
    }

    @OperationID("staff_notes#undelete")
    async undelete(id: number): Promise<StaffNote> {
        return staffNotes_undelete({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 201, true, StaffNote));
    }

    @OperationID("staff_notes#update")
    async update(id: number, options: UpdateStaffNoteOptions): Promise<StaffNote> {
        return staffNotes_update({
            client: this.client,
            path: { id },
            body: prefixKeys(options, "staff_note"),
        }).then(res => this._handleResponse(res, 200, true, StaffNote));
    }
}
