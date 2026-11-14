import { iqdbQueries_showPost, iqdbQueries_show } from "e621-openapi/sdk";

import BasicPost from "../models/BasicPost.js";
import IQDBPost from "../models/IQDBPost.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";
import { type NoV1Options, type PostFormatOptions, type PostFormatNoMode } from "./posts/Format.js";

import type E621 from "../index.js";
import type { Client } from "e621-openapi/client/types";
import type { BasicPost as BasicPostData, IQDBPost as IqdbPostData, IqdbQueriesShowPostData, IqdbQueriesShowData } from "e621-openapi/types";

/** @category Modules/Types */
export interface QueryIqdbGetOptions extends TransformDataQueryToOptions<IqdbQueriesShowData> {}
/** @category Modules/Types */
export interface QueryIqdbPostOptions extends TransformDataBodyToOptions<IqdbQueriesShowPostData> {
    v1?: boolean;
}
/** @category Modules/Types */
export interface IqdbResult<V1 extends boolean | undefined = undefined, PF extends PostFormatOptions = NoV1Options> {
    hash: string;
    post: PostFormatNoMode<V1, PF>;
    post_id: number;
    score: number;
}

/** @category Modules */
export default class IqdbQueries<PF extends PostFormatOptions = NoV1Options> extends Base<PF> {
    static readonly moduleKey = "iqdb" as const;
    protected readonly defaultFormat: PF;
    /** @param defaultFormat - The v1 format to fall back to when `get()`/`post()` are called without an explicit `v1` option. `mode` is ignored - IQDB only ever returns the basic format. */
    constructor(e621: E621<PF> | undefined, client: Client, defaultFormat: PF = {} as PF) {
        super(e621, client);
        this.defaultFormat = defaultFormat;
    }

    @OperationID("iqdb_queries#show")
    async get<const O extends QueryIqdbGetOptions = PF>(options?: O): Promise<Array<IqdbResult<O["v1"], PF>>> {
        const v1 = options?.v1 ?? this.defaultFormat.v1;
        return iqdbQueries_show({
            client: this.client,
            query: { ...(prefixKeys(options as QueryIqdbGetOptions | undefined, "search", ["v1"]) ?? {}), v1 },
        }).then((res) => {
            const data = this._handleResponse(res, 200, true);
            return data.map(d => ({
                hash: d.hash,
                post: (v1
                    ? new IQDBPost(this.e621 as unknown as E621, (d as { post: { posts: IqdbPostData } }).post.posts)
                    : new BasicPost(this.e621, (d as { post: BasicPostData }).post)) as PostFormatNoMode<O["v1"], PF>,
                post_id: d.post_id,
                score: d.score,
            }));
        });
    }

    @OperationID("iqdb_queries#show_post")
    async post<const O extends QueryIqdbPostOptions = PF>(options?: O): Promise<Array<IqdbResult<O["v1"], PF>>> {
        const { v1: rawV1, ...body } = (options ?? {}) as QueryIqdbPostOptions;
        const v1 = rawV1 ?? this.defaultFormat.v1;
        return iqdbQueries_showPost({
            client: this.client,
            query: { v1 },
            body,
        }).then((res) => {
            const data = this._handleResponse(res, 200, true);
            return data.map(d => ({
                hash: d.hash,
                post: (v1
                    ? new IQDBPost(this.e621 as unknown as E621, (d as { post: { posts: IqdbPostData } }).post.posts)
                    : new BasicPost(this.e621, (d as { post: BasicPostData }).post)) as PostFormatNoMode<O["v1"], PF>,
                post_id: d.post_id,
                score: d.score,
            }));
        });
    }
}
