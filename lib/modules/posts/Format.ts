import BasicPost from "../../models/BasicPost.js";
import ExtendedPost from "../../models/ExtendedPost.js";
import Post from "../../models/Post.js";
import ThumbnailPost from "../../models/ThumbnailPost.js";

import type E621 from "../../index.js";
import type {
    BasicPost as BasicPostData,
    ExtendedPost as ExtendedPostData,
    LegacyPost as LegacyPostData,
    ThumbnailPost as ThumbnailPostData,
} from "e621-openapi/types";

/** @category Modules/Types */
export type PostMode = "basic" | "extended" | "thumbnail";
/** @category Modules/Types */
export type AnyPostData = BasicPostData | ExtendedPostData | LegacyPostData | ThumbnailPostData;
/** @category Modules/Types */
export type AnyPost<PF extends PostFormatOptions = NoV1Options> = BasicPost<PF> | ExtendedPost<PF> | Post<PF> | ThumbnailPost<PF>;

/**
 * The shape of a v1/mode default - bounds the `defaultPostFormat` {@link Options} and every generic
 * method/model that resolves its return type from it.
 *
 * @category Modules/Types
 */
export interface PostFormatOptions {
    mode?: PostMode;
    v1?: boolean;
}

/** @category Modules/Types */
export type PostFormat<V1 extends boolean | undefined, Mode extends PostMode | undefined, PF extends PostFormatOptions = NoV1Options>
    = V1 extends true
        ? Post<PF>
        : Mode extends "extended" ? ExtendedPost<PF>
            : Mode extends "thumbnail" ? ThumbnailPost<PF>
                : BasicPost<PF>;

/** @category Modules/Types */
export type PostFormatNoMode<V1 extends boolean | undefined, PF extends PostFormatOptions = NoV1Options> = PostFormat<V1, undefined, PF>;

/**
 * Default type argument for generic methods accepting v1/mode options, resolving {@link PostFormat} to the `BasicPost` model when no options are provided.
 *
 * @category Modules/Types
 */
export interface NoV1Options {
    mode?: undefined;
    v1?: undefined;
}

export function wrapPost<V1 extends boolean | undefined, Mode extends PostMode | undefined, PF extends PostFormatOptions = NoV1Options>(e621: E621<PF>, data: AnyPostData, v1: V1, mode: Mode): PostFormat<V1, Mode, PF> {
    if (v1 === true) return new Post(e621, data as LegacyPostData) as PostFormat<V1, Mode, PF>;
    if (mode === "extended") return new ExtendedPost(e621, data as ExtendedPostData) as PostFormat<V1, Mode, PF>;
    if (mode === "thumbnail") return new ThumbnailPost(e621, data as ThumbnailPostData) as PostFormat<V1, Mode, PF>;
    return new BasicPost(e621, data as BasicPostData) as PostFormat<V1, Mode, PF>;
}

export function wrapPosts<V1 extends boolean | undefined, Mode extends PostMode | undefined, PF extends PostFormatOptions = NoV1Options>(e621: E621<PF>, data: Array<AnyPostData>, v1: V1, mode: Mode): Array<PostFormat<V1, Mode, PF>> {
    return data.map(item => wrapPost(e621, item, v1, mode));
}
