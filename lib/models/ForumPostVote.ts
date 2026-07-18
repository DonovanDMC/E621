import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { ForumPostVote as ForumPostVoteData } from "../generated/types.js";

interface ForumPostVote extends ForumPostVoteData {}
/** @category Models */
@Schema("ForumPostVote")
class ForumPostVote extends Base<ForumPostVoteData> {
    @OperationID("forum_post_votes#destroy")
    async delete(): Promise<null> {
        return this.e621.forumPostVotes.delete(this.id);
    }
}

export default ForumPostVote;
