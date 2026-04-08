import { listPopular } from "../generated/sdk.js";
import { type ListPopularData } from "../generated/types.js";
import Post from "../models/Post.js";
import { OperationID, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

/** @category Modules/Types */
export interface GetPopularPostsOptions extends TransformDataQueryToOptions<ListPopularData> {}

/** @category Modules */
export default class Popular extends Base {
    @OperationID("listPopular")
    async get(options?: GetPopularPostsOptions): Promise<Array<Post>> {
        return listPopular({
            client: this.client,
            query: options,
        }).then((res) => {
            const data = this._handleResponse(res, 200, true).posts;
            return data.map(post => new Post(this.e621, post));
        });
    }
}
