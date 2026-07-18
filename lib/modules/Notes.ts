import {
    notes_create,
    notes_destroy,
    notes_update,
    notes_show,
    notes_revert,
    notes_index,
} from "../generated/sdk.js";
import Note from "../models/Note.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { NotesCreateData, NotesUpdateData, NotesIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreateNoteOptions extends TransformDataBodyToOptions<NotesCreateData> {}
/** @category Modules/Types */
export interface UpdateNoteOptions extends TransformDataBodyToOptions<NotesUpdateData> {}
/** @category Modules/Types */
export interface SearchNotesOptions extends TransformDataQueryToOptions<NotesIndexData> {}

/** @category Modules */
export default class Notes extends Base {
    @OperationID("notes#create")
    async create(options: CreateNoteOptions): Promise<Note> {
        return notes_create({
            client: this.client,
            body: options,
        }).then(res => this._handleResponse(res, 201, true, Note));
    }

    @OperationID("notes#destroy")
    async delete(id: number): Promise<null> {
        return notes_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("notes#show")
    async get(id: number): Promise<Note | null> {
        return notes_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, Note));
    }

    @OperationID("notes#revert")
    async revert(id: number, version_id: number): Promise<null> {
        return notes_revert({
            client: this.client,
            path: { id },
            query: { version_id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("notes#index")
    async search(options?: SearchNotesOptions): Promise<Array<Note>> {
        return notes_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, Note));
    }

    @OperationID("notes#update")
    async update(id: number, options: UpdateNoteOptions): Promise<null> {
        return notes_update({
            client: this.client,
            path: { id },
            body: options,
        }).then(res => this._handleResponse(res, 204, true));
    }
}
