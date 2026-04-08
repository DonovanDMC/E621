import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { Pool as PoolData } from "../generated/types.js";
import type { EditPoolOptions } from "../modules/Pools.js";

interface Pool extends PoolData {}
/** @category Models */
@Schema("Pool")
class Pool extends Base<PoolData> {
    @OperationID("addPostToPool")
    async addPost(post_id: number): Promise<Pool> {
        return this.e621.pools.addPost(this.id, post_id);
    }

    @OperationID("deletePool")
    async delete(): Promise<null> {
        return this.e621.pools.delete(this.id);
    }

    @OperationID("editPool")
    async edit(options: EditPoolOptions): Promise<null> {
        return this.e621.pools.edit(this.id, options);
    }

    @OperationID("removePostFromPool")
    async removePost(post_id: number): Promise<null> {
        return this.e621.pools.removePost(this.id, post_id);
    }

    @OperationID("revertPool")
    async revert(version_id: number): Promise<null> {
        return this.e621.pools.revert(this.id, version_id);
    }
}

export default Pool;
