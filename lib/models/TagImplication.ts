import Base from "./Base.js";
import type { TagImplication as TagImplicationData } from "../generated/types.js";
import { OperationID, Schema } from "../util.js";
import type { EditTagImplicationOptions } from "../modules/TagImplications.js";

interface TagImplication extends TagImplicationData {}
/** @category Models */
@Schema("TagImplication")
class TagImplication extends Base<TagImplicationData> {
    @OperationID("approveTagImplication")
    async approve(): Promise<null> {
        return this.e621.tagImplications.approve(this.id);
    }

    @OperationID("editTagImplication")
    async edit(options: EditTagImplicationOptions): Promise<null> {
        return this.e621.tagImplications.edit(this.id, options);
    }

    @OperationID("rejectTagImplication")
    async reject(): Promise<null> {
        return this.e621.tagImplications.reject(this.id);
    }

}

export default TagImplication;
