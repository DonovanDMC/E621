import { searchPostEvents } from "../generated/sdk.js";
import { type SearchPostEventsData } from "../generated/types.js";
import PostEvent from "../models/PostEvent.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

/** @category Modules/Types */
export interface SearchPostEventsOptions extends TransformDataQueryToOptions<SearchPostEventsData> {}

/** @category Modules */
export default class PostEvents extends Base {
    @OperationID("searchPostEvents")
    async search(options?: SearchPostEventsOptions): Promise<Array<PostEvent>> {
        return searchPostEvents({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true).post_events.map(data => new PostEvent(this.e621, data)));
    }
}
