import {
    artists_create,
    artists_destroy,
    artists_update,
    artists_show,
    artists_revert,
    artists_index,
} from "../generated/sdk.js";
import Artist from "../models/Artist.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { ArtistsCreateData, ArtistsUpdateData, ArtistsIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreateArtistOptions extends TransformDataBodyToOptions<ArtistsCreateData> {}
/** @category Modules/Types */
export interface UpdateArtistOptions extends TransformDataBodyToOptions<ArtistsUpdateData> {}
/** @category Modules/Types */
export interface SearchArtistsOptions extends TransformDataQueryToOptions<ArtistsIndexData> {}

/** @category Modules */
export default class Artists extends Base {
    @OperationID("artists#create")
    async create(options: CreateArtistOptions): Promise<Artist> {
        return artists_create({
            client: this.client,
            body: options,
        }).then(res => this._handleResponse(res, 201, true, Artist));
    }

    @OperationID("artists#destroy")
    async delete(idOrName: string | number): Promise<null> {
        return artists_destroy({
            client: this.client,
            path: { idOrName },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("artists#show")
    async get(idOrName: number | string): Promise<Artist | null> {
        return artists_show({
            client: this.client,
            path: { idOrName },
        }).then(res => this._handleResponse(res, 200, false, Artist));
    }

    @OperationID("artists#revert")
    async revert(idOrName: number | string, version_id: number): Promise<null> {
        return artists_revert({
            client: this.client,
            path: { idOrName },
            query: { version_id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("artists#index")
    async search(options?: SearchArtistsOptions): Promise<Array<Artist>> {
        return artists_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, Artist));
    }

    @OperationID("artists#update")
    async update(idOrName: string | number, options: UpdateArtistOptions): Promise<null> {
        return artists_update({
            client: this.client,
            path: { idOrName },
            body: options,
        }).then(res => this._handleResponse(res, 204, true));
    }
}
