import { deletePostVotes, lockPostVotes, searchPostVotes } from "../generated/sdk.js";
import { SearchPostVotesData } from "../generated/types.js";
import PostVote from "../models/PostVote.js";
import { OperationID, TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

/** @category Modules/Types */
export interface SearchPostVotesOptions extends TransformDataQueryToOptions<SearchPostVotesData> {}

/** @category Modules */
export default class PostVotes extends Base {
    @OperationID("deletePostVotes")
    async delete(ids: Array<number>): Promise<null> {
        return deletePostVotes({
            client: this.client,
            query: { ids: ids.join(",") },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("lockPostVotes")
    async lock(ids: Array<number>): Promise<null> {
        return lockPostVotes({
            client: this.client,
            query: { ids: ids.join(",") },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("searchPostVotes")
    async search(options?: SearchPostVotesOptions): Promise<Array<PostVote>> {
        return searchPostVotes({
            client: this.client,
            query: options,
        }).then(res => this._handleResponse(res, 200, true, PostVote));
    }
}
