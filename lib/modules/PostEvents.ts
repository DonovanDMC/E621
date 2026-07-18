import { postEvents_index } from "../generated/sdk.js";
import PostEvent from "../models/PostEvent.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { PostEvent as PostEventData, PostEventsIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface SearchPostEventsOptions extends TransformDataQueryToOptions<PostEventsIndexData> {}

/** @category Modules */
export default class PostEvents extends Base {
    static readonly moduleKey = "postEvents" as const;
    @OperationID("post_events#index")
    async search(options?: SearchPostEventsOptions): Promise<Array<PostEvent>> {
        return postEvents_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page", "v2"]),
        }).then((res) => {
            const data = this._handleResponse(res, 200, true);
            const raw = options?.v2 ? data as Array<PostEventData> : (data as { post_events: Array<PostEventData> }).post_events;
            return raw.map(item => new PostEvent(this.e621, item));
        });
    }
}
