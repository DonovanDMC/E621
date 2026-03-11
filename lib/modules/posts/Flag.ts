import { unflagPost } from "../../generated/sdk.js";
import { OperationID } from "../../util.js";
import Base from "../Base.js";

/** @category Modules */
export default class PostFlag extends Base {
    @OperationID("unflagPost")
    async delete(id: number): Promise<null> {
        return unflagPost({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 204, true));
    }
}
