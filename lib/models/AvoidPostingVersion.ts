import { Schema } from "../util.js";

import Base from "./Base.js";

import type { AvoidPostingVersion as AvoidPostingVersionData } from "e621-openapi/types";

interface AvoidPostingVersion extends AvoidPostingVersionData {}
/** @category Models */
@Schema("AvoidPostingVersion")
class AvoidPostingVersion extends Base<AvoidPostingVersionData> {}

export default AvoidPostingVersion;
