import BasicPost from "../../models/BasicPost.js";
import ExtendedPost from "../../models/ExtendedPost.js";
import Post from "../../models/Post.js";
import ThumbnailPost from "../../models/ThumbnailPost.js";

import type {
    BasicPost as BasicPostData,
    ExtendedPost as ExtendedPostData,
    LegacyPost as LegacyPostData,
    ThumbnailPost as ThumbnailPostData,
} from "../../generated/types.js";
import type E621 from "../../index.js";

/** @category Modules/Types */
export type PostV2Mode = "basic" | "extended" | "thumbnail";
/** @category Modules/Types */
export type AnyPostData = BasicPostData | ExtendedPostData | LegacyPostData | ThumbnailPostData;
/** @category Modules/Types */
export type AnyPost = BasicPost | ExtendedPost | Post | ThumbnailPost;

/** @category Modules/Types */
export type PostFormat<V2 extends boolean | undefined, Mode extends PostV2Mode | undefined>
    = V2 extends true
        ? Mode extends "extended" ? ExtendedPost
            : Mode extends "thumbnail" ? ThumbnailPost
                : BasicPost
        : Post;

/** @category Modules/Types */
export type PostFormatV2Only<V2 extends boolean | undefined> = PostFormat<V2, undefined>;

/**
 * Default type argument for generic methods accepting v2/mode options, resolving {@link PostFormat} to the legacy `Post` model when no options are provided.
 *
 * @category Modules/Types
 */
export interface NoV2Options {
    mode?: undefined;
    v2?: undefined;
}

export function wrapPost<V2 extends boolean | undefined, Mode extends PostV2Mode | undefined>(e621: E621, data: AnyPostData, v2: V2, mode: Mode): PostFormat<V2, Mode> {
    if (v2 !== true) return new Post(e621, data as LegacyPostData) as PostFormat<V2, Mode>;
    if (mode === "extended") return new ExtendedPost(e621, data as ExtendedPostData) as PostFormat<V2, Mode>;
    if (mode === "thumbnail") return new ThumbnailPost(e621, data as ThumbnailPostData) as PostFormat<V2, Mode>;
    return new BasicPost(e621, data as BasicPostData) as PostFormat<V2, Mode>;
}

export function wrapPosts<V2 extends boolean | undefined, Mode extends PostV2Mode | undefined>(e621: E621, data: Array<AnyPostData>, v2: V2, mode: Mode): Array<PostFormat<V2, Mode>> {
    return data.map(item => wrapPost(e621, item, v2, mode));
}
