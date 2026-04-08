import { searchArtistUrls } from "../generated/sdk.js";
import ArtistUrl from "../models/ArtistUrl.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { SearchArtistUrlsData } from "../generated/types.js";

/** @category Modules/Types */
export interface SearchArtistUrlsOptions extends TransformDataQueryToOptions<SearchArtistUrlsData> {}

/** @category Modules */
export default class ArtistUrls extends Base {
    @OperationID("searchArtistUrls")
    async search(options?: SearchArtistUrlsOptions): Promise<Array<ArtistUrl>> {
        return searchArtistUrls({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, ArtistUrl));
    }
}
