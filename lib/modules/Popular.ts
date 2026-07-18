import { popular_index } from "../generated/sdk.js";
import { OperationID, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";
import { type AnyPostData, type NoV2Options, type PostFormat, wrapPosts } from "./posts/Format.js";

import type { LegacyPost as LegacyPostData, PopularIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface GetPopularPostsOptions extends TransformDataQueryToOptions<PopularIndexData> {}

/** @category Modules */
export default class Popular extends Base {
    @OperationID("popular#index")
    async get<const O extends GetPopularPostsOptions = NoV2Options>(options?: O): Promise<Array<PostFormat<O["v2"], O["mode"]>>> {
        return popular_index({
            client: this.client,
            query: options,
        }).then((res) => {
            const data = this._handleResponse(res, 200, true);
            const raw = (options?.v2 ? data : (data as { posts: Array<LegacyPostData> }).posts) as Array<AnyPostData>;
            return wrapPosts(this.e621, raw, options?.v2, options?.mode) as Array<PostFormat<O["v2"], O["mode"]>>;
        });
    }
}
