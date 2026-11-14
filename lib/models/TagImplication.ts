import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type { UpdateTagImplicationOptions } from "../modules/TagImplications.js";
import type { TagImplication as TagImplicationData } from "e621-openapi/types";

interface TagImplication extends TagImplicationData {}
/** @category Models */
@Schema("TagImplication")
class TagImplication extends Base<TagImplicationData> {
    @OperationID("tag_implications#approve")
    async approve(): Promise<null> {
        return this.e621.tagImplications.approve(this.id);
    }

    @OperationID("tag_implications#destroy")
    async reject(): Promise<null> {
        return this.e621.tagImplications.reject(this.id);
    }

    @OperationID("tag_implications#update")
    async update(options: UpdateTagImplicationOptions): Promise<null> {
        return this.e621.tagImplications.update(this.id, options);
    }
}

export default TagImplication;
