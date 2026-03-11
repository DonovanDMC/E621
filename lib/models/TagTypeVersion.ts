import Base from "./Base.js";
import type { TagTypeVersion as TagTypeVersionData } from "../generated/types.js";
import { Schema } from "../util.js";

interface TagTypeVersion extends TagTypeVersionData {}
/** @category Models */
@Schema("TagTypeVersion")
class TagTypeVersion extends Base<TagTypeVersionData> {}

export default TagTypeVersion;
