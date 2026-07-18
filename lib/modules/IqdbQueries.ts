import { iqdbQueries_showPost, iqdbQueries_show } from "../generated/sdk.js";
import BasicPost from "../models/BasicPost.js";
import IqdbPost from "../models/IqdbPost.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";
import { type NoV2Options, type PostFormatV2Only } from "./posts/Format.js";

import type { BasicPost as BasicPostData, IqdbPost as IqdbPostData, IqdbQueriesShowPostData, IqdbQueriesShowData } from "../generated/types.js";

/** @category Modules/Types */
export interface QueryIqdbGetOptions extends TransformDataQueryToOptions<IqdbQueriesShowData> {}
/** @category Modules/Types */
export interface QueryIqdbPostOptions extends TransformDataBodyToOptions<IqdbQueriesShowPostData> {
    v2?: boolean;
}
/** @category Modules/Types */
export interface IqdbResult<V2 extends boolean | undefined = undefined> {
    hash: string;
    post: PostFormatV2Only<V2>;
    post_id: number;
    score: number;
}

/** @category Modules */
export default class IqdbQueries extends Base {
    @OperationID("iqdb_queries#show")
    async get<const O extends QueryIqdbGetOptions = NoV2Options>(options: O): Promise<Array<IqdbResult<O["v2"]>>> {
        return iqdbQueries_show({
            client: this.client,
            query: prefixKeys(options, "search", ["v2"]),
        }).then((res) => {
            const data = this._handleResponse(res, 200, true);
            return data.map(d => ({
                hash: d.hash,
                post: (options.v2
                    ? new BasicPost(this.e621, (d as { post: BasicPostData }).post)
                    : new IqdbPost(this.e621, (d as { post: { posts: IqdbPostData } }).post.posts)) as PostFormatV2Only<O["v2"]>,
                post_id: d.post_id,
                score: d.score,
            }));
        });
    }

    @OperationID("iqdb_queries#show_post")
    async post<const O extends QueryIqdbPostOptions = NoV2Options>(options: O): Promise<Array<IqdbResult<O["v2"]>>> {
        const { v2, ...body } = options;
        return iqdbQueries_showPost({
            client: this.client,
            query: { v2 },
            body,
        }).then((res) => {
            const data = this._handleResponse(res, 200, true);
            return data.map(d => ({
                hash: d.hash,
                post: (v2
                    ? new BasicPost(this.e621, (d as { post: BasicPostData }).post)
                    : new IqdbPost(this.e621, (d as { post: { posts: IqdbPostData } }).post.posts)) as PostFormatV2Only<O["v2"]>,
                post_id: d.post_id,
                score: d.score,
            }));
        });
    }
}
