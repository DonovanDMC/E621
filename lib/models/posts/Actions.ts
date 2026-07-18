import { PostVotesCreateResponse } from "../../modules/PostVotes.js";
import { type ExtractValue, OperationID } from "../../util.js";
import Base from "../Base.js";

import type { PostVotesCreateData } from "../../generated/types.js";
import type { FavoritesCreateResponse, FavoritesDestroyResponse } from "../../modules/Favorites.js";
import type { DisapprovePostOptions } from "../../modules/PostDisapprovals.js";
import type { FlagPostOptions } from "../../modules/PostFlags.js";
import type { NoV2Options, PostFormat } from "../../modules/posts/Format.js";
import type {
    DeletePostOptions,
    GetPostInSequenceOptions,
    ListPostFavoritesOptions,
    MarkPostAsTranslatedOptions,
    MovePostFavoritesOptions,
    PostPreviousOwner,
    RecommendedPostsOptions,
    RecommendedPostsResult,
    ReownPostOptions,
    UpdatePostIqdbOptions,
    UpdatePostOptions,
} from "../../modules/Posts.js";
import type MinimalUser from "../MinimalUser.js";
import type Post from "../Post.js";
import type PostDisapproval from "../PostDisapproval.js";
import type PostFlag from "../PostFlag.js";

/** @category Models */
export default abstract class PostActions<T extends { id: number }> extends Base<T> {
    declare id: number;

    @OperationID("staff/post/posts#ai_check")
    async aiCheck(): Promise<string> {
        return this.e621.posts.aiCheck(this.id);
    }

    @OperationID("staff/post/approvals#create")
    async approve(): Promise<null> {
        return this.e621.postApprovals.create(this.id);
    }

    @OperationID("posts#copy_notes")
    async copyNotes(other_post_id: number): Promise<null> {
        return this.e621.posts.copyNotes(this.id, other_post_id);
    }

    @OperationID("post_votes#create")
    async createVote(score: ExtractValue<"score", PostVotesCreateData>, no_unvote?: boolean): Promise<PostVotesCreateResponse> {
        return this.e621.postVotes.create(this.id, score, no_unvote);
    }

    @OperationID("staff/post/posts#delete")
    async delete(options: DeletePostOptions): Promise<unknown> {
        return this.e621.posts.delete(this.id, options);
    }

    @OperationID("staff/post/disapprovals#create")
    async disapprove(options: DisapprovePostOptions): Promise<PostDisapproval> {
        return this.e621.postDisapprovals.create({ ...options, post_id: this.id });
    }

    @OperationID("staff/post/posts#expunge")
    async expunge(reason: string): Promise<Post> {
        return this.e621.posts.expunge(this.id, reason);
    }

    @OperationID("favorites#create")
    async favorite(): Promise<FavoritesCreateResponse> {
        return this.e621.favorites.create(this.id);
    }

    @OperationID("post_favorites#index")
    async favorites(options: ListPostFavoritesOptions): Promise<Array<MinimalUser>> {
        return this.e621.posts.favorites(this.id, options);
    }

    @OperationID("post_flags#create")
    async flag(options: FlagPostOptions): Promise<PostFlag> {
        return this.e621.postFlags.create({ ...options, post_id: this.id });
    }

    @OperationID("posts#mark_as_translated")
    async markTranslated<const O extends MarkPostAsTranslatedOptions = NoV2Options>(options?: O): Promise<PostFormat<O["v2"], O["mode"]>> {
        return this.e621.posts.markTranslated(this.id, options);
    }

    @OperationID("staff/post/posts#move_favorites")
    async moveFavorites(options: MovePostFavoritesOptions): Promise<unknown> {
        return this.e621.posts.moveFavorites(this.id, options);
    }

    @OperationID("staff/post/posts#previous_owners")
    async previousOwners(): Promise<Array<PostPreviousOwner>> {
        return this.e621.posts.previousOwners(this.id);
    }

    @OperationID("post_recommendations#artist")
    async recommendedByArtist(options?: RecommendedPostsOptions): Promise<RecommendedPostsResult> {
        return this.e621.posts.recommendedByArtist(this.id, options);
    }

    @OperationID("post_recommendations#tags")
    async recommendedByTags(options?: RecommendedPostsOptions): Promise<RecommendedPostsResult> {
        return this.e621.posts.recommendedByTags(this.id, options);
    }

    @OperationID("staff/post/posts#regenerate_thumbnails")
    async regenerateThumbnails(): Promise<Post> {
        return this.e621.posts.regenerateThumbnails(this.id);
    }

    @OperationID("staff/post/posts#regenerate_videos")
    async regenerateVideos(): Promise<null> {
        return this.e621.posts.regenerateVideos(this.id);
    }

    @OperationID("staff/post/posts#reowner")
    async reown(options: ReownPostOptions): Promise<string> {
        return this.e621.posts.reown(this.id, options);
    }

    @OperationID("posts#revert")
    async revert(version_id: number): Promise<null> {
        return this.e621.posts.revert(this.id, version_id);
    }

    @OperationID("posts#show_seq")
    async sequence<const O extends GetPostInSequenceOptions = NoV2Options>(options?: O): Promise<PostFormat<O["v2"], O["mode"]>> {
        return this.e621.posts.sequence(this.id, options);
    }

    @OperationID("staff/post/approvals#destroy")
    async unapprove(): Promise<null> {
        return this.e621.postApprovals.delete(this.id);
    }

    @OperationID("staff/post/posts#undelete")
    async undelete(): Promise<Post> {
        return this.e621.posts.undelete(this.id);
    }

    @OperationID("favorites#destroy")
    async unfavorite(): Promise<FavoritesDestroyResponse> {
        return this.e621.favorites.delete(this.id);
    }

    @OperationID("post_votes#destroy")
    async unvote(): Promise<null> {
        return this.e621.postVotes.unvote(this.id);
    }

    @OperationID("posts#update")
    async update<const O extends UpdatePostOptions = NoV2Options>(options?: O): Promise<PostFormat<O["v2"], O["mode"]>> {
        return this.e621.posts.update(this.id, options);
    }

    @OperationID("posts#update_iqdb")
    async updateIqdb<const O extends UpdatePostIqdbOptions = NoV2Options>(options?: O): Promise<PostFormat<O["v2"], O["mode"]>> {
        return this.e621.posts.updateIqdb(this.id, options);
    }
}
