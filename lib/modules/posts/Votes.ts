import { createPostVote, deletePostVote } from "../../generated/sdk.js";
import type { CreatePostVoteData, CreatePostVoteResponses } from "../../generated/types.js";
import { OperationID, type ExtractValue } from "../../util.js";
import Base from "../Base.js";

/** @category Modules */
export default class PostVotes extends Base {
    @OperationID("createPostVote")
    async create(id: number, score: ExtractValue<"score", CreatePostVoteData>, no_unvote?: boolean): Promise<CreatePostVoteResponses[200]> {
        return createPostVote({
            client: this.client,
            path:   { id },
            query:  { no_unvote, score }
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("deletePostVote")
    async delete(id: number): Promise<null> {
        return deletePostVote({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 204, true));
    }
}
