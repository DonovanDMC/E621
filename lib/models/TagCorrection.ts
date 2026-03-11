import Base from "./Base.js";
import type { TagCorrection as TagCorrectionData } from "../generated/types.js";
import { Schema } from "../util.js";

interface TagCorrection extends TagCorrectionData {}
/** @category Models */
@Schema("TagCorrection")
class TagCorrection extends Base<TagCorrectionData> {
    async correct(): Promise<string> {
        return this.e621.tagCorrections.correct(this.tag.id);
    }
}

export default TagCorrection;
