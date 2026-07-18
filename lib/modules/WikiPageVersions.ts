import { wikiPageVersions_show, wikiPageVersions_index } from "../generated/sdk.js";
import WikiPageVersion from "../models/WikiPageVersion.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { WikiPageVersionsIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface SearchWikiPageVersionsOptions extends TransformDataQueryToOptions<WikiPageVersionsIndexData> {}

/** @category Modules */
export default class WikiPageVersions extends Base {
    @OperationID("wiki_page_versions#show")
    async get(id: number): Promise<WikiPageVersion | null> {
        return wikiPageVersions_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, WikiPageVersion));
    }

    @OperationID("wiki_page_versions#index")
    async search(options?: SearchWikiPageVersionsOptions): Promise<Array<WikiPageVersion>> {
        return wikiPageVersions_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, WikiPageVersion));
    }
}
