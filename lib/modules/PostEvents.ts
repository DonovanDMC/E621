import { postEvents_index } from "e621-openapi/sdk";

import PostEvent from "../models/PostEvent.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { PostEvent as PostEventData, PostEventsIndexData } from "e621-openapi/types";

/** @category Modules/Types */
export interface SearchPostEventsOptions extends TransformDataQueryToOptions<PostEventsIndexData> {}

/** @category Modules */
export default class PostEvents extends Base {
    static readonly moduleKey = "postEvents" as const;
    @OperationID("post_events#index")
    async search(options?: SearchPostEventsOptions): Promise<Array<PostEvent>> {
        return postEvents_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page", "v1"]),
        }).then((res) => {
            const data = this._handleResponse(res, 200, true);
            const raw = options?.v1 ? (data as { post_events: Array<PostEventData> }).post_events : data as Array<PostEventData>;
            return raw.map(item => new PostEvent(this.e621, item));
        });
    }
}
