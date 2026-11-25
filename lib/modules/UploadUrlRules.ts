import { uploadUrlRules_check, uploadUrlRules_index } from "e621-openapi/sdk";

import UploadURLRule from "../models/UploadURLRule.js";
import { GetResponse, OperationID, prefixKeys, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { UploadUrlRulesCheckResponses, UploadUrlRulesIndexData } from "e621-openapi/types";

/** @category Modules/Types */
export interface SearchUploadURLRulesOptions extends TransformDataQueryToOptions<UploadUrlRulesIndexData> {}
/** @category Modules/Types */
export interface UploadURLRulesCheckResponse extends GetResponse<UploadUrlRulesCheckResponses, 200> {}

/** @category Modules */
export default class UploadUrlRules extends Base {
    static readonly moduleKey = "uploadUrlRules" as const;
    @OperationID("upload_url_rules#check")
    async check(url: string): Promise<UploadURLRulesCheckResponse> {
        return uploadUrlRules_check({
            client: this.client,
            query: { url },
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("upload_url_rules#index")
    async search(options?: SearchUploadURLRulesOptions): Promise<Array<UploadURLRule>> {
        return uploadUrlRules_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, UploadURLRule));
    }
}
