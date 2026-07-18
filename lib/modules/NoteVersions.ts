import { noteVersions_index } from "../generated/sdk.js";
import NoteVersion from "../models/NoteVersion.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { NoteVersionsIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface SearchNoteVersionsOptions extends TransformDataQueryToOptions<NoteVersionsIndexData> {}

/** @category Modules */
export default class NoteVersions extends Base {
    @OperationID("note_versions#index")
    async search(options?: SearchNoteVersionsOptions): Promise<Array<NoteVersion>> {
        return noteVersions_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, NoteVersion));
    }
}
