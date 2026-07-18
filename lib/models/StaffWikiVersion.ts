import { Schema } from "../util.js";

import Base from "./Base.js";

import type { StaffWikiVersion as StaffWikiVersionData } from "../generated/types.js";

interface StaffWikiVersion extends StaffWikiVersionData {}
/** @category Models */
@Schema("StaffWikiVersion")
class StaffWikiVersion extends Base<StaffWikiVersionData> {}

export default StaffWikiVersion;
