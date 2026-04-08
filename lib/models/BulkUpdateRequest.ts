import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { BulkUpdateRequest as BulkUpdateRequestData } from "../generated/types.js";
import type { EditBulkUpdateRequestOptions } from "../modules/BulkUpdateRequests.js";

interface BulkUpdateRequest extends BulkUpdateRequestData {}
/** @category Models */
@Schema("BulkUpdateRequest")
class BulkUpdateRequest extends Base<BulkUpdateRequestData> {
    @OperationID("approveBulkUpdateRequest")
    async approve(): Promise<null> {
        return this.e621.bulkUpdateRequests.approve(this.id);
    }

    @OperationID("editBulkUpdateRequest")
    async edit(options: EditBulkUpdateRequestOptions): Promise<null> {
        return this.e621.bulkUpdateRequests.edit(this.id, options);
    }

    @OperationID("rejectBulkUpdateRequest")
    async reject(): Promise<null> {
        return this.e621.bulkUpdateRequests.reject(this.id);
    }
}

export default BulkUpdateRequest;
