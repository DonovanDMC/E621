import Base from "./Base.js";
import { searchNoteVersions } from "../generated/sdk.js";
import type { SearchNoteVersionsData } from "../generated/types.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";
import NoteVersion from "../models/NoteVersion.js";

/** @category Modules/Types */
export interface SearchNoteVersionsOptions extends TransformDataQueryToOptions<SearchNoteVersionsData> {}

/** @category Modules */
export default class NoteVersions extends Base {
    @OperationID("searchNoteVersions")
    async search(options?: SearchNoteVersionsOptions): Promise<Array<NoteVersion>> {
        return searchNoteVersions({
            client: this.client,
            query:  prefixKeys(options, "search", ["limit", "page"])
        }).then(res => this._handleResponse(res, 200, true, NoteVersion));
    }
}
