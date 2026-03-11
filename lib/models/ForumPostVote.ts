import Base from "./Base.js";
import type { ForumPostVote as ForumPostVoteData } from "../generated/types.js";
import { OperationID, Schema } from "../util.js";

interface ForumPostVote extends ForumPostVoteData {}
/** @category Models */
@Schema("ForumPostVote")
class ForumPostVote extends Base<ForumPostVoteData> {
    @OperationID("deleteForumPostVote")
    async delete(): Promise<null> {
        return this.e621.forumPosts.votes.delete(this.id);
    }
}

export default ForumPostVote;
