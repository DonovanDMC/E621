import { CreateCommentVoteResponse } from "../modules/comments/Votes.js";
import { type ExtractValue, OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { Comment as CommentData, CreateCommentVoteData, MarkCommentData } from "../generated/types.js";
import type { EditCommentOptions, MarkCommentResponse } from "../modules/Comments.js";

interface Comment extends CommentData {}
/** @category Models */
@Schema("Comment")
class Comment extends Base<CommentData> {
    @OperationID("deleteComment")
    async delete(): Promise<null> {
        return this.e621.comments.delete(this.id);
    }

    @OperationID("editComment")
    async edit(options: EditCommentOptions): Promise<null> {
        return this.e621.comments.edit(this.id, options);
    }

    @OperationID("hideComment")
    async hide(): Promise<Comment> {
        return this.e621.comments.hide(this.id);
    }

    @OperationID("markComment")
    async mark(type: ExtractValue<"record_type", MarkCommentData>): Promise<MarkCommentResponse> {
        return this.e621.comments.mark(this.id, type);
    }

    @OperationID("unhideComment")
    async unhide(): Promise<Comment> {
        return this.e621.comments.unhide(this.id);
    }

    @OperationID("deleteCommentVote")
    async unvote(): Promise<null> {
        return this.e621.comments.votes.delete(this.id);
    }

    @OperationID("createCommentVote")
    async vote(score: ExtractValue<"score", CreateCommentVoteData>, no_unvote?: boolean): Promise<CreateCommentVoteResponse> {
        return this.e621.comments.votes.create(this.id, score, no_unvote);
    }
}

export default Comment;
