import { type ForumPostVoteScore, ForumPostVotesCreateResponse } from "../modules/ForumPostVotes.js";
import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";
import ForumPostVote from "./ForumPostVote.js";

import type { ForumPost as ForumPostData, WarningRecordType } from "../generated/types.js";
import type { UpdateForumPostOptions, ForumPostsWarningResponse } from "../modules/ForumPosts.js";

interface ForumPost extends ForumPostData {}
/** @category Models */
@Schema("ForumPost")
class ForumPost extends Base<ForumPostData> {
    @OperationID("forum_posts#destroy")
    async delete(): Promise<null> {
        return this.e621.forumPosts.delete(this.id);
    }

    @OperationID("forum_posts#hide")
    async hide(): Promise<ForumPost> {
        return this.e621.forumPosts.hide(this.id);
    }

    @OperationID("forum_posts#warning")
    async mark(type: WarningRecordType): Promise<ForumPostsWarningResponse> {
        return this.e621.forumPosts.mark(this.id, type);
    }

    @OperationID("forum_posts#unhide")
    async unhide(): Promise<ForumPost> {
        return this.e621.forumPosts.unhide(this.id);
    }

    @OperationID("forum_post_votes#destroy")
    async unvote(): Promise<null> {
        return this.e621.forumPostVotes.delete(this.id);
    }

    @OperationID("forum_posts#update")
    async update(options: UpdateForumPostOptions): Promise<null> {
        return this.e621.forumPosts.update(this.id, options);
    }

    @OperationID("forum_post_votes#create")
    async vote(score: ForumPostVoteScore): Promise<ForumPostVotesCreateResponse> {
        return this.e621.forumPostVotes.create(this.id, score);
    }

    @OperationID("forum_post_votes#show")
    async votes(): Promise<Array<ForumPostVote>> {
        return this.e621.forumPostVotes.list(this.id);
    }
}

export default ForumPost;
