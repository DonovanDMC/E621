import { CommentVotesCreateResponse } from "../modules/CommentVotes.js";
import { type ExtractValue, OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { Comment as CommentData, CommentVotesCreateData, WarningRecordType } from "../generated/types.js";
import type { UpdateCommentOptions, CommentsWarningResponse } from "../modules/Comments.js";

interface Comment extends CommentData {}
/** @category Models */
@Schema("Comment")
class Comment extends Base<CommentData> {
    @OperationID("comment_votes#create")
    async createVote(score: ExtractValue<"score", CommentVotesCreateData>, no_unvote?: boolean): Promise<CommentVotesCreateResponse> {
        return this.e621.commentVotes.create(this.id, score, no_unvote);
    }

    @OperationID("comments#destroy")
    async delete(): Promise<null> {
        return this.e621.comments.delete(this.id);
    }

    @OperationID("comments#hide")
    async hide(): Promise<Comment> {
        return this.e621.comments.hide(this.id);
    }

    @OperationID("comments#warning")
    async mark(type: WarningRecordType): Promise<CommentsWarningResponse> {
        return this.e621.comments.mark(this.id, type);
    }

    @OperationID("comments#unhide")
    async unhide(): Promise<Comment> {
        return this.e621.comments.unhide(this.id);
    }

    @OperationID("comment_votes#destroy")
    async unvote(): Promise<null> {
        return this.e621.commentVotes.unvote(this.id);
    }

    @OperationID("comments#update")
    async update(options: UpdateCommentOptions): Promise<null> {
        return this.e621.comments.update(this.id, options);
    }
}

export default Comment;
