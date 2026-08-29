import { uploadKarmaEvents_index } from "../generated/sdk.js";
import UploadKarmaEvent from "../models/UploadKarmaEvent.js";
import { OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { UploadKarmaEventsIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface SearchUploadKarmaEventsOptions extends TransformDataQueryToOptions<UploadKarmaEventsIndexData> {}

/** @category Modules */
export default class UploadKarmaEvents extends Base {
    static readonly moduleKey = "uploadKarmaEvents" as const;
    @OperationID("upload_karma_events#index")
    async search(options?: SearchUploadKarmaEventsOptions): Promise<Array<UploadKarmaEvent>> {
        return uploadKarmaEvents_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, UploadKarmaEvent));
    }
}
