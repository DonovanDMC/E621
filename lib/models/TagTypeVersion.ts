import { Schema } from "../util.js";

import Base from "./Base.js";

import type { TagTypeVersion as TagTypeVersionData } from "e621-openapi/types";

interface TagTypeVersion extends TagTypeVersionData {}
/** @category Models */
@Schema("TagTypeVersion")
class TagTypeVersion extends Base<TagTypeVersionData> {}

export default TagTypeVersion;
