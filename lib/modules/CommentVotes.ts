import Base from "./Base.js";
import { deleteCommentVotes, lockCommentVotes } from "../generated/sdk.js";
import { OperationID } from "../util.js";

/** @category Modules */
export default class CommentVotes extends Base {
    @OperationID("deleteCommentVotes")
    async delete(ids: Array<number>): Promise<null> {
        return deleteCommentVotes({
            client: this.client,
            query:  { ids: ids.join(",") }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("lockCommentVotes")
    async lock(ids: Array<number>): Promise<null> {
        return lockCommentVotes({
            client: this.client,
            query:  { ids: ids.join(",") }
        }).then(res => this._handleResponse(res, 204, true));
    }
}
