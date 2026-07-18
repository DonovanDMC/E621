import { forumPostVotes_create, forumPostVotes_destroy, forumPostVotes_show } from "../generated/sdk.js";
import ForumPostVote from "../models/ForumPostVote.js";
import { GetResponse, OperationID, type ExtractValue } from "../util.js";

import Base from "./Base.js";

import type { ForumPostVotesCreateData, ForumPostVotesCreateResponses } from "../generated/types.js";

/** @category Modules/Types */
export type ForumPostVoteScore = ExtractValue<"score", ForumPostVotesCreateData>;
/** @category Modules/Types */
export interface ForumPostVotesCreateResponse extends GetResponse<ForumPostVotesCreateResponses, 200> {}

/** @category Modules */
export default class ForumPostVotes extends Base {
    static readonly moduleKey = "forumPostVotes" as const;
    @OperationID("forum_post_votes#create")
    async create(id: number, score: ForumPostVoteScore): Promise<ForumPostVotesCreateResponse> {
        return forumPostVotes_create({
            client: this.client,
            path: { id },
            body: { score },
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("forum_post_votes#destroy")
    async delete(id: number): Promise<null> {
        return forumPostVotes_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("forum_post_votes#show")
    async list(id: number): Promise<Array<ForumPostVote>> {
        return forumPostVotes_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, true, ForumPostVote));
    }
}
