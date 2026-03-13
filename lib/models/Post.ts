import Base from "./Base.js";
import type { CreatePostVoteData, Post as PostData } from "../generated/types.js";
import { type ExtractValue, OperationID, Schema } from "../util.js";
import type { DeletePostOptions, ListPostFavoritesOptions, MovePostFavoritesOptions } from "../modules/Posts.js";
import { CreatePostVoteResponse } from "../modules/posts/Votes.js";

interface Post extends PostData {}
/** @category Models */
@Schema("Post")
class Post extends Base<PostData> {
    @OperationID("aiCheckPost")
    async aiCheck(): Promise<string> {
        return this.e621.posts.aiCheck(this.id);
    }

    @OperationID("copyNotesToPost")
    async copyNotes(other_post_id: number): Promise<null> {
        return this.e621.posts.copyNotes(this.id, other_post_id);
    }

    @OperationID("deletePost")
    async delete(options: DeletePostOptions): Promise<unknown> {
        return this.e621.posts.delete(this.id, options);
    }

    @OperationID("expungePost")
    async expunge(reason: string): Promise<Post> {
        return this.e621.posts.expunge(this.id, reason);
    }

    @OperationID("listPostFavorites")
    async favorites(options: ListPostFavoritesOptions): Promise<Array<Post>> {
        return this.e621.posts.favorites(this.id, options);
    }

    @OperationID("markPostAsTranslated")
    async markTranslated(): Promise<Post> {
        return this.e621.posts.markTranslated(this.id);
    }

    @OperationID("movePostFavorites")
    async moveFavorites(options: MovePostFavoritesOptions): Promise<unknown> {
        return this.e621.posts.moveFavorites(this.id, options);
    }

    @OperationID("regeneratePostThumbnails")
    async regenerateThumbnails(): Promise<Post> {
        return this.e621.posts.regenerateThumbnails(this.id);
    }

    @OperationID("regeneratePostVideos")
    async regenerateVideos(): Promise<null> {
        return this.e621.posts.regenerateVideos(this.id);
    }

    @OperationID("revertPost")
    async revert(version_id: number): Promise<null> {
        return this.e621.posts.revert(this.id, version_id);
    }

    @OperationID("undeletePost")
    async undelete(): Promise<Post> {
        return this.e621.posts.undelete(this.id);
    }

    @OperationID("deletePostVote")
    async unvote(): Promise<null> {
        return this.e621.posts.votes.delete(this.id);
    }

    @OperationID("updatePostIqdb")
    async updateIqdb(): Promise<Post> {
        return this.e621.posts.updateIqdb(this.id);
    }

    @OperationID("createPostVote")
    async vote(score: ExtractValue<"score", CreatePostVoteData>, no_unvote?: boolean): Promise<CreatePostVoteResponse> {
        return this.e621.posts.votes.create(this.id, score, no_unvote);
    }

}

export default Post;
