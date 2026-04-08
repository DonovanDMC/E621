import {
    createNote,
    deleteNote,
    editNote,
    getNote,
    revertNote,
    searchNotes,
} from "../generated/sdk.js";
import Note from "../models/Note.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { CreateNoteData, EditNoteData, SearchNotesData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreateNoteOptions extends TransformDataBodyToOptions<CreateNoteData> {}
/** @category Modules/Types */
export interface EditNoteOptions extends TransformDataBodyToOptions<EditNoteData> {}
/** @category Modules/Types */
export interface SearchNotesOptions extends TransformDataQueryToOptions<SearchNotesData> {}

/** @category Modules */
export default class Notes extends Base {
    @OperationID("createNote")
    async create(options: CreateNoteOptions): Promise<Note> {
        return createNote({
            client: this.client,
            body: prefixKeys(options, "note"),
        }).then(res => this._handleResponse(res, 201, true, Note));
    }

    @OperationID("deleteNote")
    async delete(id: number): Promise<null> {
        return deleteNote({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("editNote")
    async edit(id: number, options: EditNoteOptions): Promise<null> {
        return editNote({
            client: this.client,
            path: { id },
            body: prefixKeys(options, "note"),
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("getNote")
    async get(id: number): Promise<Note | null> {
        return getNote({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, Note));
    }

    @OperationID("revertNote")
    async revert(id: number, version_id: number): Promise<null> {
        return revertNote({
            client: this.client,
            path: { id },
            query: { version_id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("searchNotes")
    async search(options?: SearchNotesOptions): Promise<Array<Note>> {
        return searchNotes({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, Note));
    }
}
