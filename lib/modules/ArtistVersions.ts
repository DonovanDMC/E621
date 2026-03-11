import Base from "./Base.js";
import { searchArtistVersions } from "../generated/sdk.js";
import type { SearchArtistVersionsData } from "../generated/types.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";
import ArtistVersion from "../models/ArtistVersion.js";

/** @category Modules/Types */
export interface SearchArtistVersionsOptions extends TransformDataQueryToOptions<SearchArtistVersionsData> {}

/** @category Modules */
export default class ArtistVersions extends Base {
    @OperationID("searchArtistVersions")
    async search(options?: SearchArtistVersionsOptions): Promise<Array<ArtistVersion>> {
        return searchArtistVersions({
            client: this.client,
            query:  prefixKeys(options, "search", ["limit", "page"])
        }).then(res => this._handleResponse(res, 200, true, ArtistVersion));
    }
}
