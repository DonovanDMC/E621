import Base from "./Base.js";
import type { AvoidPostingVersion as AvoidPostingVersionData } from "../generated/types.js";
import { Schema } from "../util.js";

interface AvoidPostingVersion extends AvoidPostingVersionData {}
/** @category Models */
@Schema("AvoidPostingVersion")
class AvoidPostingVersion extends Base<AvoidPostingVersionData> {}

export default AvoidPostingVersion;
