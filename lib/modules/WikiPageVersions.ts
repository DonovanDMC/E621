import Base from "./Base.js";
import { getWikiPageVersion, searchWikiPageVersions } from "../generated/sdk.js";
import type { SearchWikiPageVersionsData } from "../generated/types.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";
import WikiPageVersion from "../models/WikiPageVersion.js";

/** @category Modules/Types */
export interface SearchWikiPageVersionsOptions extends TransformDataQueryToOptions<SearchWikiPageVersionsData> {}

/** @category Modules */
export default class WikiPageVersions extends Base {
    @OperationID("getWikiPageVersion")
    async get(id: number): Promise<WikiPageVersion | null> {
        return getWikiPageVersion({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 200, false, WikiPageVersion));
    }

    @OperationID("searchWikiPageVersions")
    async search(options?: SearchWikiPageVersionsOptions): Promise<Array<WikiPageVersion>> {
        return searchWikiPageVersions({
            client: this.client,
            query:  prefixKeys(options, "search", ["limit", "page"])
        }).then(res => this._handleResponse(res, 200, true, WikiPageVersion));
    }
}
