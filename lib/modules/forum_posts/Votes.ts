import Base from "../Base.js";
import { createForumPostVote, deleteForumPostVote } from "../../generated/sdk.js";
import type { CreateForumPostVoteData, CreateForumPostVoteResponses } from "../../generated/types.js";
import { OperationID, type ExtractValue } from "../../util.js";

/** @category Modules */
export default class ForumPostVotes extends Base {
    @OperationID("createForumPostVote")
    async create(id: number, score: ExtractValue<"forum_post_vote[score]", CreateForumPostVoteData>): Promise<CreateForumPostVoteResponses[200]> {
        return createForumPostVote({
            client: this.client,
            path:   { id },
            body:   { "forum_post_vote[score]": score }
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("deleteForumPostVote")
    async delete(id: number): Promise<null> {
        return deleteForumPostVote({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 204, true));
    }
}
