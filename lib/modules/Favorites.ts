import Base from "./Base.js";
import { addFavorite, listFavorites, removeFavorite } from "../generated/sdk.js";
import type { AddFavoriteResponses, ListFavoritesData, RemoveFavoriteResponses } from "../generated/types.js";
import { OperationID, type TransformDataQueryToOptions } from "../util.js";
import Post from "../models/Post.js";

/** @category Modules/Types */
export interface SearchFavoritesOptions extends TransformDataQueryToOptions<ListFavoritesData> {}

/** @category Modules */
export default class Favorites extends Base {
    @OperationID("addFavorite")
    async create(post_id: number): Promise<AddFavoriteResponses[201]> {
        return addFavorite({
            client: this.client,
            body:   { post_id }
        }).then(res => this._handleResponse(res, 201, true));
    }

    @OperationID("removeFavorite")
    async delete(id: number): Promise<RemoveFavoriteResponses[200]> {
        return removeFavorite({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("listFavorites")
    async search(options?: SearchFavoritesOptions): Promise<Array<Post>> {
        return listFavorites({
            client: this.client,
            query:  options
        }).then(res => {
            const data = this._handleResponse(res, 200, true);
            return data.posts.map(post => new Post(this.e621, post));
        });
    }
}
