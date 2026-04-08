import { deletePostVotes, lockPostVotes } from "../generated/sdk.js";
import { OperationID } from "../util.js";

import Base from "./Base.js";

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
}
