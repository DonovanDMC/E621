import Base from "./Base.js";
import type { AvoidPosting as AvoidPostingData } from "../generated/types.js";
import { OperationID, Schema } from "../util.js";
import type { EditAvoidPostingOptions } from "../modules/AvoidPostings.js";

interface AvoidPosting extends AvoidPostingData {}
/** @category Models */
@Schema("AvoidPosting")
class AvoidPosting extends Base<AvoidPostingData> {
    @OperationID("deleteAvoidPosting")
    async delete(): Promise<null> {
        return this.e621.avoidPostings.delete(this.id);
    }

    @OperationID("destroyAvoidPosting")
    async destroy(): Promise<null> {
        return this.e621.avoidPostings.destroy(this.id);
    }

    @OperationID("editAvoidPosting")
    async edit(options: EditAvoidPostingOptions): Promise<null> {
        return this.e621.avoidPostings.edit(this.id, options);
    }

    @OperationID("undeleteAvoidPosting")
    async undelete(): Promise<null> {
        return this.e621.avoidPostings.undelete(this.id);
    }

}

export default AvoidPosting;
