import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { AvoidPosting as AvoidPostingData } from "../generated/types.js";
import type { UpdateAvoidPostingOptions } from "../modules/AvoidPostings.js";

interface AvoidPosting extends AvoidPostingData {}
/** @category Models */
@Schema("AvoidPosting")
class AvoidPosting extends Base<AvoidPostingData> {
    @OperationID("avoid_postings#delete")
    async delete(): Promise<null> {
        return this.e621.avoidPostings.delete(this.id);
    }

    @OperationID("avoid_postings#destroy")
    async destroy(): Promise<null> {
        return this.e621.avoidPostings.destroy(this.id);
    }

    @OperationID("avoid_postings#undelete")
    async undelete(): Promise<null> {
        return this.e621.avoidPostings.undelete(this.id);
    }

    @OperationID("avoid_postings#update")
    async update(options: UpdateAvoidPostingOptions): Promise<null> {
        return this.e621.avoidPostings.update(this.id, options);
    }
}

export default AvoidPosting;
