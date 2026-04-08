import { Schema } from "../util.js";

import Base from "./Base.js";

import type { Ban as BanData } from "../generated/types.js";

interface Ban extends BanData {}
/** @category Models */
@Schema("Ban")
class Ban extends Base<BanData> {}

export default Ban;
