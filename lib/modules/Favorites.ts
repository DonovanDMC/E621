import { favorites_create, favorites_index, favorites_destroy } from "e621-openapi/sdk";

import { GetResponse, OperationID, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";
import { type AnyPostData, type NoV1Options, type PostFormat, type PostFormatOptions, wrapPosts } from "./posts/Format.js";

import type E621 from "../index.js";
import type { Client } from "e621-openapi/client/types";
import type { FavoritesCreateResponses, LegacyPost as LegacyPostData, FavoritesIndexData, FavoritesDestroyResponses } from "e621-openapi/types";

/** @category Modules/Types */
export interface SearchFavoritesOptions extends TransformDataQueryToOptions<FavoritesIndexData> {}
/** @category Modules/Types */
export interface FavoritesCreateResponse extends GetResponse<FavoritesCreateResponses, 201> {}
/** @category Modules/Types */
export interface FavoritesDestroyResponse extends GetResponse<FavoritesDestroyResponses, 200> {}

/** @category Modules */
export default class Favorites<PF extends PostFormatOptions = NoV1Options> extends Base<PF> {
    static readonly moduleKey = "favorites" as const;
    protected readonly defaultFormat: PF;
    /** @param defaultFormat - The v1/mode format to fall back to when `search()` is called without explicit v1/mode options. */
    constructor(e621: E621<PF> | undefined, client: Client, defaultFormat: PF = {} as PF) {
        super(e621, client);
        this.defaultFormat = defaultFormat;
    }

    @OperationID("favorites#create")
    async create(post_id: number): Promise<FavoritesCreateResponse> {
        return favorites_create({
            client: this.client,
            body: { post_id },
        }).then(res => this._handleResponse(res, 201, true));
    }

    @OperationID("favorites#destroy")
    async delete(id: number): Promise<FavoritesDestroyResponse> {
        return favorites_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("favorites#index")
    async search<const O extends SearchFavoritesOptions = PF>(options?: O): Promise<Array<PostFormat<O["v1"], O["mode"], PF>>> {
        const v1 = options?.v1 ?? this.defaultFormat.v1;
        const mode = options?.mode ?? this.defaultFormat.mode;
        return favorites_index({
            client: this.client,
            query: { ...options, v1, mode },
        }).then((res) => {
            const data = this._handleResponse(res, 200, true);
            const raw = (v1 ? (data as { posts: Array<LegacyPostData> }).posts : data) as Array<AnyPostData>;
            return wrapPosts(this.e621, raw, v1, mode) as Array<PostFormat<O["v1"], O["mode"], PF>>;
        });
    }
}
