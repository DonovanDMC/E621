import {
    staffPostPosts_aiCheck,
    posts_copyNotes,
    staffPostPosts_delete,
    staffPostPosts_expunge,
    posts_show,
    posts_showSeq,
    staffPostPosts_previousOwners,
    posts_random,
    postRecommendations_artist,
    postRecommendations_tags,
    postFavorites_index,
    posts_markAsTranslated,
    staffPostPosts_moveFavorites,
    staffPostPosts_regenerateThumbnails,
    staffPostPosts_regenerateVideos,
    staffPostPosts_reowner,
    posts_revert,
    posts_index,
    staffPostPosts_undelete,
    posts_update,
    posts_updateIqdb,
} from "../generated/sdk.js";
import MinimalUser from "../models/MinimalUser.js";
import Post from "../models/Post.js";
import ThumbnailPost from "../models/ThumbnailPost.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";
import { type AnyPostData, type NoV2Options, type PostFormat, wrapPost, wrapPosts } from "./posts/Format.js";

import type {
    StaffPostPostsDeleteData,
    PostsShowData,
    PostsShowSeqData,
    PostsRandomData,
    PostRecommendationsArtistData,
    LegacyPost as LegacyPostData,
    PostFavoritesIndexData,
    PostsMarkAsTranslatedData,
    StaffPostPostsMoveFavoritesData,
    PostRecommendation,
    StaffPostPostsReownerData,
    PostsIndexData,
    PostsUpdateData,
    PostsUpdateIqdbData,
} from "../generated/types.js";

/** @category Modules/Types */
export interface DeletePostOptions extends TransformDataBodyToOptions<StaffPostPostsDeleteData> {}
/** @category Modules/Types */
export interface MovePostFavoritesOptions extends TransformDataBodyToOptions<StaffPostPostsMoveFavoritesData> {}
/** @category Modules/Types */
export interface SearchPostsOptions extends TransformDataQueryToOptions<PostsIndexData> {}
/** @category Modules/Types */
export interface ListPostFavoritesOptions extends TransformDataQueryToOptions<PostFavoritesIndexData> {}
/** @category Modules/Types */
export interface GetRandomPostOptions extends TransformDataQueryToOptions<PostsRandomData> {}
/** @category Modules/Types */
export interface GetPostOptions extends TransformDataQueryToOptions<PostsShowData> {}
/** @category Modules/Types */
export interface GetPostInSequenceOptions extends TransformDataQueryToOptions<PostsShowSeqData> {}
/** @category Modules/Types */
export interface MarkPostAsTranslatedOptions extends TransformDataQueryToOptions<PostsMarkAsTranslatedData> {}
/** @category Modules/Types */
export interface UpdatePostOptions extends TransformDataBodyToOptions<PostsUpdateData>, TransformDataQueryToOptions<PostsUpdateData> {}
/** @category Modules/Types */
export interface UpdatePostIqdbOptions extends TransformDataQueryToOptions<PostsUpdateIqdbData> {}
/** @category Modules/Types */
export interface RecommendedPostsOptions extends TransformDataQueryToOptions<PostRecommendationsArtistData> {}
/** @category Modules/Types */
export interface ReownPostOptions extends TransformDataBodyToOptions<StaffPostPostsReownerData> {}
/** @category Modules/Types */
export interface PostPreviousOwner {
    id: number;
    name: string;
}
/** @category Modules/Types */
export interface RecommendedPostsResult {
    model_version: string;
    post_data: Array<ThumbnailPost>;
    post_id: number;
    results: Array<PostRecommendation>;
}
/** @category Modules/Types */
export type PostSearchResult<O extends SearchPostsOptions>
    = O extends { md5: string }
        ? PostFormat<O["v2"], O["mode"]>
        : Array<PostFormat<O["v2"], O["mode"]>>;

/** @category Modules */
export default class Posts extends Base {
    @OperationID("staff/post/posts#ai_check")
    async aiCheck(id: number): Promise<string> {
        const res = await staffPostPosts_aiCheck({
            client: this.client,
            path: { id },
            redirect: "manual",
        });
        return this._handleResponse(res, 302, true);
    }

