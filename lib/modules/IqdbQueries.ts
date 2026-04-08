import { queryIqdbPost, queryIqdbGet } from "../generated/sdk.js";
import IqdbPost from "../models/IqdbPost.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { QueryIqdbPostData, QueryIqdbGetData } from "../generated/types.js";

/** @category Modules/Types */
export interface QueryIqdbGetOptions extends TransformDataQueryToOptions<QueryIqdbGetData> {}
/** @category Modules/Types */
export interface QueryIqdbPostOptions extends TransformDataBodyToOptions<QueryIqdbPostData> {}
/** @category Modules/Types */
export interface IqdbResult {
    hash: string;
    post: IqdbPost;
    post_id: number;
    score: number;
}

/** @category Modules */
export default class IqdbQueries extends Base {
    @OperationID("queryIqdbGet")
    async get(options: QueryIqdbGetOptions): Promise<Array<IqdbResult>> {
        return queryIqdbGet({
            client: this.client,
            query: prefixKeys(options, "search"),
        }).then((res) => {
            const data = this._handleResponse(res, 200, true);
            return data.map(d => ({
                hash: d.hash,
                post: new IqdbPost(this.e621, d.post.posts),
                post_id: d.post_id,
                score: d.score,
            }));
        });
    }

    @OperationID("queryIqdbPost")
    async post(options: QueryIqdbPostOptions): Promise<Array<IqdbResult>> {
        return queryIqdbPost({
            client: this.client,
            body: options,
        }).then((res) => {
            const data = this._handleResponse(res, 200, true);
            return data.map(d => ({
                hash: d.hash,
                post: new IqdbPost(this.e621, d.post.posts),
                post_id: d.post_id,
                score: d.score,
            }));
        });
    }
}
