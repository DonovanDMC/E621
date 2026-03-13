import Base from "./Base.js";
import type { CreateForumPostVoteData, ForumPost as ForumPostData, MarkForumPostData } from "../generated/types.js";
import { type ExtractValue, OperationID, Schema } from "../util.js";
import type { EditForumPostOptions, MarkForumPostResponse } from "../modules/ForumPosts.js";
import { CreateForumPostVoteResponse } from "../modules/forum_posts/Votes.js";

interface ForumPost extends ForumPostData {}
/** @category Models */
@Schema("ForumPost")
class ForumPost extends Base<ForumPostData> {
    @OperationID("deleteForumPost")
    async delete(): Promise<null> {
        return this.e621.forumPosts.delete(this.id);
    }

    @OperationID("editForumPost")
    async edit(options: EditForumPostOptions): Promise<null> {
        return this.e621.forumPosts.edit(this.id, options);
    }

    @OperationID("hideForumPost")
    async hide(): Promise<ForumPost> {
        return this.e621.forumPosts.hide(this.id);
    }

    @OperationID("markForumPost")
    async mark(type: ExtractValue<"record_type", MarkForumPostData>): Promise<MarkForumPostResponse> {
        return this.e621.forumPosts.mark(this.id, type);
    }

    @OperationID("unhideForumPost")
    async unhide(): Promise<ForumPost> {
        return this.e621.forumPosts.unhide(this.id);
    }

    @OperationID("deleteForumPostVote")
    async unvote(): Promise<null> {
        return this.e621.forumPosts.votes.delete(this.id);
    }

    @OperationID("createForumPostVote")
    async vote(score: ExtractValue<"forum_post_vote[score]", CreateForumPostVoteData>): Promise<CreateForumPostVoteResponse> {
        return this.e621.forumPosts.votes.create(this.id, score);
    }

}

export default ForumPost;
