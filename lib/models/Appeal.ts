import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { Appeal as AppealData } from "../generated/types.js";
import type { UpdateAppealOptions } from "../modules/Appeals.js";

interface Appeal extends AppealData {}
/** @category Models */
@Schema("Appeal")
class Appeal extends Base<AppealData> {
    @OperationID("appeals#claim")
    async claim(): Promise<Appeal> {
        return this.e621.appeals.claim(this.id);
    }

    @OperationID("appeals#unclaim")
    async unclaim(): Promise<Appeal> {
        return this.e621.appeals.unclaim(this.id);
    }

    @OperationID("appeals#update")
    async update(options: UpdateAppealOptions): Promise<null> {
        return this.e621.appeals.update(this.id, options);
    }
}

export default Appeal;
