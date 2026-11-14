import { Schema } from "../util.js";

import Base from "./Base.js";

import type { Ban as BanData } from "e621-openapi/types";

interface Ban extends BanData {}
/** @category Models */
@Schema("Ban")
class Ban extends Base<BanData> {}

export default Ban;
