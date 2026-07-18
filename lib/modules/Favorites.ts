import { favorites_create, favorites_index, favorites_destroy } from "../generated/sdk.js";
import { GetResponse, OperationID, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";
import { type AnyPostData, type NoV2Options, type PostFormat, wrapPosts } from "./posts/Format.js";

import type { FavoritesCreateResponses, LegacyPost as LegacyPostData, FavoritesIndexData, FavoritesDestroyResponses } from "../generated/types.js";

/** @category Modules/Types */
export interface SearchFavoritesOptions extends TransformDataQueryToOptions<FavoritesIndexData> {}
/** @category Modules/Types */
export interface FavoritesCreateResponse extends GetResponse<FavoritesCreateResponses, 201> {}
/** @category Modules/Types */
export interface FavoritesDestroyResponse extends GetResponse<FavoritesDestroyResponses, 200> {}

/** @category Modules */
export default class Favorites extends Base {
    static readonly moduleKey = "favorites" as const;
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
    async search<const O extends SearchFavoritesOptions = NoV2Options>(options?: O): Promise<Array<PostFormat<O["v2"], O["mode"]>>> {
        return favorites_index({
            client: this.client,
            query: options,
        }).then((res) => {
            const data = this._handleResponse(res, 200, true);
            const raw = (options?.v2 ? data : (data as { posts: Array<LegacyPostData> }).posts) as Array<AnyPostData>;
            return wrapPosts(this.e621, raw, options?.v2, options?.mode) as Array<PostFormat<O["v2"], O["mode"]>>;
        });
    }
}
