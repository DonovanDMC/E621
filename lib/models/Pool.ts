import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { Pool as PoolData } from "../generated/types.js";
import type { UpdatePoolOptions } from "../modules/Pools.js";

interface Pool extends PoolData {}
/** @category Models */
@Schema("Pool")
class Pool extends Base<PoolData> {
    @OperationID("pool_elements#create")
    async addPost(post_id: number): Promise<Pool> {
        return this.e621.pools.addPost(this.id, post_id);
    }

    @OperationID("pools#destroy")
    async delete(): Promise<null> {
        return this.e621.pools.delete(this.id);
    }

    @OperationID("pool_elements#destroy")
    async removePost(post_id: number): Promise<null> {
        return this.e621.pools.removePost(this.id, post_id);
    }

    @OperationID("pools#revert")
    async revert(version_id: number): Promise<null> {
        return this.e621.pools.revert(this.id, version_id);
    }

    @OperationID("pools#update")
    async update(options: UpdatePoolOptions): Promise<null> {
        return this.e621.pools.update(this.id, options);
    }
}

export default Pool;
