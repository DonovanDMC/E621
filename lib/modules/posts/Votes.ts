import { createPostVote, deletePostVote } from "../../generated/sdk.js";
import { GetResponse, OperationID, type ExtractValue } from "../../util.js";
import Base from "../Base.js";

import type { CreatePostVoteData, CreatePostVoteResponses } from "../../generated/types.js";

/** @category Modules/Types */
export type PostVoteScore = ExtractValue<"score", CreatePostVoteData>;
/** @category Modules/Types */
export interface CreatePostVoteResponse extends GetResponse<CreatePostVoteResponses, 200> {}

/** @category Modules */
export default class PostVotes extends Base {
    @OperationID("createPostVote")
    async create(id: number, score: PostVoteScore, no_unvote?: boolean): Promise<CreatePostVoteResponse> {
        return createPostVote({
            client: this.client,
            path: { id },
            query: { no_unvote, score },
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("deletePostVote")
    async delete(id: number): Promise<null> {
        return deletePostVote({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }
}
