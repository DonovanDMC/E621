import { Schema } from "../util.js";

import Base from "./Base.js";

import type { TagPreview as TagPreviewData } from "e621-openapi/types";

interface TagPreview extends TagPreviewData {}
/** @category Models */
@Schema("TagPreview")
class TagPreview extends Base<TagPreviewData> {}

export default TagPreview;
