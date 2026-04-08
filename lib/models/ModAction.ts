import { Schema } from "../util.js";

import Base from "./Base.js";

import type { ModAction as ModActionData } from "../generated/types.js";

interface ModAction extends ModActionData {}
/** @category Models */
@Schema("ModAction")
class ModAction extends Base<ModActionData> {}

export default ModAction;
