import { popular_index } from "../generated/sdk.js";
import { OperationID, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";
import { type AnyPostData, type NoV2Options, type PostFormat, type PostFormatOptions, wrapPosts } from "./posts/Format.js";

import type { Client } from "../generated/client/types.js";
import type { LegacyPost as LegacyPostData, PopularIndexData } from "../generated/types.js";
import type E621 from "../index.js";

/** @category Modules/Types */
export interface GetPopularPostsOptions extends TransformDataQueryToOptions<PopularIndexData> {}

/** @category Modules */
export default class Popular<PF extends PostFormatOptions = NoV2Options> extends Base<PF> {
    static readonly moduleKey = "popular" as const;
    protected readonly defaultFormat: PF;
    /** @param defaultFormat - The v2/mode format to fall back to when `get()` is called without explicit v2/mode options. */
    constructor(e621: E621<PF> | undefined, client: Client, defaultFormat: PF = {} as PF) {
        super(e621, client);
        this.defaultFormat = defaultFormat;
    }

    @OperationID("popular#index")
    async get<const O extends GetPopularPostsOptions = PF>(options?: O): Promise<Array<PostFormat<O["v2"], O["mode"], PF>>> {
        const v2 = options?.v2 ?? this.defaultFormat.v2;
        const mode = options?.mode ?? this.defaultFormat.mode;
        return popular_index({
            client: this.client,
            query: { ...options, v2, mode },
        }).then((res) => {
            const data = this._handleResponse(res, 200, true);
            const raw = (v2 ? data : (data as { posts: Array<LegacyPostData> }).posts) as Array<AnyPostData>;
            return wrapPosts(this.e621, raw, v2, mode) as Array<PostFormat<O["v2"], O["mode"], PF>>;
        });
    }
}
