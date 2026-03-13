import Base from "./Base.js";
import type { RisingSearchTrend as RisingSearchTrendData } from "../generated/types.js";
import { Schema } from "../util.js";

interface RisingSearchTrend extends RisingSearchTrendData {}
/** @category Models */
@Schema("RisingSearchTrend")
class RisingSearchTrend extends Base<RisingSearchTrendData> {}

export default RisingSearchTrend;
