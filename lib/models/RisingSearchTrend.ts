import { Schema } from "../util.js";

import Base from "./Base.js";

import type { RisingSearchTrend as RisingSearchTrendData } from "e621-openapi/types";

interface RisingSearchTrend extends RisingSearchTrendData {}
/** @category Models */
@Schema("RisingSearchTrend")
class RisingSearchTrend extends Base<RisingSearchTrendData> {}

export default RisingSearchTrend;
