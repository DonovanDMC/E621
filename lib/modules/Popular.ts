import { popular_index } from "e621-openapi/sdk";

import { OperationID, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";
import { type AnyPostData, type NoV1Options, type PostFormat, type PostFormatOptions, wrapPosts } from "./posts/Format.js";

import type E621 from "../index.js";
import type { Client } from "e621-openapi/client/types";
import type { LegacyPost as LegacyPostData, PopularIndexData } from "e621-openapi/types";

/** @category Modules/Types */
export interface GetPopularPostsOptions extends TransformDataQueryToOptions<PopularIndexData> {}

/** @category Modules */
export default class Popular<PF extends PostFormatOptions = NoV1Options> extends Base<PF> {
    static readonly moduleKey = "popular" as const;
    protected readonly defaultFormat: PF;
    /** @param defaultFormat - The v1/mode format to fall back to when `get()` is called without explicit v1/mode options. */
    constructor(e621: E621<PF> | undefined, client: Client, defaultFormat: PF = {} as PF) {
        super(e621, client);
        this.defaultFormat = defaultFormat;
    }

    @OperationID("popular#index")
    async get<const O extends GetPopularPostsOptions = PF>(options?: O): Promise<Array<PostFormat<O["v1"], O["mode"], PF>>> {
        const v1 = options?.v1 ?? this.defaultFormat.v1;
        const mode = options?.mode ?? this.defaultFormat.mode;
        return popular_index({
            client: this.client,
            query: { ...options, v1, mode },
        }).then((res) => {
            const data = this._handleResponse(res, 200, true);
            const raw = (v1 ? (data as { posts: Array<LegacyPostData> }).posts : data) as Array<AnyPostData>;
            return wrapPosts(this.e621, raw, v1, mode) as Array<PostFormat<O["v1"], O["mode"], PF>>;
        });
    }
}
