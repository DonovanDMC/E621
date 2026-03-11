import Base from "./Base.js";
import {
    approveBulkUpdateRequest,
    createBulkUpdateRequest,
    editBulkUpdateRequest,
    getBulkUpdateRequest,
    rejectBulkUpdateRequest,
    searchBulkUpdateRequests
} from "../generated/sdk.js";
import type { CreateBulkUpdateRequestData, EditBulkUpdateRequestData, SearchBulkUpdateRequestsData } from "../generated/types.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";
import BulkUpdateRequest from "../models/BulkUpdateRequest.js";

/** @category Modules/Types */
export interface SearchBulkUpdateRequestsOptions extends TransformDataQueryToOptions<SearchBulkUpdateRequestsData> {}
/** @category Modules/Types */
export interface CreateBulkUpdateRequestOptions extends TransformDataBodyToOptions<CreateBulkUpdateRequestData> {}
/** @category Modules/Types */
export interface EditBulkUpdateRequestOptions extends TransformDataBodyToOptions<EditBulkUpdateRequestData> {}

/** @category Modules */
export default class BulkUpdateRequests extends Base {
    @OperationID("approveBulkUpdateRequest")
    async approve(id: number): Promise<null> {
        return approveBulkUpdateRequest({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("createBulkUpdateRequest")
    async create(options: CreateBulkUpdateRequestOptions): Promise<BulkUpdateRequest> {
        return createBulkUpdateRequest({
            client: this.client,
            body:   prefixKeys(options, "bulk_update_request")
        }).then(res => this._handleResponse(res, 201, true, BulkUpdateRequest));
    }

    @OperationID("editBulkUpdateRequest")
    async edit(id: number, options: EditBulkUpdateRequestOptions): Promise<null> {
        return editBulkUpdateRequest({
            client: this.client,
            path:   { id },
            body:   prefixKeys(options, "bulk_update_request")
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("getBulkUpdateRequest")
    async get(id: number): Promise<BulkUpdateRequest | null> {
        return getBulkUpdateRequest({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 200, false, BulkUpdateRequest));
    }

    @OperationID("rejectBulkUpdateRequest")
    async reject(id: number): Promise<null> {
        return rejectBulkUpdateRequest({
            client: this.client,
            path:   { id }
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("searchBulkUpdateRequests")
    async search(options?: SearchBulkUpdateRequestsOptions): Promise<Array<BulkUpdateRequest>> {
        return searchBulkUpdateRequests({
            client: this.client,
            query:  prefixKeys(options, "search", ["limit", "page"])
        }).then(res => this._handleResponse(res, 200, true, BulkUpdateRequest));
    }
}
