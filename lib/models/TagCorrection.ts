import { Schema } from "../util.js";

import Base from "./Base.js";

import type { TagCorrection as TagCorrectionData } from "e621-openapi/types";

interface TagCorrection extends TagCorrectionData {}
/** @category Models */
@Schema("TagCorrection")
class TagCorrection extends Base<TagCorrectionData> {
    async correct(): Promise<string> {
        return this.e621.tagCorrections.correct(this.tag.id);
    }
}

export default TagCorrection;
