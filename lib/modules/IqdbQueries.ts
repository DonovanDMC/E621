import { iqdbQueries_showPost, iqdbQueries_show } from "../generated/sdk.js";
import BasicPost from "../models/BasicPost.js";
import IQDBPost from "../models/IQDBPost.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";
import { type NoV2Options, type PostFormatOptions, type PostFormatV2Only } from "./posts/Format.js";

import type { Client } from "../generated/client/types.js";
import type { BasicPost as BasicPostData, IQDBPost as IqdbPostData, IqdbQueriesShowPostData, IqdbQueriesShowData } from "../generated/types.js";
import type E621 from "../index.js";

/** @category Modules/Types */
export interface QueryIqdbGetOptions extends TransformDataQueryToOptions<IqdbQueriesShowData> {}
/** @category Modules/Types */
export interface QueryIqdbPostOptions extends TransformDataBodyToOptions<IqdbQueriesShowPostData> {
    v2?: boolean;
}
/** @category Modules/Types */
export interface IqdbResult<V2 extends boolean | undefined = undefined, PF extends PostFormatOptions = NoV2Options> {
    hash: string;
    post: PostFormatV2Only<V2, PF>;
    post_id: number;
    score: number;
}

/** @category Modules */
export default class IqdbQueries<PF extends PostFormatOptions = NoV2Options> extends Base<PF> {
    static readonly moduleKey = "iqdb" as const;
    protected readonly defaultFormat: PF;
    /** @param defaultFormat - The v2 format to fall back to when `get()`/`post()` are called without an explicit `v2` option. `mode` is ignored - IQDB only ever returns the basic v2 format. */
    constructor(e621: E621<PF> | undefined, client: Client, defaultFormat: PF = {} as PF) {
        super(e621, client);
        this.defaultFormat = defaultFormat;
    }

    @OperationID("iqdb_queries#show")
    async get<const O extends QueryIqdbGetOptions = PF>(options?: O): Promise<Array<IqdbResult<O["v2"], PF>>> {
        const v2 = options?.v2 ?? this.defaultFormat.v2;
        return iqdbQueries_show({
            client: this.client,
            query: { ...(prefixKeys(options as QueryIqdbGetOptions | undefined, "search", ["v2"]) ?? {}), v2 },
        }).then((res) => {
            const data = this._handleResponse(res, 200, true);
            return data.map(d => ({
                hash: d.hash,
                post: (v2
                    ? new BasicPost(this.e621, (d as { post: BasicPostData }).post)
                    : new IQDBPost(this.e621 as unknown as E621, (d as { post: { posts: IqdbPostData } }).post.posts)) as PostFormatV2Only<O["v2"], PF>,
                post_id: d.post_id,
                score: d.score,
            }));
        });
    }

    @OperationID("iqdb_queries#show_post")
    async post<const O extends QueryIqdbPostOptions = PF>(options?: O): Promise<Array<IqdbResult<O["v2"], PF>>> {
        const { v2: rawV2, ...body } = (options ?? {}) as QueryIqdbPostOptions;
        const v2 = rawV2 ?? this.defaultFormat.v2;
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
                    : new IQDBPost(this.e621 as unknown as E621, (d as { post: { posts: IqdbPostData } }).post.posts)) as PostFormatV2Only<O["v2"], PF>,
                post_id: d.post_id,
                score: d.score,
            }));
        });
    }
}
