import {
    createStaffNote,
    deleteStaffNote,
    editStaffNote,
    getStaffNote,
    searchStaffNotes,
    undeleteStaffNote,
} from "../generated/sdk.js";
import StaffNote from "../models/StaffNote.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { CreateStaffNoteData, EditStaffNoteData, SearchStaffNotesData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreateStaffNoteOptions extends TransformDataBodyToOptions<CreateStaffNoteData> {}
/** @category Modules/Types */
export interface EditStaffNoteOptions extends TransformDataBodyToOptions<EditStaffNoteData> {}
/** @category Modules/Types */
export interface SearchStaffNotesOptions extends TransformDataQueryToOptions<SearchStaffNotesData> {}

/** @category Modules */
export default class StaffNotes extends Base {
    @OperationID("createStaffNote")
    async create(options: CreateStaffNoteOptions): Promise<StaffNote> {
        return createStaffNote({
            client: this.client,
            body: prefixKeys(options, "staff_note"),
        }).then(res => this._handleResponse(res, 201, true, StaffNote));
    }

    @OperationID("deleteStaffNote")
    async delete(id: number): Promise<StaffNote> {
        return deleteStaffNote({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 201, true, StaffNote));
    }

    @OperationID("editStaffNote")
    async edit(id: number, options: EditStaffNoteOptions): Promise<StaffNote> {
        return editStaffNote({
            client: this.client,
            path: { id },
            body: prefixKeys(options, "staff_note"),
        }).then(res => this._handleResponse(res, 200, true, StaffNote));
    }

    @OperationID("getStaffNote")
    async get(id: number): Promise<StaffNote | null> {
        return getStaffNote({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, StaffNote));
    }

    @OperationID("searchStaffNotes")
    async search(options?: SearchStaffNotesOptions): Promise<Array<StaffNote>> {
        return searchStaffNotes({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, StaffNote));
    }

    @OperationID("undeleteStaffNote")
    async undelete(id: number): Promise<StaffNote> {
        return undeleteStaffNote({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 201, true, StaffNote));
    }
}
