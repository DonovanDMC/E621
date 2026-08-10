import { artistUrls_index } from "../generated/sdk.js";
import ArtistURL from "../models/ArtistURL.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { ArtistUrlsIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface SearchArtistUrlsOptions extends TransformDataQueryToOptions<ArtistUrlsIndexData> {}

/** @category Modules */
export default class ArtistUrls extends Base {
    static readonly moduleKey = "artistUrls" as const;
    @OperationID("artist_urls#index")
    async search(options?: SearchArtistUrlsOptions): Promise<Array<ArtistURL>> {
        return artistUrls_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, ArtistURL));
    }
}
