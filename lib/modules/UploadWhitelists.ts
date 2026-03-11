import Base from "./Base.js";
import {
    checkIfUrlIsAllowed,
    createUploadWhitelist,
    deleteUploadWhitelist,
    editUploadWhitelist,
    searchUploadWhitelists
} from "../generated/sdk.js";
import type { CheckIfUrlIsAllowedResponses, CreateUploadWhitelistData, EditUploadWhitelistData, SearchUploadWhitelistsData } from "../generated/types.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";
import UploadWhitelist from "../models/UploadWhitelist.js";

/** @category Modules/Types */
export interface CreateUploadWhitelistOptions extends TransformDataBodyToOptions<CreateUploadWhitelistData> {}
/** @category Modules/Types */
export interface EditUploadWhitelistOptions extends TransformDataBodyToOptions<EditUploadWhitelistData> {}
/** @category Modules/Types */
export interface SearchUploadWhitelistsOptions extends TransformDataQueryToOptions<SearchUploadWhitelistsData> {}

/** @category Modules */
export default class UploadWhitelists extends Base {
    @OperationID("checkIfUrlIsAllowed")
    async check(url: string): Promise<CheckIfUrlIsAllowedResponses[200]> {
        return checkIfUrlIsAllowed({
            client: this.client,
            query:  { url }
        }).then(res => this._handleResponse(res, 200, true));
    }

    @OperationID("createUploadWhitelist")
    async create(options: CreateUploadWhitelistOptions): Promise<UploadWhitelist> {
        return createUploadWhitelist({
            client: this.client,
            body:   prefixKeys(options, "upload_whitelist")
        }).then(res => this._handleResponse(res, 201, true, UploadWhitelist));
    }

    @OperationID("deleteUploadWhitelist")
    async delete(id: number): Promise<null> {
        return deleteUploadWhitelist({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("editUploadWhitelist")
    async edit(id: number, options: EditUploadWhitelistOptions): Promise<null> {
        return editUploadWhitelist({
            client: this.client,
            path:   { id },
            body:   prefixKeys(options, "upload_whitelist")
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("searchUploadWhitelists")
    async search(options?: SearchUploadWhitelistsOptions): Promise<Array<UploadWhitelist>> {
        return searchUploadWhitelists({
            client: this.client,
            query:  prefixKeys(options, "search", ["limit", "page"])
        }).then(res => this._handleResponse(res, 200, true, UploadWhitelist));
    }
}
