import {
    uploadWhitelists_isAllowed,
    uploadWhitelists_create,
    uploadWhitelists_destroy,
    uploadWhitelists_update,
    uploadWhitelists_index,
} from "../generated/sdk.js";
import UploadWhitelist from "../models/UploadWhitelist.js";
import {
    GetResponse,
    OperationID,
    prefixKeys,
    type TransformDataBodyToOptions,
    type TransformDataQueryToOptions,
} from "../util.js";

import Base from "./Base.js";

import type { UploadWhitelistsIsAllowedResponses, UploadWhitelistsCreateData, UploadWhitelistsUpdateData, UploadWhitelistsIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface CreateUploadWhitelistOptions extends TransformDataBodyToOptions<UploadWhitelistsCreateData> {}
/** @category Modules/Types */
export interface UpdateUploadWhitelistOptions extends TransformDataBodyToOptions<UploadWhitelistsUpdateData> {}
/** @category Modules/Types */
export interface SearchUploadWhitelistsOptions extends TransformDataQueryToOptions<UploadWhitelistsIndexData> {}
/** @category Modules/Types */
export interface UploadWhitelistsIsAllowedResponse extends GetResponse<UploadWhitelistsIsAllowedResponses, 200> {}

/** @category Modules */
export default class UploadWhitelists extends Base {
    static readonly moduleKey = "uploadWhitelists" as const;
    @OperationID("upload_whitelists#is_allowed")
    async check(url: string): Promise<UploadWhitelistsIsAllowedResponse> {
        return uploadWhitelists_isAllowed({
            client: this.client,
            query: { url },
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("upload_whitelists#create")
    async create(options: CreateUploadWhitelistOptions): Promise<UploadWhitelist> {
        return uploadWhitelists_create({
            client: this.client,
            body: prefixKeys(options, "upload_whitelist"),
        }).then(res => this._handleResponse(res, 201, true, UploadWhitelist));
    }

    @OperationID("upload_whitelists#destroy")
    async delete(id: number): Promise<null> {
        return uploadWhitelists_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("upload_whitelists#index")
    async search(options?: SearchUploadWhitelistsOptions): Promise<Array<UploadWhitelist>> {
        return uploadWhitelists_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, UploadWhitelist));
    }

    @OperationID("upload_whitelists#update")
    async update(id: number, options: UpdateUploadWhitelistOptions): Promise<null> {
        return uploadWhitelists_update({
            client: this.client,
            path: { id },
            body: prefixKeys(options, "upload_whitelist"),
        }).then(res => this._handleResponse(res, 204, true));
    }
}
