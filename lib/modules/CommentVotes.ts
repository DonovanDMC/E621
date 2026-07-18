import { commentVotes_create, commentVotes_delete, commentVotes_destroy, commentVotes_lock, commentVotes_index } from "../generated/sdk.js";
import CommentVote from "../models/CommentVote.js";
import { GetResponse, OperationID, type ExtractValue, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { CommentVotesCreateData, CommentVotesCreateResponses, CommentVotesIndexData } from "../generated/types.js";

/** @category Modules/Types */
export type CommentVoteScore = ExtractValue<"score", CommentVotesCreateData>;
/** @category Modules/Types */
export interface CommentVotesCreateResponse extends GetResponse<CommentVotesCreateResponses, 200> {}
/** @category Modules/Types */
export interface SearchCommentVotesOptions extends TransformDataQueryToOptions<CommentVotesIndexData> {}

/** @category Modules */
export default class CommentVotes extends Base {
    @OperationID("comment_votes#create")
    async create(id: number, score: CommentVoteScore, no_unvote?: boolean): Promise<CommentVotesCreateResponse> {
        return commentVotes_create({
            client: this.client,
            path: { id },
            query: { no_unvote, score },
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("comment_votes#delete")
    async delete(ids: Array<number>): Promise<null> {
        return commentVotes_delete({
            client: this.client,
            query: { ids: ids.join(",") },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("comment_votes#lock")
    async lock(ids: Array<number>): Promise<null> {
        return commentVotes_lock({
            client: this.client,
            query: { ids: ids.join(",") },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("comment_votes#index")
    async search(options?: SearchCommentVotesOptions): Promise<Array<CommentVote>> {
        return commentVotes_index({
            client: this.client,
            query: options,
        }).then(res => this._handleResponse(res, 200, true, CommentVote));
    }

    @OperationID("comment_votes#destroy")
    async unvote(id: number): Promise<null> {
        return commentVotes_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }
}
