import { postVotes_create, postVotes_delete, postVotes_destroy, postVotes_lock, postVotes_index } from "../generated/sdk.js";
import PostVote from "../models/PostVote.js";
import { GetResponse, OperationID, type ExtractValue, TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { PostVotesCreateData, PostVotesCreateResponses, PostVotesIndexData } from "../generated/types.js";

/** @category Modules/Types */
export type PostVoteScore = ExtractValue<"score", PostVotesCreateData>;
/** @category Modules/Types */
export interface PostVotesCreateResponse extends GetResponse<PostVotesCreateResponses, 200> {}
/** @category Modules/Types */
export interface SearchPostVotesOptions extends TransformDataQueryToOptions<PostVotesIndexData> {}

/** @category Modules */
export default class PostVotes extends Base {
    static readonly moduleKey = "postVotes" as const;
    @OperationID("post_votes#create")
    async create(id: number, score: PostVoteScore, no_unvote?: boolean): Promise<PostVotesCreateResponse> {
        return postVotes_create({
            client: this.client,
            path: { id },
            query: { no_unvote, score },
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("post_votes#delete")
    async delete(ids: Array<number>): Promise<null> {
        return postVotes_delete({
            client: this.client,
            query: { ids: ids.join(",") },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("post_votes#lock")
    async lock(ids: Array<number>): Promise<null> {
        return postVotes_lock({
            client: this.client,
            query: { ids: ids.join(",") },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("post_votes#index")
    async search(options?: SearchPostVotesOptions): Promise<Array<PostVote>> {
        return postVotes_index({
            client: this.client,
            query: options,
        }).then(res => this._handleResponse(res, 200, true, PostVote));
    }

    @OperationID("post_votes#destroy")
    async unvote(id: number): Promise<null> {
        return postVotes_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }
}
