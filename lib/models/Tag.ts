import Base from "./Base.js";
import type TagCorrection from "./TagCorrection.js";
import type TagPreview from "./TagPreview.js";
import type { Tag as TagData } from "../generated/types.js";
import { OperationID, Schema } from "../util.js";
import type { EditTagOptions } from "../modules/Tags.js";

interface Tag extends TagData {}
/** @category Models */
@Schema("Tag")
class Tag extends Base<TagData> {
    @OperationID("deleteTag")
    async delete(): Promise<null> {
        return this.e621.tags.delete(this.id);
    }

    @OperationID("editTag")
    async edit(options: EditTagOptions): Promise<null> {
        return this.e621.tags.edit(this.id, options);
    }

    @OperationID("getTagCorrection")
    async getCorrection(): Promise<TagCorrection> {
        return this.e621.tagCorrections.get(this.id);
    }

    @OperationID("previewTags")
    async preview(): Promise<Array<TagPreview>> {
        return this.e621.tags.preview(this.name);
    }

}

export default Tag;
