import Base from "./Base.js";
import type { TagPreview as TagPreviewData } from "../generated/types.js";
import { Schema } from "../util.js";

interface TagPreview extends TagPreviewData {}
/** @category Models */
@Schema("TagPreview")
class TagPreview extends Base<TagPreviewData> {}

export default TagPreview;
