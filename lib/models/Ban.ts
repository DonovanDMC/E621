import Base from "./Base.js";
import type { Ban as BanData } from "../generated/types.js";
import { Schema } from "../util.js";

interface Ban extends BanData {}
/** @category Models */
@Schema("Ban")
class Ban extends Base<BanData> {}

export default Ban;
