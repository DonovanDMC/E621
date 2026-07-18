import { artistVersions_index } from "../generated/sdk.js";
import ArtistVersion from "../models/ArtistVersion.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { ArtistVersionsIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface SearchArtistVersionsOptions extends TransformDataQueryToOptions<ArtistVersionsIndexData> {}

/** @category Modules */
export default class ArtistVersions extends Base {
    static readonly moduleKey = "artistVersions" as const;
    @OperationID("artist_versions#index")
    async search(options?: SearchArtistVersionsOptions): Promise<Array<ArtistVersion>> {
        return artistVersions_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, ArtistVersion));
    }
}
