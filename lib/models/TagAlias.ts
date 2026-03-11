import Base from "./Base.js";
import type { TagAlias as TagAliasData } from "../generated/types.js";
import { OperationID, Schema } from "../util.js";
import type { EditTagAliasOptions } from "../modules/TagAliases.js";

interface TagAlias extends TagAliasData {}
/** @category Models */
@Schema("TagAlias")
class TagAlias extends Base<TagAliasData> {
    @OperationID("approveTagAlias")
    async approve(): Promise<null> {
        return this.e621.tagAliases.approve(this.id);
    }

    @OperationID("editTagAlias")
    async edit(options: EditTagAliasOptions): Promise<null> {
        return this.e621.tagAliases.edit(this.id, options);
    }

    @OperationID("rejectTagAlias")
    async reject(): Promise<null> {
        return this.e621.tagAliases.reject(this.id);
    }
}

export default TagAlias;
