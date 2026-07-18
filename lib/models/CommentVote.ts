import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { CommentVote as CommentVoteData } from "../generated/types.js";

interface CommentVote extends CommentVoteData {}
/** @category Models */
@Schema("CommentVote")
class CommentVote extends Base<CommentVoteData> {
    @OperationID("comment_votes#destroy")
    async delete(): Promise<null> {
        return this.e621.commentVotes.unvote(this.comment_id);
    }

    @OperationID("comment_votes#lock")
    async lock(): Promise<null> {
        return this.e621.commentVotes.lock([this.id]);
    }

    @OperationID("comment_votes#delete")
    async staffDelete(): Promise<null> {
        return this.e621.commentVotes.delete([this.id]);
    }
}

export default CommentVote;
