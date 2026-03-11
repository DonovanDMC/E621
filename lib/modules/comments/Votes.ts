import { createCommentVote, deleteCommentVote } from "../../generated/sdk.js";
import { type CreateCommentVoteData, type CreateCommentVoteResponses } from "../../generated/types.js";
import { OperationID, type ExtractValue } from "../../util.js";
import Base from "../Base.js";

/** @category Modules */
export default class CommentVotes extends Base {
    @OperationID("createCommentVote")
    async create(id: number, score: ExtractValue<"score", CreateCommentVoteData>, no_unvote?: boolean): Promise<CreateCommentVoteResponses[200]> {
        return createCommentVote({
            client: this.client,
            path:   { id },
            query:  { no_unvote, score }
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("deleteCommentVote")
    async delete(id: number): Promise<null> {
        return deleteCommentVote({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 204, true));
    }
}
