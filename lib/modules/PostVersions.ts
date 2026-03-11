import Base from "./Base.js";
import { hidePostVersion, searchPostVersions, undoPostVersion, unhidePostVersion } from "../generated/sdk.js";
import type { SearchPostVersionsData } from "../generated/types.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

/** @category Modules/Types */
export interface SearchPostVersionsOptions extends TransformDataQueryToOptions<SearchPostVersionsData> {}

/** @category Modules */
export default class PostVersions extends Base {
    @OperationID("hidePostVersion")
    async hide(id: number): Promise<string> {
        return hidePostVersion({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 302, true));
    }

    @OperationID("searchPostVersions")
    async search(options?: SearchPostVersionsOptions): Promise<null> {
        return searchPostVersions({
            client: this.client,
            query:  prefixKeys(options, "search", ["limit", "page"])
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("undoPostVersion")
    async undo(id: number): Promise<null> {
        return undoPostVersion({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("unhidePostVersion")
    async unhide(id: number): Promise<string> {
        return unhidePostVersion({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 302, true));
    }
}
