import Base from "./Base.js";
import type { PoolVersion as PoolVersionData } from "../generated/types.js";
import { OperationID, Schema } from "../util.js";

interface PoolVersion extends PoolVersionData {}
/** @category Models */
@Schema("PoolVersion")
class PoolVersion extends Base<PoolVersionData> {
    @OperationID("revertPool")
    async revertTo(): Promise<null> {
        return this.e621.pools.revert(this.pool_id, this.id);
    }
}

export default PoolVersion;
