import { OperationID, Schema } from "../util.js";

import Base from "./Base.js";

import type TagCorrection from "./TagCorrection.js";
import type TagPreview from "./TagPreview.js";
import type { Tag as TagData } from "../generated/types.js";
import type { UpdateTagOptions } from "../modules/Tags.js";

interface Tag extends TagData {}
/** @category Models */
@Schema("Tag")
class Tag extends Base<TagData> {
    @OperationID("tags#destroy")
    async delete(): Promise<null> {
        return this.e621.tags.delete(this.id);
    }

    @OperationID("tag_corrections#show")
    async getCorrection(): Promise<TagCorrection> {
        return this.e621.tagCorrections.get(this.id);
    }

    @OperationID("tags#preview")
    async preview(): Promise<Array<TagPreview>> {
        return this.e621.tags.preview(this.name);
    }

    @OperationID("tags#update")
    async update(options: UpdateTagOptions): Promise<null> {
        return this.e621.tags.update(this.id, options);
    }
}

export default Tag;
