import {
    bulkUpdateRequests_approve,
    bulkUpdateRequests_create,
    bulkUpdateRequests_update,
    bulkUpdateRequests_show,
    bulkUpdateRequests_destroy,
    bulkUpdateRequests_index,
} from "../generated/sdk.js";
import BulkUpdateRequest from "../models/BulkUpdateRequest.js";
import { OperationID, prefixKeys, type TransformDataBodyToOptions, type TransformDataQueryToOptions } from "../util.js";

import Base from "./Base.js";

import type { BulkUpdateRequestsCreateData, BulkUpdateRequestsUpdateData, BulkUpdateRequestsIndexData } from "../generated/types.js";

/** @category Modules/Types */
export interface SearchBulkUpdateRequestsOptions extends TransformDataQueryToOptions<BulkUpdateRequestsIndexData> {}
/** @category Modules/Types */
export interface CreateBulkUpdateRequestOptions extends TransformDataBodyToOptions<BulkUpdateRequestsCreateData> {}
/** @category Modules/Types */
export interface UpdateBulkUpdateRequestOptions extends TransformDataBodyToOptions<BulkUpdateRequestsUpdateData> {}

/** @category Modules */
export default class BulkUpdateRequests extends Base {
    @OperationID("bulk_update_requests#approve")
    async approve(id: number): Promise<null> {
        return bulkUpdateRequests_approve({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("bulk_update_requests#create")
    async create(options: CreateBulkUpdateRequestOptions): Promise<BulkUpdateRequest> {
        return bulkUpdateRequests_create({
            client: this.client,
            body: options,
        }).then(res => this._handleResponse(res, 201, true, BulkUpdateRequest));
    }

    @OperationID("bulk_update_requests#show")
    async get(id: number): Promise<BulkUpdateRequest | null> {
        return bulkUpdateRequests_show({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 200, false, BulkUpdateRequest));
    }

    @OperationID("bulk_update_requests#destroy")
    async reject(id: number): Promise<null> {
        return bulkUpdateRequests_destroy({
            client: this.client,
            path: { id },
        }).then(res => this._handleResponse(res, 204, true));
    }

    @OperationID("bulk_update_requests#index")
    async search(options?: SearchBulkUpdateRequestsOptions): Promise<Array<BulkUpdateRequest>> {
        return bulkUpdateRequests_index({
            client: this.client,
            query: prefixKeys(options, "search", ["limit", "page"]),
        }).then(res => this._handleResponse(res, 200, true, BulkUpdateRequest));
    }

    @OperationID("bulk_update_requests#update")
    async update(id: number, options: UpdateBulkUpdateRequestOptions): Promise<null> {
        return bulkUpdateRequests_update({
            client: this.client,
            path: { id },
            body: options,
        }).then(res => this._handleResponse(res, 204, true));
    }
}
