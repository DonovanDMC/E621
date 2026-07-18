import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { PoolVersion as PoolVersionData } from "../generated/types.js";

interface PoolVersion extends PoolVersionData {}
/** @category Models */
@Schema("PoolVersion")
class PoolVersion extends Base<PoolVersionData> {
    @OperationID("pools#revert")
    async revertTo(): Promise<null> {
        return this.e621.pools.revert(this.pool_id, this.id);
    }
}

export default PoolVersion;
