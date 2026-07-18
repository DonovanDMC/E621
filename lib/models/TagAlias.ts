import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { TagAlias as TagAliasData } from "../generated/types.js";
import type { UpdateTagAliasOptions } from "../modules/TagAliases.js";

interface TagAlias extends TagAliasData {}
/** @category Models */
@Schema("TagAlias")
class TagAlias extends Base<TagAliasData> {
    @OperationID("tag_aliases#approve")
    async approve(): Promise<null> {
        return this.e621.tagAliases.approve(this.id);
    }

    @OperationID("tag_aliases#destroy")
    async reject(): Promise<null> {
        return this.e621.tagAliases.reject(this.id);
    }

    @OperationID("tag_aliases#update")
    async update(options: UpdateTagAliasOptions): Promise<null> {
        return this.e621.tagAliases.update(this.id, options);
    }
}

export default TagAlias;
