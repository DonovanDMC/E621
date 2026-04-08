import {
    createArtist,
    deleteArtist,
    editArtist,
    getArtist,
    revertArtist,
    searchArtists,
} from "../generated/sdk.js";
import Artist from "../models/Artist.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { CreateArtistData, EditArtistData, SearchArtistsData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreateArtistOptions extends TransformDataBodyToOptions<CreateArtistData> {}
/** @category Modules/Types */
export interface EditArtistOptions extends TransformDataBodyToOptions<EditArtistData> {}
/** @category Modules/Types */
export interface SearchArtistsOptions extends TransformDataQueryToOptions<SearchArtistsData> {}

/** @category Modules */
export default class Artists extends Base {
    @OperationID("createArtist")
    async create(options: CreateArtistOptions): Promise<Artist> {
        return createArtist({
            client: this.client,
            body: prefixKeys(options, "artist"),
        }).then(res => this._handleResponse(res, 201, true, Artist));
    }

    @OperationID("deleteArtist")
    async delete(idOrName: string | number): Promise<null> {
        return deleteArtist({
            client: this.client,
            path: { idOrName },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("editArtist")
    async edit(idOrName: string | number, options: EditArtistOptions): Promise<null> {
        return editArtist({
            client: this.client,
            path: { idOrName },
            body: prefixKeys(options, "artist"),
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("getArtist")
    async get(idOrName: number | string): Promise<Artist | null> {
        return getArtist({
            client: this.client,
            path: { idOrName },
        }).then(res => this._handleResponse(res, 200, false, Artist));
    }

    @OperationID("revertArtist")
    async revert(idOrName: number | string, version_id: number): Promise<null> {
        return revertArtist({
            client: this.client,
            path: { idOrName },
            query: { version_id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("searchArtists")
    async search(options?: SearchArtistsOptions): Promise<Array<Artist>> {
        return searchArtists({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, Artist));
    }
}
