import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { BulkUpdateRequest as BulkUpdateRequestData } from "../generated/types.js";
import type { UpdateBulkUpdateRequestOptions } from "../modules/BulkUpdateRequests.js";

interface BulkUpdateRequest extends BulkUpdateRequestData {}
/** @category Models */
@Schema("BulkUpdateRequest")
class BulkUpdateRequest extends Base<BulkUpdateRequestData> {
    @OperationID("bulk_update_requests#approve")
    async approve(): Promise<null> {
        return this.e621.bulkUpdateRequests.approve(this.id);
    }

    @OperationID("bulk_update_requests#destroy")
    async reject(): Promise<null> {
        return this.e621.bulkUpdateRequests.reject(this.id);
    }

    @OperationID("bulk_update_requests#update")
    async update(options: UpdateBulkUpdateRequestOptions): Promise<null> {
        return this.e621.bulkUpdateRequests.update(this.id, options);
    }
}

export default BulkUpdateRequest;