    @OperationID("posts#copy_notes")
    async copyNotes(id: number, other_post_id: number): Promise<null> {
        return posts_copyNotes({
            client: this.client,
            path: { id },
            body: { other_post_id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("staff/post/posts#delete")
    async delete(id: number, options: DeletePostOptions): Promise<unknown> {
        return staffPostPosts_delete({
            client: this.client,
            path: { id },
            body: options,
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("staff/post/posts#expunge")
    async expunge(id: number, reason: string): Promise<Post> {
        return staffPostPosts_expunge({
            client: this.client,
            path: { id },
            body: { reason },
        }).then((res) => {
            const data = this._handleResponse(res, 201, true);
            // NOTE: the spec still references the "Post" (v2 base) schema here, but this endpoint has no v2 param - the response is actually legacy-shaped.
            return new Post(this.e621, data.post as unknown as LegacyPostData);
        });
    }

    @OperationID("post_favorites#index")
    async favorites(id: number, options: ListPostFavoritesOptions): Promise<Array<MinimalUser>> {
        return postFavorites_index({
            client: this.client,
            path: { id },
            query: options,
        }).then(res => this._handleResponse(res, 200, true, MinimalUser));
    }

    @OperationID("posts#show")
    async get<const O extends GetPostOptions = NoV2Options>(id: number, options?: O): Promise<PostFormat<O["v2"], O["mode"]> | null> {
        return posts_show({
            client: this.client,
            path: { id },
            query: options,
        }).then((res) => {
            const data = this._handleResponse(res, 200, false);
            if (data === null) return null;
            const raw = (options?.v2 ? data : (data as { post: LegacyPostData }).post) as AnyPostData;
            return wrapPost(this.e621, raw, options?.v2, options?.mode) as PostFormat<O["v2"], O["mode"]>;
        });
    }

    @OperationID("posts#mark_as_translated")
    async markTranslated<const O extends MarkPostAsTranslatedOptions = NoV2Options>(id: number, options?: O): Promise<PostFormat<O["v2"], O["mode"]>> {
        return posts_markAsTranslated({
            client: this.client,
            path: { id },
            query: options,
        }).then((res) => {
            const data = this._handleResponse(res, 200, true);
            const raw = (options?.v2 ? data : (data as { post: LegacyPostData }).post) as AnyPostData;
            return wrapPost(this.e621, raw, options?.v2, options?.mode) as PostFormat<O["v2"], O["mode"]>;
        });
    }

    @OperationID("staff/post/posts#move_favorites")
    async moveFavorites(id: number, options: MovePostFavoritesOptions): Promise<unknown> {
        return staffPostPosts_moveFavorites({
            client: this.client,
            path: { id },
            body: options,
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("staff/post/posts#previous_owners")
    async previousOwners(id: number): Promise<Array<PostPreviousOwner>> {
        return staffPostPosts_previousOwners({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("posts#random")
    async random<const O extends GetRandomPostOptions = NoV2Options>(options?: O): Promise<PostFormat<O["v2"], O["mode"]>> {
        return posts_random({
            client: this.client,
            query: options,
        }).then((res) => {
            const data = this._handleResponse(res, 200, true);
            const raw = (options?.v2 ? data : (data as { post: LegacyPostData }).post) as AnyPostData;
            return wrapPost(this.e621, raw, options?.v2, options?.mode) as PostFormat<O["v2"], O["mode"]>;
        });
    }

    @OperationID("post_recommendations#artist")
    async recommendedByArtist(id: number, options?: RecommendedPostsOptions): Promise<RecommendedPostsResult> {
        return postRecommendations_artist({
            client: this.client,
            path: { id },
            query: options,
        }).then((res) => {
            const data = this._handleResponse(res, 200, true);
            return { ...data, post_data: data.post_data.map(post => new ThumbnailPost(this.e621, post)) };
        });
    }

    @OperationID("post_recommendations#tags")
    async recommendedByTags(id: number, options?: RecommendedPostsOptions): Promise<RecommendedPostsResult> {
        return postRecommendations_tags({
            client: this.client,
            path: { id },
            query: options,
        }).then((res) => {
            const data = this._handleResponse(res, 200, true);
            return { ...data, post_data: data.post_data.map(post => new ThumbnailPost(this.e621, post)) };
        });
    }

    @OperationID("staff/post/posts#regenerate_thumbnails")
    async regenerateThumbnails(id: number): Promise<Post> {
        return staffPostPosts_regenerateThumbnails({
            client: this.client,
            path: { id },
        }).then((res) => {
            const data = this._handleResponse(res, 201, true);
            return new Post(this.e621, data.post as unknown as LegacyPostData);
        });
    }

    @OperationID("staff/post/posts#regenerate_videos")
    async regenerateVideos(id: number): Promise<null> {
        return staffPostPosts_regenerateVideos({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("staff/post/posts#reowner")
    async reown(id: number, options: ReownPostOptions): Promise<string> {
        return staffPostPosts_reowner({
            client: this.client,
            path: { id },
            body: prefixKeys(options, "reowner"),
            redirect: "manual",
        }).then(res => this._handleResponse(res, 302, true));
    }

    @OperationID("posts#revert")
    async revert(id: number, version_id: number): Promise<null> {
        return posts_revert({
            client: this.client,
            path: { id },
            query: { version_id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("posts#index")
    async search<const O extends SearchPostsOptions = NoV2Options>(options?: O): Promise<PostSearchResult<O>> {
        return posts_index({
            client: this.client,
            query: options,
        }).then((res) => {
            const data = this._handleResponse(res, 200, true);
            if (options?.md5) {
                const raw = (options.v2 ? data : (data as { post: LegacyPostData }).post) as AnyPostData;
                return wrapPost(this.e621, raw, options.v2, options.mode) as PostSearchResult<O>;
            }
            const raw = (options?.v2 ? data : (data as { posts: Array<LegacyPostData> }).posts) as Array<AnyPostData>;
            return wrapPosts(this.e621, raw, options?.v2, options?.mode) as PostSearchResult<O>;
        });
    }

    @OperationID("posts#show_seq")
    async sequence<const O extends GetPostInSequenceOptions = NoV2Options>(id: number, options?: O): Promise<PostFormat<O["v2"], O["mode"]>> {
        return posts_showSeq({
            client: this.client,
            path: { id },
            query: options,
        }).then((res) => {
            const data = this._handleResponse(res, 200, true);
            const raw = (options?.v2 ? data : (data as { post: LegacyPostData }).post) as AnyPostData;
            return wrapPost(this.e621, raw, options?.v2, options?.mode) as PostFormat<O["v2"], O["mode"]>;
        });
    }

    @OperationID("staff/post/posts#undelete")
    async undelete(id: number): Promise<Post> {
        return staffPostPosts_undelete({
            client: this.client,
            path: { id },
        }).then((res) => {
            const data = this._handleResponse(res, 201, true);
            return new Post(this.e621, data.post as unknown as LegacyPostData);
        });
    }

    @OperationID("posts#update")
    async update<const O extends UpdatePostOptions = NoV2Options>(id: number, options?: O): Promise<PostFormat<O["v2"], O["mode"]>> {
        const { v2, mode, ...body } = (options ?? {}) as UpdatePostOptions;
        return posts_update({
            client: this.client,
            path: { id },
            query: { v2, mode },
            body,
        }).then((res) => {
            const data = this._handleResponse(res, 200, true);
            const raw = (v2 ? data : (data as { post: LegacyPostData }).post) as AnyPostData;
            return wrapPost(this.e621, raw, v2, mode) as PostFormat<O["v2"], O["mode"]>;
        });
    }

    @OperationID("posts#update_iqdb")
    async updateIqdb<const O extends UpdatePostIqdbOptions = NoV2Options>(id: number, options?: O): Promise<PostFormat<O["v2"], O["mode"]>> {
        return posts_updateIqdb({
            client: this.client,
            path: { id },
            query: options,
        }).then((res) => {
            const data = this._handleResponse(res, 200, true);
            const raw = (options?.v2 ? data : (data as { post: LegacyPostData }).post) as AnyPostData;
            return wrapPost(this.e621, raw, options?.v2, options?.mode) as PostFormat<O["v2"], O["mode"]>;
        });
    }
}
